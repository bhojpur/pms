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

import { Box, Container, Paper, Typography } from '@material-ui/core';
import { getStoreInstance, StoreContext } from '../store';
import { isServer, redirect } from '../utils';
import React, { useContext } from 'react';

import Landlord from '../components/organization/LandlordForm';
import { observer } from 'mobx-react-lite';
import Page from '../components/Page';
import { setOrganizationId } from '../utils/fetch';
import { toJS } from 'mobx';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import Welcome from '../components/Welcome';
import { withAuthentication } from '../components/Authentication';

const FirstAccess = observer(() => {
  const { t } = useTranslation('common');
  const store = useContext(StoreContext);
  const router = useRouter();

  const onSubmit = async (organization) => {
    try {
      // set current user as administrator of the org
      organization.members = [
        {
          name: `${store.user.firstName} ${store.user.lastName}`,
          email: store.user.email,
          role: 'administrator',
          registered: true,
        },
      ];

      const { status, data } = await store.organization.create(organization);
      if (status !== 200) {
        switch (status) {
          default:
            store.pushToastMessage({
              message: t('Something went wrong'),
              severity: 'error',
            });
            return;
        }
      }
      store.organization.setSelected(data, store.user);
      store.organization.setItems([data]);
      setOrganizationId(data._id);
    } catch (error) {
      console.error(error);
      store.pushToastMessage({
        message: t('Something went wrong'),
        severity: 'error',
      });
    }
  };

  const onSubmitted = () => {
    router.push(`/${store.organization.selected.name}/dashboard`, null, {
      locale: store.organization.selected.locale,
    });
  };

  return !store.organization.selected?.name ? (
    <Page>
      <Container maxWidth="sm">
        <Box my={5}>
          <Welcome />
        </Box>
        <Box pb={4}>
          <Typography variant="subtitle2" align="center" color="textSecondary">
            {t('One more step, tell us who will rent the properties')}
          </Typography>
        </Box>
        <Paper>
          <Box px={4} pb={4} pt={2}>
            <Landlord onSubmit={onSubmit} onSubmitted={onSubmitted} />
          </Box>
        </Paper>
      </Container>
    </Page>
  ) : null;
});

FirstAccess.getInitialProps = async (context) => {
  console.log('FirstAccess.getInitialProps');
  const store = isServer() ? context.store : getStoreInstance();

  if (isServer()) {
    if (store.organization.selected?.name) {
      redirect(context, `/${store.organization.selected.name}/dashboard`);
      return {};
    }
  }

  const props = {
    initialState: {
      store: toJS(store),
    },
  };
  return props;
};

export default withAuthentication(FirstAccess);