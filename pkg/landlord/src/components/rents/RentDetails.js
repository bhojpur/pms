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

import { Divider, Typography } from '@material-ui/core';
import { CardRow } from '../Cards';
import { NumberFormat } from '../../utils/numberformat';
import { useMemo } from 'react';
import { usePaymentTypes } from '../../utils/hooks';
import useTranslation from 'next-translate/useTranslation';

function _rentDetails(rent) {
  const turnToNegative = (amount) => (amount !== 0 ? amount * -1 : 0);

  return {
    balance: rent.balance,
    absBalance: Math.abs(rent.balance),
    isDebitBalance: turnToNegative(rent.balance) < 0,
    newBalance: rent.newBalance,
    absNewBalance: Math.abs(rent.newBalance),
    isDebitNewBalance: rent.newBalance < 0,
    additionalCosts: rent.extracharge,
    rent: rent.totalWithoutBalanceAmount + rent.promo - rent.extracharge,
    discount: turnToNegative(rent.promo),
    payment: rent.payment,
    paymentReferences:
      rent.payments?.map(({ type, reference }) => ({
        type,
        reference,
      })) || [],
    totalAmount: rent.totalAmount,
  };
}

export default function RentDetails({ rent }) {
  const { t } = useTranslation('common');
  const paymentTypes = usePaymentTypes();

  const rentDetails = useMemo(() => _rentDetails(rent), [rent]);

  return (
    <>
      <CardRow>
        <Typography color="textSecondary" noWrap>
          {rentDetails.balance === 0
            ? t('Previous balance')
            : rentDetails.isDebitBalance
            ? t('Previous debit balance')
            : t('Previous credit balance')}
        </Typography>
        <NumberFormat
          color="textSecondary"
          value={rentDetails.balance}
          noWrap
          debitColor={rentDetails.isDebitBalance}
          creditColor={!rentDetails.isDebitBalance}
        />
      </CardRow>
      <CardRow>
        <Typography color="textSecondary" noWrap>
          {t('Rent')}
        </Typography>
        <NumberFormat color="textSecondary" value={rentDetails.rent} noWrap />
      </CardRow>
      <CardRow>
        <Typography color="textSecondary" noWrap>
          {t('Additional costs')}
        </Typography>
        <NumberFormat
          color="textSecondary"
          value={rentDetails.additionalCosts}
          noWrap
        />
      </CardRow>
      <CardRow pb={1.5}>
        <Typography color="textSecondary" noWrap>
          {t('Discount')}
        </Typography>
        <NumberFormat
          color="textSecondary"
          value={rentDetails.discount}
          noWrap
        />
      </CardRow>
      <Divider />
      <CardRow pt={1.5}>
        <Typography color="textSecondary" noWrap>
          {t('Total to pay')}
        </Typography>
        <NumberFormat
          color="textSecondary"
          value={rentDetails.totalAmount}
          noWrap
        />
      </CardRow>
      <CardRow pb={1.5}>
        <>
          <Typography color="textSecondary" noWrap>
            {t('Settlements')}
          </Typography>
          {rentDetails.payment > 0 && !!rentDetails.paymentReferences.length && (
            <Typography variant="caption" color="textSecondary" noWrap>
              {rentDetails.paymentReferences
                .map(({ type, reference }) =>
                  type === 'cash'
                    ? paymentTypes.itemMap[type].label
                    : `${paymentTypes.itemMap[type].label} ${reference}`
                )
                .join(', ')}
            </Typography>
          )}
        </>
        <NumberFormat
          color="textSecondary"
          value={rentDetails.payment}
          noWrap
          withColor
        />
      </CardRow>
      <Divider />
      <CardRow pt={1.5}>
        <Typography color="textSecondary" noWrap>
          {rentDetails.absNewBalance === 0
            ? t('Balance')
            : rentDetails.isDebitNewBalance
            ? t('Debit balance')
            : t('Credit balance')}
        </Typography>
        <NumberFormat
          color="textSecondary"
          value={rentDetails.absNewBalance}
          noWrap
          debitColor={rentDetails.isDebitNewBalance}
          creditColor={!rentDetails.isDebitNewBalance}
        />
      </CardRow>
    </>
  );
}