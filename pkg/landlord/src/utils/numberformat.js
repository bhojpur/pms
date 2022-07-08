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

import { StoreContext } from '../store';
import { Typography } from '@material-ui/core';
import { useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';

export const formatNumber = (
  locale = 'en',
  currency = 'INR',
  value,
  minimumFractionDigits = 2
) => {
  return Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits,
  }).format(value);
};

export const useFormatNumber = () => {
  const store = useContext(StoreContext);

  return (value, style = 'currency', minimumFractionDigits) => {
    if (style === 'currency') {
      return formatNumber(
        store.organization.selected.locale,
        store.organization.selected.currency,
        value,
        minimumFractionDigits
      );
    }

    if (style === 'percent') {
      return Number(value).toLocaleString(store.organization.selected.locale, {
        style: 'percent',
        minimumFractionDigits,
      });
    }
  };
};

const PositiveNumber = withStyles((theme) => ({
  root: {
    color: theme.palette.success.dark,
  },
}))(Typography);

const NegativeNumber = withStyles((theme) => ({
  root: {
    color: theme.palette.warning.dark,
  },
}))(Typography);

export const NumberFormat = ({
  value,
  minimumFractionDigits = 2,
  style = 'currency',
  withColor,
  debitColor,
  creditColor,
  ...props
}) => {
  const formatNumber = useFormatNumber();

  if ((withColor && value < 0) || debitColor) {
    return (
      <NegativeNumber noWrap {...props}>
        {formatNumber(value, style, minimumFractionDigits)}
      </NegativeNumber>
    );
  }

  if ((withColor && value > 0) || creditColor) {
    return (
      <PositiveNumber noWrap {...props}>
        {formatNumber(value, style, minimumFractionDigits)}
      </PositiveNumber>
    );
  }

  return (
    <Typography noWrap {...props}>
      {value !== undefined && value != null
        ? formatNumber(value, style, minimumFractionDigits)
        : '--'}
    </Typography>
  );
};