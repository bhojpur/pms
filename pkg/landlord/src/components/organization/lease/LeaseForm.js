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

import { Box, Grid, Typography } from '@material-ui/core';
import { Form, Formik } from 'formik';
import {
  FormNumberField,
  FormSection,
  FormTextField,
  SelectField,
  SubmitButton,
} from '../../Form';
import { useContext, useMemo } from 'react';

import { observer } from 'mobx-react-lite';
import { StoreContext } from '../../../store';
import useTranslation from 'next-translate/useTranslation';

const timeRanges = ['days', 'weeks', 'months', 'years'];

function initValues(lease) {
  return {
    name: lease?.name || '',
    description: lease?.description || '',
    numberOfTerms: lease?.numberOfTerms || '',
    timeRange: lease?.timeRange || '',
    active: lease?.active || true,
  };
}

function getValidationSchema(newLease, existingLeases) {
  return Yup.object().shape({
    name: Yup.string()
      .notOneOf(
        existingLeases
          .filter(({ _id }) => newLease?._id !== _id)
          .map(({ name }) => name)
      )
      .required(),
    description: Yup.string(),
    numberOfTerms: Yup.number().integer().min(1).required(),
    timeRange: Yup.string().required(),
    active: Yup.boolean().required(),
  });
}

export const validate = (newLease, existingLeases) => {
  return getValidationSchema(newLease, existingLeases).validate(
    initValues(newLease)
  );
};

const LeaseForm = ({ onSubmit }) => {
  const { t } = useTranslation('common');
  const store = useContext(StoreContext);

  const validationSchema = useMemo(
    () => getValidationSchema(store.lease.selected, store.lease.items),
    [store.lease.selected, store.lease.items]
  );

  const initialValues = useMemo(() => {
    return initValues(store.lease.selected);
  }, [store.lease.selected]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ values, isSubmitting }) => {
        return (
          <>
            {values.usedByTenants && (
              <Box color="warning.dark" pb={2}>
                <Typography>
                  {t(
                    'This contract is currently used, only some fields can be updated'
                  )}
                </Typography>
              </Box>
            )}
            <Form autoComplete="off">
              <FormSection
                label={t('Contract information')}
                visible={!store.lease.selected?.stepperMode}
              >
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <FormTextField label={t('Name')} name="name" />
                  </Grid>
                  <Grid item xs={12}>
                    <FormTextField
                      label={t('Description')}
                      name="description"
                      multiline
                      rows={2}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <SelectField
                      label={t('Schedule type')}
                      name="timeRange"
                      values={timeRanges.map((timeRange) => ({
                        id: timeRange,
                        label: t(timeRange),
                        value: timeRange,
                      }))}
                      disabled={values.usedByTenants}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormNumberField
                      label={t('Number of terms')}
                      name="numberOfTerms"
                      disabled={values.usedByTenants}
                    />
                  </Grid>
                </Grid>
              </FormSection>
              <SubmitButton
                label={!isSubmitting ? t('Save') : t('Submitting')}
              />
            </Form>
          </>
        );
      }}
    </Formik>
  );
};

export default observer(LeaseForm);