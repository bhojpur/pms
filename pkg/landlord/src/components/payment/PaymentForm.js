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

import { Box, Button, Grid } from '@material-ui/core';
import {
  DateField,
  FormNumberField,
  FormSection,
  FormTextField,
  SelectField,
  SubmitButton,
} from '../Form';
import { FieldArray, Form, Formik } from 'formik';
import { Fragment, useCallback, useContext, useMemo } from 'react';

import _ from 'lodash';
import moment from 'moment';
import { StoreContext } from '../../store';
import { usePaymentTypes } from '../../utils/hooks';
import useTranslation from 'next-translate/useTranslation';

const validationSchema = Yup.object().shape({
  payments: Yup.array()
    .of(
      Yup.object().shape({
        amount: Yup.number().min(0),
        date: Yup.mixed().when('amount', {
          is: (val) => val > 0,
          then: Yup.date().required(),
        }),
        type: Yup.mixed()
          .oneOf(['cash', 'transfer', 'levy', 'cheque'])
          .required(),
        reference: Yup.mixed().when('type', {
          is: (val) => val !== 'cash',
          then: Yup.string().required(),
        }),
      })
    )
    .min(1),
});

const emptyPayment = {
  amount: '',
  date: moment(),
  type: 'transfer',
  reference: '',
};

const PaymentForm = ({ onSubmit }) => {
  const { t } = useTranslation('common');
  const store = useContext(StoreContext);
  const paymentTypes = usePaymentTypes();

  const initialValues = useMemo(
    () => ({
      payments: store.rent.selected.payments.length
        ? store.rent.selected.payments.map(
            ({ amount, date, type, reference }) => {
              return {
                amount: amount === 0 ? '' : amount,
                date: date ? moment(date, 'DD/MM/YYYY') : null,
                type: type,
                reference: reference || '',
              };
            }
          )
        : [emptyPayment],
    }),
    [store.rent.selected]
  );

  const _onSubmit = useCallback(
    async (values) => {
      const clonedValues = _.cloneDeep(values);

      const paymentPart = {
        payments: clonedValues.payments
          .filter(({ amount }) => amount > 0)
          .map((payment) => {
            // convert moment into string for the DB
            payment.date = payment.date.format('DD/MM/YYYY');
            if (payment.type === 'cash') {
              delete payment.reference;
            }
            return payment;
          }),
      };
      try {
        await onSubmit(paymentPart);
      } finally {
        // clean fields if empty amounts were saved
        if (clonedValues.payments.length === 0) {
          values.payments = [emptyPayment];
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
      {({ isSubmitting, values: { payments } }) => {
        return (
          <Form autoComplete="off">
            <FormSection label={t('Settlements')}>
              <FieldArray name="payments">
                {({ form, ...arrayHelpers }) => {
                  return payments.map((payment, index) => (
                    <Fragment key={index}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <FormNumberField
                            label={t('Amount')}
                            name={`payments[${index}].amount`}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <DateField
                            label={t('Date')}
                            name={`payments[${index}].date`}
                            minDate={store.rent.period
                              .startOf('month')
                              .toISOString()}
                            maxDate={store.rent.period
                              .endOf('month')
                              .toISOString()}
                          />
                        </Grid>
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <SelectField
                            label={t('Type')}
                            name={`payments[${index}].type`}
                            values={paymentTypes.itemList}
                          />
                        </Grid>
                        {payments[index].type !== 'cash' && (
                          <Grid item xs={6}>
                            <FormTextField
                              label={t('Reference')}
                              name={`payments[${index}].reference`}
                            />
                          </Grid>
                        )}
                      </Grid>
                      <Box
                        pb={2}
                        display="flex"
                        justifyContent={
                          payments.length === index + 1
                            ? 'space-between'
                            : 'flex-end'
                        }
                      >
                        {payments.length === index + 1 && (
                          <Button
                            // variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => arrayHelpers.push(emptyPayment)}
                          >
                            {t('Add a settlement')}
                          </Button>
                        )}
                        {payments.length > 1 && (
                          <Button
                            // variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => arrayHelpers.remove(index)}
                          >
                            {t('Remove the settlement')}
                          </Button>
                        )}
                      </Box>
                    </Fragment>
                  ));
                }}
              </FieldArray>
            </FormSection>
            <SubmitButton label={!isSubmitting ? t('Save') : t('Saving')} />
          </Form>
        );
      }}
    </Formik>
  );
};

export default PaymentForm;