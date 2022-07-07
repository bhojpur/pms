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

import { CardRow, PageInfoCard } from '../Cards';
import { Typography, withStyles } from '@material-ui/core';

import moment from 'moment';
import { NumberFormat } from '../../utils/numberformat';
import { StoreContext } from '../../store';
import SubjectIcon from '@material-ui/icons/Subject';
import { useContext } from 'react';
import useTranslation from 'next-translate/useTranslation';

const WarningTypography = withStyles((theme) => {
  return {
    root: {
      color: theme.palette.warning.dark,
    },
  };
})(Typography);

export default function ContractOverview() {
  const { t } = useTranslation('common');
  const store = useContext(StoreContext);
  return (
    <PageInfoCard Icon={SubjectIcon} title={t('Lease')}>
      <CardRow>
        <Typography color="textSecondary" noWrap>
          {t('Contract')}
        </Typography>
        <Typography color="textSecondary" noWrap>
          {store.tenant.selected.contract}
        </Typography>
      </CardRow>
      <CardRow>
        <Typography color="textSecondary" noWrap>
          {t('Status')}
        </Typography>
        {store.tenant.selected.terminated ? (
          <WarningTypography color="textSecondary" noWrap>
            {t('Terminated')}
          </WarningTypography>
        ) : (
          <Typography color="textSecondary" noWrap>
            {t('In progress')}
          </Typography>
        )}
      </CardRow>
      {store.tenant.selected.beginDate && (
        <CardRow>
          <Typography color="textSecondary" noWrap>
            {t('Start date')}
          </Typography>
          <Typography color="textSecondary" noWrap>
            {moment(store.tenant.selected.beginDate, 'DD/MM/YYYY').format('L')}
          </Typography>
        </CardRow>
      )}
      {(store.tenant.selected.terminationDate ||
        store.tenant.selected.endDate) && (
        <CardRow>
          <Typography color="textSecondary" noWrap>
            {t('End date')}
          </Typography>
          <Typography color="textSecondary" noWrap>
            {moment(
              store.tenant.selected.terminationDate ||
                store.tenant.selected.endDate,
              'DD/MM/YYYY'
            ).format('L')}
          </Typography>
        </CardRow>
      )}
      <CardRow>
        <Typography color="textSecondary" variant="h5" noWrap>
          {t('Deposit')}
        </Typography>
        <NumberFormat
          color="textSecondary"
          variant="h5"
          value={store.tenant.selected.guaranty}
          noWrap
        />
      </CardRow>
    </PageInfoCard>
  );
}