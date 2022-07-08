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
  AddressField,
  FormNumberField,
  FormSection,
  FormTextField,
  SelectField,
  SubmitButton,
} from '../Form';
import { Form, Formik } from 'formik';
import { useContext, useMemo } from 'react';

import { Grid } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../../store';
import types from './types';
import useTranslation from 'next-translate/useTranslation';

const validationSchema = Yup.object().shape({
  type: Yup.string().required(),
  name: Yup.string().required(),
  description: Yup.string(),
  phone: Yup.string(),
  digicode: Yup.string(),
  address: Yup.object().shape({
    street1: Yup.string(),
    street2: Yup.string(),
    city: Yup.string(),
    zipCode: Yup.string(),
    state: Yup.string(),
    country: Yup.string(),
  }),
  rent: Yup.number().min(0).required(),
});

const PropertyForm = observer(({ onSubmit }) => {
  const { t } = useTranslation('common');
  const store = useContext(StoreContext);

  const initialValues = useMemo(
    () => ({
      type: store.property.selected?.type || '',
      name: store.property.selected?.name || '',
      description: store.property.selected?.description || '',
      phone: store.property.selected?.phone || '',
      digicode: store.property.selected?.digicode || '',
      address: store.property.selected?.address || {
        street1: '',
        street2: '',
        city: '',
        zipCode: '',
        state: '',
        country: '',
      },
      rent: store.property.selected?.price || '',
    }),
    [store.property.selected]
  );

  const propertyTypes = useMemo(
    () =>
      types.map((type) => ({
        id: type.id,
        value: type.id,
        label: t(type.labelId),
      })),
    [t]
  );

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ values, isSubmitting }) => {
        return (
          <Form autoComplete="off">
            <FormSection label={t('Property information')}>
              <Grid container spacing={1}>
                <Grid item xs={12} md={4}>
                  <SelectField
                    label={t('Property Type')}
                    name="type"
                    values={propertyTypes}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <FormTextField label={t('Name')} name="name" />
                </Grid>
                <Grid item xs={12}>
                  <FormTextField label={t('Description')} name="description" />
                </Grid>

                {[
                  'store',
                  'building',
                  'apartment',
                  'room',
                  'office',
                  'garage',
                ].includes(values.type) && (
                  <>
                    <Grid item xs={12} md={4}>
                      <FormNumberField label={t('Surface')} name="surface" />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormTextField label={t('Phone')} name="phone" />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormTextField label={t('Digicode')} name="digicode" />
                    </Grid>
                  </>
                )}
              </Grid>
            </FormSection>
            <FormSection label={t('Address')}>
              <AddressField />
            </FormSection>
            <FormSection label={t('Rent')}>
              <FormNumberField label={t('Rent without expenses')} name="rent" />
            </FormSection>
            <SubmitButton
              size="large"
              label={!isSubmitting ? t('Save') : t('Saving')}
            />
          </Form>
        );
      }}
    </Formik>
  );
});

export default PropertyForm;