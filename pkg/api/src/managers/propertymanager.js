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

const moment = require('moment');
const FD = require('./frontdata');
const propertyModel = require('../models/property');
const occupantModel = require('../models/occupant');

function _toPropertiesData(realm, inputProperties, callback) {
  occupantModel.findFilter(
    realm,
    {
      properties: {
        $elemMatch: {
          propertyId: {
            $in: inputProperties.map((property) => property._id.toString()),
          },
        },
      },
    },
    (errors, occupants) => {
      if (errors) {
        callback(errors);
        return;
      }
      callback(
        null,
        inputProperties.map((property) => {
          return FD.toProperty(
            property,
            occupants.reduce(
              (acc, occupant) => {
                const occupant_property =
                  occupant.properties &&
                  occupant.properties.find(
                    (currentProperty) =>
                      currentProperty.propertyId === property._id.toString()
                  );
                if (occupant_property) {
                  if (!acc.occupant) {
                    acc.occupant = occupant;
                  } else {
                    const acc_property = acc.occupant.properties.find(
                      (currentProperty) =>
                        currentProperty.propertyId === property._id.toString()
                    );
                    const beginDate = moment(
                      occupant_property.entryDate
                    ).startOf('day');
                    const lastBeginDate = moment(
                      acc_property.entryDate
                    ).startOf('day');
                    if (beginDate.isAfter(lastBeginDate)) {
                      acc.occupant = occupant;
                    }
                  }
                }
                return acc;
              },
              { occupant: null }
            ).occupant,
            occupants
              .filter(({ properties = [] }) =>
                properties
                  .map(({ propertyId }) => propertyId)
                  .includes(property._id)
              )
              .sort((occ1, occ2) => {
                const m1 = moment(occ1.beginDate);
                const m2 = moment(occ2.beginDate);
                return m1.isBefore(m2) ? 1 : -1;
              })
          );
        })
      );
    }
  );
}

////////////////////////////////////////////////////////////////////////////////
// Exported functions
////////////////////////////////////////////////////////////////////////////////
function add(req, res) {
  const realm = req.realm;
  const property = propertyModel.schema.filter(req.body);

  propertyModel.add(realm, property, (errors, dbProperty) => {
    if (errors) {
      return res.status(500).json({ errors: errors });
    }
    _toPropertiesData(realm, [dbProperty], (errors, properties) => {
      if (errors && errors.length > 0) {
        return res.status(500).json({ errors: errors });
      }
      res.json(properties[0]);
    });
  });
}

function update(req, res) {
  const realm = req.realm;
  const property = propertyModel.schema.filter(req.body);

  propertyModel.update(realm, property, (errors) => {
    if (errors) {
      return res.status(500).json({ errors: errors });
    }
    _toPropertiesData(realm, [property], (errors, properties) => {
      if (errors && errors.length > 0) {
        return res.status(500).json({ errors: errors });
      }
      res.json(properties[0]);
    });
  });
}

function remove(req, res) {
  const realm = req.realm;
  const ids = req.params.ids.split(',');

  propertyModel.remove(realm, ids, (errors) => {
    if (errors) {
      return res.status(500).json({ errors: errors });
    }
    res.sendStatus(200); // better to return 204
  });
}

function all(req, res) {
  const realm = req.realm;

  propertyModel.findAll(realm, (errors, properties) => {
    if (errors && errors.length > 0) {
      return res.status(500).json({
        errors: errors,
      });
    }

    _toPropertiesData(realm, properties, (errors, properties) => {
      if (errors && errors.length > 0) {
        return res.status(500).json({
          errors: errors,
        });
      }
      res.json(properties);
    });
  });
}

function one(req, res) {
  const realm = req.realm;
  const tenantId = req.params.id;

  propertyModel.findOne(realm, tenantId, (errors, dbProperty) => {
    if (errors && errors.length > 0) {
      return res.status(500).json({
        errors: errors,
      });
    }

    _toPropertiesData(realm, dbProperty, (errors, property) => {
      if (errors && errors.length > 0) {
        return res.status(500).json({
          errors: errors,
        });
      }
      res.json(property);
    });
  });
}

function overview(req, res) {
  const realm = req.realm;
  let result = {
    countAll: 0,
    countFree: 0,
    countBusy: 0,
  };

  propertyModel.findAll(realm, (errors, properties) => {
    if (errors && errors.length > 0) {
      return res.status(500).json({
        errors: errors,
      });
    }

    _toPropertiesData(realm, properties, (errors, properties) => {
      if (errors && errors.length > 0) {
        return res.status(500).json({
          errors: errors,
        });
      }
      result.countAll = properties.length;
      properties.reduce((acc, property) => {
        if (property.available) {
          acc.countFree++;
        } else {
          acc.countBusy++;
        }
        return acc;
      }, result);
      res.json(result);
    });
  });
}

module.exports = {
  add,
  update,
  remove,
  all,
  one,
  overview,
};