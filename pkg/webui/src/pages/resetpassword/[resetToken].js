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

import { Box, Button, Grid, Paper, Typography } from '@material-ui/core';
import { Form, Formik } from 'formik';
import { FormTextField, SubmitButton } from '../../components/Form';
import React, { useContext } from 'react';

import LocationCityIcon from '@material-ui/icons/LocationCity';
import { observer } from 'mobx-react-lite';
import Page from '../../components/Page';
import { StoreContext } from '../../store';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';

const initialValues = {
  password: '',
  confirmationPassword: '',
};

const validationSchema = Yup.object().shape({
  password: Yup.string().required(),
  confirmationPassword: Yup.string()
    .required()
    .oneOf([Yup.ref('password'), null], 'Passwords must match'), // TODO translate this
});

const ResetPassword = observer(() => {
  const { t } = useTranslation('common');
  const store = useContext(StoreContext);
  const router = useRouter();

  const { resetToken } = router.query;

  const resetPassword = async ({ password }) => {
    try {
      const status = await store.user.resetPassword(resetToken, password);
      if (status !== 200) {
        switch (status) {
          case 422:
            store.pushToastMessage({
              message: t('Some fields are missing'),
              severity: 'error',
            });
            return;
          case 403:
            store.pushToastMessage({
              message: t('Invalid reset link'),
              severity: 'error',
            });
            return;
          default:
            store.pushToastMessage({
              message: t('Something went wrong'),
              severity: 'error',
            });
            return;
        }
      }
      router.push('/signin');
    } catch (error) {
      console.error(error);
      store.pushToastMessage({
        message: t('Something went wrong'),
        severity: 'error',
      });
    }
  };

  const signIn = (event) => {
    event.preventDefault();
    router.push('/signin');
  };

  return (
    <Page maxWidth="sm">
      <Box mt={10} mb={5}>
        <Box align="center">
          <LocationCityIcon fontSize="large" />
        </Box>
        <Typography component="h1" variant="h5" align="center">
          {t('Reset your password')}
        </Typography>
      </Box>
      <Paper>
        <Box px={4} pb={4} pt={2}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={resetPassword}
          >
            {({ isSubmitting }) => {
              return (
                <Form>
                  <FormTextField
                    label={t('New password')}
                    name="password"
                    type="password"
                  />
                  <FormTextField
                    label={t('Confirmation password')}
                    name="confirmationPassword"
                    type="password"
                  />
                  <Box pt={2}>
                    <Grid container spacing={2}>
                      <Grid item>
                        <Button variant="contained" onClick={signIn}>
                          {t('Cancel')}
                        </Button>
                      </Grid>
                      <Grid item>
                        <SubmitButton
                          label={
                            !isSubmitting
                              ? t('Reset my password')
                              : t('Reseting')
                          }
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Form>
              );
            }}
          </Formik>
        </Box>
      </Paper>
    </Page>
  );
});

export default ResetPassword;