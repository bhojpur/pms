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
import {
  FormNumberField,
  FormSection,
  FormTextField,
  SubmitButton,
} from '../Form';
import { useCallback, useContext, useMemo } from 'react';

import { StoreContext } from '../../store';
import useTranslation from 'next-translate/useTranslation';

const validationSchema = Yup.object().shape({
  extracharge: Yup.number().min(0),
  noteextracharge: Yup.mixed().when('extracharge', {
    is: (val) => val > 0,
    then: Yup.string().required(),
  }),
  promo: Yup.number().min(0),
  notepromo: Yup.mixed().when('promo', {
    is: (val) => val > 0,
    then: Yup.string().required(),
  }),
});

const AdditionalCostDiscountForm = ({ onSubmit }) => {
  const { t } = useTranslation('common');
  const store = useContext(StoreContext);

  const initialValues = useMemo(
    () => ({
      extracharge:
        store.rent.selected.extracharge !== 0
          ? store.rent.selected.extracharge
          : '',
      noteextracharge: store.rent.selected.noteextracharge || '',
      promo: store.rent.selected.promo !== 0 ? store.rent.selected.promo : '',
      notepromo: store.rent.selected.notepromo || '',
    }),
    [store.rent.selected]
  );

  const _onSubmit = useCallback(
    async (values) => {
      const paymentPart = {
        ...values,
      };
      try {
        await onSubmit(paymentPart);
      } finally {
        if (!values.extracharge || values.extracharge === '0') {
          values.extracharge = '';
          values.noteextracharge = '';
        }
        if (!values.promo || values.promo === '0') {
          values.promo = '';
          values.notepromo = '';
        }
      }
    },
    [onSubmit]
  );

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={_onSubmit}
    >
      {({
        isSubmitting,
        values: { extracharge, noteextracharge, promo, notepromo },
      }) => {
        return (
          <Form autoComplete="off">
            <FormSection
              label={t('Additional cost')}
              defaultExpanded={!!initialValues.extracharge}
            >
              <FormNumberField
                label={t('Amount')}
                name="extracharge"
                value={extracharge}
              />
              <FormTextField
                label={t('Description')}
                name="noteextracharge"
                value={noteextracharge}
                multiline
                rows={3}
              />
            </FormSection>
            <FormSection
              label={t('Discount')}
              defaultExpanded={!!initialValues.promo}
            >
              <FormNumberField
                label={t('Discount')}
                name="promo"
                value={promo}
              />
              <FormTextField
                label={t('Description')}
                name="notepromo"
                value={notepromo}
                multiline
                rows={3}
              />
            </FormSection>
            <SubmitButton label={!isSubmitting ? t('Save') : t('Saving')} />
          </Form>
        );
      }}
    </Formik>
  );
};

export default AdditionalCostDiscountForm;