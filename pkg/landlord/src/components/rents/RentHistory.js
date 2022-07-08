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

import {
    Box,
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography,
  } from '@material-ui/core';
  import React, {
    memo,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
  } from 'react';
  
  import getConfig from 'next/config';
  import { getPeriod } from './RentPeriod';
  import Loading from '../Loading';
  import moment from 'moment';
  import RentDetails from './RentDetails';
  import { StoreContext } from '../../store';
  import useTranslation from 'next-translate/useTranslation';
  
  const {
    publicRuntimeConfig: { BASE_PATH },
  } = getConfig();
  
  const RentListItem = React.forwardRef(function RentListItem(
    { rent, tenant /*, selected*/ },
    ref
  ) {
    const { t } = useTranslation('common');
    const store = useContext(StoreContext);
    const backPath = `/${store.organization.selected.name}/rents/${moment(
      rent.term,
      'YYYYMMDDHH'
    ).format('YYYY.MM')}`;
    const backPage = t('Rents of {{date}}', {
      date: moment(rent.term, 'YYYYMMDDHHMM').format('MMM YYYY'),
    });
    return (
      <Paper>
        <ListItem
          button
          component="a"
          ref={ref}
          // selected={selected}
          style={{
            marginBottom: 20,
          }}
          href={`${BASE_PATH}/${store.organization.selected.locale}/${
            store.organization.selected.name
          }/payment/${tenant.occupant._id}/${rent.term}/${encodeURI(
            backPage
          )}/${encodeURIComponent(backPath)}`}
        >
          <ListItemText
            primary={
              <>
                <Box>
                  <Typography variant="h5" component="div">
                    {getPeriod(t, rent.term, tenant.occupant.frequency)}
                  </Typography>
                </Box>
                <Box mt={1} px={1}>
                  <RentDetails rent={rent} />
                </Box>
                {!!rent.description && (
                  <Box mt={2} px={1}>
                    <Typography color="textSecondary">{t('Note')}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {rent.description}
                    </Typography>
                  </Box>
                )}
              </>
            }
          />
        </ListItem>
      </Paper>
    );
  });
  
  const RentHistory = ({ tenantId }) => {
    const { t } = useTranslation('common');
    const store = useContext(StoreContext);
    const [loading, setLoading] = useState(true);
    const [tenant, setTenant] = useState();
    const selectedRowRef = useRef();
    const selectedTerm = useMemo(
      () => moment().startOf('month').format('YYYYMMDDHH'),
      []
    );
  
    useEffect(() => {
      const fetchTenantRents = async () => {
        setLoading(true);
        const response = await store.rent.fetchTenantRents(tenantId);
        if (response.status !== 200) {
          store.pushToastMessage({
            message: t('Cannot get tenant information'),
            severity: 'error',
          });
        } else {
          setTenant(response.data);
        }
        setLoading(false);
      };
  
      fetchTenantRents();
    }, [t, tenantId, store.rent, store]);
  
    useEffect(() => {
      if (!loading) {
        selectedRowRef.current?.scrollIntoView({ block: 'center' });
      }
    }, [tenant, loading]);
  
    return (
      <>
        {loading ? (
          <Loading fullScreen />
        ) : (
          <>
            <Box pb={4}>
              <Typography variant="h5">{tenant.occupant.name}</Typography>
              {tenant.occupant.beginDate && tenant.occupant.endDate && (
                <Typography color="textSecondary" variant="body2">
                  {t('Contract from {{beginDate}} to {{endDate}}', {
                    beginDate: moment(
                      tenant.occupant.beginDate,
                      'DD/MM/YYYY'
                    ).format('L'),
                    endDate: moment(tenant.occupant.endDate, 'DD/MM/YYYY').format(
                      'L'
                    ),
                  })}
                </Typography>
              )}
            </Box>
  
            <List component="nav" disablePadding aria-labelledby="rent-history">
              {tenant?.rents?.map((rent) => {
                const isSelected = String(rent.term) === selectedTerm;
                return (
                  <RentListItem
                    key={rent.term}
                    ref={isSelected ? selectedRowRef : null}
                    rent={rent}
                    tenant={tenant}
                    selected={isSelected}
                  />
                );
              })}
            </List>
          </>
        )}
      </>
    );
  };
  
  export default memo(RentHistory);