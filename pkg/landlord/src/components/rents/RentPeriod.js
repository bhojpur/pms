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

import { memo, useMemo } from 'react';

import moment from 'moment';
import { Typography } from '@material-ui/core';
import useTranslation from 'next-translate/useTranslation';

export const getPeriod = (t, term, frequency) => {
  const termMoment = moment(term, 'YYYYMMDDHH');
  switch (frequency) {
    case 'years':
      return termMoment.format('YYYY');
    case 'months':
      return t('{{month}} {{year}}', {
        month: termMoment.format('MMMM'),
        year: termMoment.format('YYYY'),
      });
    case 'weeks':
      return t('{{month}} {{startDay}} to {{endDay}}', {
        month: termMoment.format('MMM'),
        startDay: termMoment.startOf('week').format('Do'),
        endDay: termMoment.endOf('week').format('Do'),
      });
    case 'days':
      return termMoment.format('L');
    default:
      return '';
  }
};

const RentPeriod = ({ term, frequency }) => {
  const { t } = useTranslation('common');
  const period = useMemo(
    () => getPeriod(t, term, frequency),
    [t, frequency, term]
  );

  return <Typography>{period}</Typography>;
};

export default memo(RentPeriod);