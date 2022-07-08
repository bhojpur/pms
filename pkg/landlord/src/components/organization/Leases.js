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

import { Box, Paper, Switch, TableHead, Typography } from '@material-ui/core';
import React, { useCallback, useContext } from 'react';

import AddIcon from '@material-ui/icons/Add';
import { ADMIN_ROLE } from '../../store/User';
import { FormSection } from '../Form';
import Link from '../Link';
import { observer } from 'mobx-react-lite';
import { RestrictButton } from '../RestrictedComponents';
import { StoreContext } from '../../store';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import useNewLeaseDialog from './NewLeaseDialog';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';

const Leases = observer(() => {
  const { t } = useTranslation('common');
  const store = useContext(StoreContext);
  const router = useRouter();
  const [NewLeaseDialog, setOpenNewLeaseDialog] = useNewLeaseDialog();

  const handleNewLeaseDialog = useCallback(() => {
    setOpenNewLeaseDialog(true);
  }, [setOpenNewLeaseDialog]);

  const onLeaseChange = useCallback(
    async (active, lease) => {
      lease.active = active;
      const { status } = await store.lease.update(lease);

      if (status !== 200) {
        switch (status) {
          case 422:
            return store.pushToastMessage({
              message: t('Some fields are missing'),
              severity: 'error',
            });
          case 403:
            return store.pushToastMessage({
              message: t('You are not allowed to update the contract'),
              severity: 'error',
            });
          case 404:
            return store.pushToastMessage({
              message: t('Contract is not found'),
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
    },
    [store, t]
  );

  return (
    <FormSection label={t('Manage contracts')}>
      <Box py={2}>
        <RestrictButton
          variant="contained"
          color="primary"
          onClick={handleNewLeaseDialog}
          startIcon={<AddIcon />}
          onlyRoles={[ADMIN_ROLE]}
        >
          {t('New contract')}
        </RestrictButton>
      </Box>
      <Paper variant="outlined" square>
        <Table aria-label="contract table">
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography>{t('Contract')}</Typography>
              </TableCell>
              <TableCell>
                <Typography>{t('Number of terms')}</Typography>
              </TableCell>
              <TableCell>
                <Typography>{t('Description')}</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography>{t('Active')}</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(store.lease.items || []).map((lease) => {
              return (
                <TableRow key={lease._id} size="small">
                  <TableCell>
                    <Link
                      href={`/${
                        store.organization.selected.name
                      }/settings/lease/${lease._id}/${encodeURI(
                        t('Settings')
                      )}/${encodeURIComponent(router.asPath)}`}
                    >
                      <Typography noWrap>{lease.name}</Typography>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Typography noWrap>
                      {t('{{numberOfTerms}} {{timeRange}}', {
                        numberOfTerms: lease.numberOfTerms,
                        timeRange: lease.timeRange,
                      })}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{lease.description}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Switch
                      color={lease.active ? 'primary' : 'default'}
                      checked={lease.active}
                      onChange={(evt) =>
                        onLeaseChange(evt.target.checked, lease)
                      }
                      disabled={!!lease.numberOfTerms === false}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
      <NewLeaseDialog backPage={t('Settings')} backPath={router.asPath} />
    </FormSection>
  );
});

export default Leases;