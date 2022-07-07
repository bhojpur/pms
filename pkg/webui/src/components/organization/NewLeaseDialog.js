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

import { Box, DialogTitle } from '@material-ui/core';
import { Form, Formik } from 'formik';
import { FormTextField, SubmitButton } from '../Form';
import React, { useCallback, useContext } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { StoreContext } from '../../store';
import { useDialog } from '../../utils/hooks';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';

const validationSchema = Yup.object().shape({
  name: Yup.string().required(),
  stepperMode: Yup.boolean(),
});

const initialValues = {
  name: '',
  stepperMode: true,
};

function NewLeaseDialog({ open, setOpen, backPage, backPath }) {
  const { t } = useTranslation('common');
  const store = useContext(StoreContext);
  const router = useRouter();

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const _onSubmit = useCallback(
    async (leasePart) => {
      const { status, data } = await store.lease.create(leasePart);
      if (status !== 200) {
        switch (status) {
          case 422:
            return store.pushToastMessage({
              message: t('Contract name is missing'),
              severity: 'error',
            });
          case 403:
            return store.pushToastMessage({
              message: t('You are not allowed to create a contract'),
              severity: 'error',
            });
          case 409:
            return store.pushToastMessage({
              message: t('The contract already exists'),
              severity: 'error',
            });
          default:
            return store.pushToastMessage({
              message: t('Something went wrong'),
              severity: 'error',
            });
        }
      }

      handleClose();

      store.lease.setSelected(data);
      await router.push(
        `/${store.organization.selected.name}/settings/lease/${
          data._id
        }/${encodeURI(backPage)}/${encodeURIComponent(backPath)}`
      );
    },
    [store, handleClose, router, backPage, backPath, t]
  );

  return (
    <Dialog
      maxWidth="sm"
      fullWidth
      open={open}
      onClose={handleClose}
      aria-labelledby="new-contract-dialog"
    >
      <DialogTitle>{t('Create a new contract')}</DialogTitle>
      <Box p={1}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={_onSubmit}
        >
          {({ isSubmitting }) => {
            return (
              <Form autoComplete="off">
                <DialogContent>
                  <FormTextField label={t('Name')} name="name" />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    {t('Cancel')}
                  </Button>
                  <SubmitButton
                    label={!isSubmitting ? t('Create') : t('Creating contract')}
                  />
                </DialogActions>
              </Form>
            );
          }}
        </Formik>
      </Box>
    </Dialog>
  );
}

export default function useNewLeaseDialog() {
  return useDialog(NewLeaseDialog);
}