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

import { Box, Hidden } from '@material-ui/core';
import { useContext, useMemo, useState } from 'react';

import GeneralFigures from '../../components/dashboard/GeneralFigures';
import MonthFigures from '../../components/dashboard/MonthFigures';
import { observer } from 'mobx-react-lite';
import Page from '../../components/Page';
import Shortcuts from '../../components/dashboard/Shortcuts';
import { StoreContext } from '../../store';
import { useComponentMountedRef } from '../../utils/hooks';
import { useEffect } from 'react';
import Welcome from '../../components/Welcome';
import { withAuthentication } from '../../components/Authentication';
import YearFigures from '../../components/dashboard/YearFigures';

const fetchDashboardData = async (store) => {
  const responses = await Promise.all([
    store.dashboard.fetch(),
    store.tenant.fetch(),
    store.lease.fetch(),
  ]);

  return responses.find(({ status }) => status !== 200);
};

const Dashboard = observer(() => {
  console.log('Dashboard functional component');
  const store = useContext(StoreContext);
  const [ready, setReady] = useState(false);
  const mountedRef = useComponentMountedRef();

  useEffect(() => {
    const fetchData = async () => {
      await fetchDashboardData(store);
      if (mountedRef.current) {
        setReady(true);
      }
    };
    fetchData();
  }, [mountedRef, store]);

  const isFirstConnection = useMemo(() => {
    return (
      !store.lease?.items?.length ||
      !store.dashboard.data.overview?.propertyCount ||
      !store.tenant?.items?.length
    );
  }, [
    store.dashboard.data.overview?.propertyCount,
    store.lease?.items,
    store.tenant?.items?.length,
  ]);

  return (
    <Page loading={!ready}>
      <Box my={5}>
        <Welcome />
      </Box>
      {isFirstConnection ? (
        <Box mt={10}>
          <Shortcuts firstConnection={true} />
        </Box>
      ) : (
        <>
          <Box mb={10}>
            <Shortcuts />
          </Box>
          <Box mb={10}>
            <GeneralFigures />
          </Box>
          <Box mb={10}>
            <MonthFigures />
          </Box>
          <Hidden smDown>
            {!!store.dashboard.data.overview && <YearFigures />}
          </Hidden>
        </>
      )}
    </Page>
  );
});

export default withAuthentication(Dashboard);