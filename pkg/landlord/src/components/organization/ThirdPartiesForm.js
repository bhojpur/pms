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

import * as Yup from 'yup';

import { Form, Formik } from 'formik';
import { FormSection, FormTextField, SubmitButton } from '../Form';
import { useCallback, useContext, useMemo } from 'react';

import { observer } from 'mobx-react-lite';
import { StoreContext } from '../../store';
import { Typography } from '@material-ui/core';
import useTranslation from 'next-translate/useTranslation';

const validationSchema = Yup.object().shape({
  apiKey: Yup.string().required(),
  domain: Yup.string().required(),
  fromEmail: Yup.string().email().required(),
  replyToEmail: Yup.string().email().required(),
  keyId: Yup.string().required(),
  applicationKey: Yup.string().required(),
  endpoint: Yup.string().required(),
  bucket: Yup.string().required(),
});

const ThirdPartiesForm = observer(({ onSubmit }) => {
  const { t } = useTranslation('common');
  const store = useContext(StoreContext);

  const initialValues = useMemo(
    () => ({
      apiKey: store.organization.selected.thirdParties?.mailgun?.apiKey || '',
      domain: store.organization.selected.thirdParties?.mailgun?.domain || '',
      fromEmail:
        store.organization.selected.thirdParties?.mailgun?.fromEmail ||
        store.organization.selected?.contacts?.[0]?.email ||
        '',
      replyToEmail:
        store.organization.selected.thirdParties?.mailgun?.replyToEmail ||
        store.organization.selected?.contacts?.[0]?.email ||
        '',
      keyId: store.organization.selected.thirdParties?.b2?.keyId,
      applicationKey:
        store.organization.selected.thirdParties?.b2?.applicationKey,
      endpoint: store.organization.selected.thirdParties?.b2?.endpoint,
      bucket: store.organization.selected.thirdParties?.b2?.bucket,
    }),
    [store.organization.selected]
  );

  const _onSubmit = useCallback(
    async ({
      apiKey,
      domain,
      fromEmail,
      replyToEmail,
      keyId,
      applicationKey,
      endpoint,
      bucket,
    }) => {
      await onSubmit({
        thirdParties: {
          mailgun: {
            apiKey,
            apiKeyUpdated: apiKey !== initialValues.apiKey,
            domain,
            fromEmail,
            replyToEmail,
          },
          b2: {
            keyId,
            applicationKey,
            keyIdUpdated: keyId !== initialValues.keyId,
            applicationKeyUpdated:
              applicationKey !== initialValues.applicationKey,
            endpoint,
            bucket,
          },
        },
      });
    },
    [
      onSubmit,
      initialValues.apiKey,
      initialValues.keyId,
      initialValues.applicationKey,
    ]
  );

  const allowedRoles = useMemo(
    () => (store.organization.items ? ['administrator'] : null),
    [store.organization.items]
  );

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={_onSubmit}
    >
      {({ values, isSubmitting }) => {
        return (
          <Form autoComplete="off">
            <FormSection label="Mailgun">
              <Typography>
                {t(
                  'Configuration required for sending invoices, notices and all kind of communication to the tenants'
                )}
              </Typography>
              <FormTextField
                label={t('Private API key')}
                name="apiKey"
                type="password"
                showHidePassword={values.apiKey !== initialValues.apiKey}
                onlyRoles={allowedRoles}
              />
              <FormTextField
                label={t('Domain')}
                name="domain"
                onlyRoles={allowedRoles}
              />
              <FormTextField
                label={t('From Email')}
                name="fromEmail"
                onlyRoles={allowedRoles}
              />
              <FormTextField
                label={t('Reply to email')}
                name="replyToEmail"
                onlyRoles={allowedRoles}
              />
            </FormSection>
            <FormSection label="Backblaze B2 Cloud Storage">
              <Typography>
                {t('Configuration required to store documents in the cloud')}
              </Typography>
              <FormTextField
                label="KeyId"
                name="keyId"
                type="password"
                showHidePassword={values.keyId !== initialValues.keyId}
                onlyRoles={allowedRoles}
              />
              <FormTextField
                label="ApplicationKey"
                name="applicationKey"
                type="password"
                showHidePassword={
                  values.applicationKey !== initialValues.applicationKey
                }
                onlyRoles={allowedRoles}
              />
              <FormTextField
                label={t('Bucket')}
                name="bucket"
                onlyRoles={allowedRoles}
              />
              <FormTextField
                label={t('Bucket endpoint')}
                name="endpoint"
                onlyRoles={allowedRoles}
              />
            </FormSection>
            <SubmitButton
              size="large"
              label={!isSubmitting ? t('Save') : t('Saving')}
              onlyRoles={allowedRoles}
            />
          </Form>
        );
      }}
    </Formik>
  );
});

export default ThirdPartiesForm;