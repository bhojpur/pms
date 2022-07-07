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

import {
  CheckboxField,
  FormNumberField,
  FormSection,
  FormTextField,
  SubmitButton,
} from '../../Form';
import { Form, Formik } from 'formik';
import { useContext, useMemo } from 'react';

import { Box } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../../../store';
import useTranslation from 'next-translate/useTranslation';

const validationSchema = Yup.object().shape({
  reference: Yup.string().required(),
  isVat: Yup.boolean().required(),
  vatRatio: Yup.mixed().when('isVat', {
    is: true,
    then: Yup.number().moreThan(0).max(100),
  }),
  discount: Yup.number().min(0),
});

const initValues = (tenant) => {
  return {
    reference: tenant?.reference || '',
    isVat: !!tenant?.isVat,
    vatRatio: tenant?.vatRatio * 100 || 0,
    discount: tenant?.discount || 0,
  };
};

export const validate = (tenant) => {
  return validationSchema.validate(initValues(tenant));
};

const Billing = observer(({ readOnly, onSubmit }) => {
  const { t } = useTranslation('common');
  const store = useContext(StoreContext);

  const initialValues = useMemo(
    () => initValues(store.tenant?.selected),
    [store.tenant?.selected]
  );

  const _onSubmit = async (billing) => {
    await onSubmit({
      reference: billing.reference,
      isVat: billing.isVat,
      vatRatio: billing.isVat ? billing.vatRatio / 100 : 0,
      discount: billing.discount,
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={_onSubmit}
    >
      {({ isSubmitting, values }) => {
        return (
          <Form autoComplete="off">
            <FormSection
              label={t('Billing information')}
              visible={!store.tenant.selected.stepperMode}
            >
              <FormTextField
                label={t('Tenant reference')}
                name="reference"
                disabled={readOnly}
              />
              {store.organization.selected &&
                store.organization.selected.isCompany && (
                  <Box display="flex" direction="row" alignItems="flex-end">
                    <CheckboxField
                      name="isVat"
                      //label={t('Subject to VAT')}
                      aria-label={t('Subject to VAT')}
                      disabled={readOnly}
                    />
                    <FormNumberField
                      label={t('VAT percentage')}
                      name="vatRatio"
                      disabled={readOnly || !values.isVat}
                    />
                  </Box>
                )}
              {values.discount > 0 ? (
                <FormNumberField
                  label={t('Discount')}
                  name="discount"
                  disabled={readOnly}
                />
              ) : null}
            </FormSection>
            {!readOnly && (
              <SubmitButton
                size="large"
                label={!isSubmitting ? t('Save') : t('Saving')}
              />
            )}
          </Form>
        );
      }}
    </Formik>
  );
});

export default Billing;