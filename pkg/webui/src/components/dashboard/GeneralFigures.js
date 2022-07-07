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

import { Box, Grid, Hidden, Typography } from '@material-ui/core';

import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import { DashboardCard } from '../Cards';
import { NumberFormat } from '../../utils/numberformat';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../../store';
import { useContext } from 'react';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';

function FigureCardContent({ nav, children }) {
  return (
    <Box position="relative">
      <Box
        height={150}
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="success.dark"
      >
        {children}
      </Box>
      {nav && (
        <Box position="absolute" bottom={0} right={0} fontSize={30}>
          <ArrowRightAltIcon fontSize="inherit" color="action" />
        </Box>
      )}
    </Box>
  );
}

function GeneralFigures() {
  const store = useContext(StoreContext);
  const router = useRouter();
  const { t } = useTranslation('common');

  return (
    <Grid container spacing={5}>
      <Hidden smDown>
        <Grid item xs={12} md={4} lg={2}>
          <DashboardCard
            title={t('Tenant')}
            onClick={() => {
              router.push(`/${store.organization.selected.name}/tenants`);
            }}
          >
            <FigureCardContent nav>
              <Typography variant="h3">
                {store.dashboard.data.overview?.tenantCount}
              </Typography>
            </FigureCardContent>
          </DashboardCard>
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <DashboardCard
            title={t('Property')}
            onClick={() => {
              router.push(`/${store.organization.selected.name}/properties`);
            }}
          >
            <FigureCardContent nav>
              <Typography variant="h3">
                {store.dashboard.data.overview?.propertyCount}
              </Typography>
            </FigureCardContent>
          </DashboardCard>
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <DashboardCard title={t('Occupancy rate')}>
            <FigureCardContent>
              <NumberFormat
                value={store.dashboard.data.overview?.occupancyRate}
                minimumFractionDigits={0}
                style="percent"
                variant="h3"
              />
            </FigureCardContent>
          </DashboardCard>
        </Grid>
      </Hidden>
      <Grid item xs={12} md={12} lg={6}>
        <DashboardCard title={t('Revenues')}>
          <FigureCardContent>
            <NumberFormat
              value={store.dashboard.data.overview?.totalYearRevenues}
              variant="h3"
            />
          </FigureCardContent>
        </DashboardCard>
      </Grid>
    </Grid>
  );
}

export default observer(GeneralFigures);