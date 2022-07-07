// Copyright (c) 2018 Bhojpur Consulting Private Limited, India. All rights reserved.

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

const logger = require('winston');
const express = require('express');
const Handlebars = require('handlebars');
const fs = require('fs-extra');
const moment = require('moment');

const path = require('path');
const Document = require('@bhojpur/common/models/document');
const Template = require('@bhojpur/common/models/template');
const Tenant = require('@bhojpur/common/models/tenant');
const Lease = require('@bhojpur/common/models/lease');
const Format = require('@bhojpur/common/utils/format');
const config = require('../config');
const pdf = require('../pdf');
const uploadMiddleware = require('../utils/uploadmiddelware');
const s3 = require('../utils/s3');
const multer = require('multer');

async function _getTempate(organization, templateId) {
  const template = (
    await Template.findOne({
      _id: templateId,
      realmId: organization._id,
    })
  )?.toObject();

  return template;
}

async function _getTemplateValues(organization, tenantId, leaseId) {
  const tenant = (
    await Tenant.findOne({
      _id: tenantId,
      realmId: organization._id,
    }).populate('properties.propertyId')
  )?.toObject();

  const lease = (
    await Lease.findOne({
      _id: leaseId,
      realmId: organization._id,
    })
  )?.toObject();

  // compute rent, expenses and surface from properties
  const PropertyGlobals = tenant.properties.reduce(
    (acc, { rent, expenses = [], property: { surface } }) => {
      acc.rentAmount += rent;
      acc.expensesAmount +=
        expenses.reduce((sum, { amount }) => {
          sum += amount;
          return sum;
        }, 0) || 0;
      acc.surface += surface;
      return acc;
    },
    { rentAmount: 0, expensesAmount: 0, surface: 0 }
  );

  const landlordCompanyInfo = organization.companyInfo
    ? {
        ...organization.companyInfo,
        capital: organization.companyInfo.capital
          ? Format.formatCurrency(
              organization.locale,
              organization.currency,
              organization.companyInfo.capital
            )
          : '',
      }
    : null;

  moment.locale(organization.locale);
  const today = moment();
  const templateValues = {
    current: {
      date: today.format('LL'),
      location: organization.addresses?.[0]?.city,
    },

    landlord: {
      name: organization.name,
      contact: organization.contacts?.[0] || {},
      address: organization.addresses?.[0] || {},
      companyInfo: landlordCompanyInfo,
    },

    tenant: {
      name: tenant?.name,

      companyInfo: {
        legalRepresentative: tenant?.manager,
        legalStructure: tenant?.legalForm,
        capital: tenant?.capital
          ? Format.formatCurrency(
              organization.locale,
              organization.currency,
              tenant.capital
            )
          : '',
        ein: tenant?.siret,
        dos: tenant?.rcs,
      },

      address: {
        street1: tenant?.street1,
        street2: tenant?.street2,
        zipCode: tenant?.zipCode,
        city: tenant?.city,
        state: tenant?.state,
        country: tenant?.country,
      },

      contacts:
        tenant?.contacts.map(({ contact, email, phone }) => ({
          name: contact,
          email,
          phone,
        })) || [],
    },

    properties: {
      total: {
        surface: Format.formatNumber(
          organization.locale,
          PropertyGlobals.surface
        ),
        rentAmount: Format.formatCurrency(
          organization.locale,
          organization.currency,
          PropertyGlobals.rentAmount
        ),
        expensesAmount: Format.formatCurrency(
          organization.locale,
          organization.currency,
          PropertyGlobals.expensesAmount
        ),
      },
      list: tenant?.properties.map(
        ({
          propertyId: {
            name,
            description,
            type,
            surface,
            phone,
            address,
            digicode,
            price,
          },
        }) => ({
          name,
          description,
          type,
          rent: Format.formatCurrency(
            organization.locale,
            organization.currency,
            price
          ),
          surface: Format.formatNumber(organization.locale, surface),
          phone,
          address,
          digicode,
        })
      ),
    },

    lease: {
      name: lease?.name,
      description: lease?.description,
      numberOfTerms: lease?.numberOfTerms,
      timeRange: lease?.timeRange,
      beginDate: moment(tenant.beginDate).format('LL'),
      endDate: moment(tenant.endDate).format('LL'),
      deposit: Format.formatCurrency(
        organization.locale,
        organization.currency,
        tenant.guaranty || 0
      ),
    },
  };
  return templateValues;
}

function _resolveTemplates(element, templateValues) {
  if (element.content) {
    element.content = element.content.map((childElement) =>
      _resolveTemplates(childElement, templateValues)
    );
  }

  if (element.type === 'template') {
    element.type = 'text';
    element.text = Handlebars.compile(element.attrs.id)(templateValues) || ' '; // empty text node are not allowed in tiptap editor
    // TODO check if this doesn't open XSS issues
    element.text = element.text.replace(/&#x27;/g, "'");
    delete element.attrs;
  }
  return element;
}

/**
 * routes:
 * GET    /documents                         -> JSON
 * GET    /documents/:id                     -> JSON | pdf | image file
 * GET    /documents/:document/:id/:term     -> pdf file
 * POST   /documents/upload                  -> JSON
 * (input: FormData with pdf or image file)
 * POST   /documents                         -> JSON
 * (input: Document model)
 * PATCH  /documents                         -> JSON
 * input: Document model
 * DELETE /documents/:ids
 */
const documentsApi = express.Router();

documentsApi.get('/:document/:id/:term', async (req, res) => {
  try {
    logger.debug(`generate pdf file for ${JSON.stringify(req.params)}`);
    const pdfFile = await pdf.generate(req.params.document, req.params);
    return res.download(pdfFile);
  } catch (error) {
    logger.error(error);
    return res.sendStatus(404);
  }
});

documentsApi.get('/', async (req, res) => {
  const organizationId = req.headers.organizationid;

  const documentsFound = await Document.find({
    realmId: organizationId,
  });
  if (!documentsFound) {
    return res.sendStatus(404);
  }

  return res.status(200).json(documentsFound);
});

documentsApi.get('/:id', async (req, res) => {
  const documentId = req.params.id;

  if (!documentId) {
    return res.status(422).send({ errors: ['Document id required'] });
  }

  let documentFound = await Document.findOne({
    _id: documentId,
    realmId: req.realm._id,
  });

  if (!documentFound) {
    logger.warn(`document ${documentId} not found`);
    return res
      .status(404)
      .send({ errors: [`Document ${documentId} not found`] });
  }

  if (documentFound.type === 'text') {
    return res.status(200).json(documentFound);
  }

  if (documentFound.type === 'file') {
    if (!documentFound?.url) {
      return res.status(404).send({ errors: ['Document url required'] });
    }

    if (documentFound.url.indexOf('..') !== -1) {
      return res.status(404).send({ errors: ['Document url invalid'] });
    }

    // first try to download from file system
    const filePath = path.join(config.UPLOADS_DIRECTORY, documentFound.url);
    if (fs.existsSync(filePath)) {
      return fs.createReadStream(filePath).pipe(res);
    }

    // otherwise download from s3
    if (s3.isEnabled(req.realm.thirdParties.b2)) {
      return s3
        .downloadFile(req.realm.thirdParties.b2, documentFound.url)
        .pipe(res);
    }
  }

  return res.status(404).send({ errors: [`Document ${documentId} not found`] });
});

documentsApi.post('/upload', (req, res) => {
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      logger.error(err);
      if (err instanceof multer.MulterError) {
        return res.status(500).send({ errors: [err.message] });
      }
      return res.status(500).send({ errors: ['Cannot store file on disk'] });
    }

    const key = [req.body.s3Dir, req.body.fileName].join('/');
    if (s3.isEnabled(req.realm.thirdParties.b2)) {
      try {
        const data = await s3.uploadFile(req.realm.thirdParties.b2, {
          file: req.file,
          fileName: req.body.fileName,
          url: key,
        });
        return res.status(201).send(data);
      } catch (error) {
        logger.error(error);
        return res.status(500).send({ errors: ['Cannot store file in s3'] });
      } finally {
        try {
          fs.removeSync(req.file.path);
        } catch (err) {
          // catch error
        }
      }
    } else {
      return res.status(201).send({
        fileName: req.body.fileName,
        key,
      });
    }
  });
});

documentsApi.post('/', async (req, res) => {
  const dataSet = req.body || {};

  if (!dataSet.tenantId) {
    return res.status(422).json({
      errors: ['Missing tenant Id to generate document'],
    });
  }

  if (!dataSet.leaseId) {
    return res.status(422).json({
      errors: ['Missing lease Id to generate document'],
    });
  }

  let template;
  if (dataSet.templateId) {
    try {
      template = await _getTempate(req.realm, dataSet.templateId);
      if (!template) {
        return res.status(404).json({
          errors: ['Template not found'],
        });
      }
    } catch (error) {
      logger.error(error);
      return res.status(500).json({
        errors: ['Fail to fetch template'],
      });
    }
  }

  const documentToCreate = {
    realmId: req.realm._id,
    tenantId: dataSet.tenantId,
    leaseId: dataSet.leaseId,
    templateId: dataSet.templateId,
    type: dataSet.type || template.type,
    name: dataSet.name || template.name,
    description: dataSet.description || '',
  };

  if (documentToCreate.type === 'text') {
    try {
      documentToCreate.contents = '';
      documentToCreate.html = '';
      if (template) {
        const templateValues = await _getTemplateValues(
          req.realm,
          dataSet.tenantId,
          dataSet.leaseId
        );

        documentToCreate.contents = _resolveTemplates(
          template.contents,
          templateValues
        );
      }
    } catch (error) {
      logger.error(error);
      return res.status(500).json({
        errors: ['Fail to create document from template'],
      });
    }
  }

  if (documentToCreate.type === 'file') {
    documentToCreate.mimeType = dataSet.mimeType || '';
    documentToCreate.expiryDate = dataSet.expiryDate || '';
    documentToCreate.url = dataSet.url || '';
    if (dataSet.versionId) {
      documentToCreate.versionId = dataSet.versionId;
    }
  }

  try {
    const createdDocument = await Document.create(documentToCreate);
    return res.status(201).json(createdDocument);
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      errors: ['Fail to create document'],
    });
  }
});

documentsApi.patch('/', async (req, res) => {
  const organizationId = req.headers.organizationid;
  if (!req.body._id) {
    return res.status(422).json({ errors: ['Document id is missing'] });
  }

  const doc = req.body || {};

  if (!['text'].includes(doc.type)) {
    return res.status(405).json({ errors: ['Document cannot be modified'] });
  }

  const updatedDocument = await Document.findOneAndUpdate(
    {
      _id: doc._id,
      realmId: organizationId,
    },
    {
      $set: {
        ...doc,
        realmId: organizationId,
      },
    },
    { new: true }
  );

  if (!updatedDocument) {
    return res.sendStatus(404);
  }

  return res.status(201).json(updatedDocument);
});

documentsApi.delete('/:ids', async (req, res) => {
  const organizationId = req.headers.organizationid;
  const documentIds = req.params.ids.split(',');

  // fetch documents
  const documents = await Document.find({
    _id: { $in: documentIds },
    realmId: organizationId,
  });

  // delete documents from file systems
  documents.forEach((doc) => {
    if (doc.type !== 'file' || doc.url.indexOf('..') !== -1) {
      return;
    }
    const filePath = path.join(config.UPLOADS_DIRECTORY, doc.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  });

  // delete document from s3
  if (s3.isEnabled(req.realm.thirdParties.b2)) {
    const urlsIds = documents
      .filter((doc) => doc.type === 'file')
      .map(({ url, versionId }) => ({ url, versionId }));

    s3.deleteFiles(req.realm.thirdParties.b2, urlsIds);
  }

  // delete documents from mongo
  const result = await Document.deleteMany({
    _id: { $in: documentIds },
    realmId: organizationId,
  });

  if (result.ok !== 1) {
    logger.warn(`documents ${req.params.ids} not found`);
    return res.sendStatus(404);
  }

  return res.sendStatus(204);
});

module.exports = documentsApi;