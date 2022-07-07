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

import { Box, Hidden, IconButton } from '@material-ui/core';
import { memo, useCallback, useState } from 'react';

import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { DatePicker } from '@material-ui/pickers';
import moment from 'moment';

function PeriodPicker({ value, period, format, onChange }) {
  const [selectedPeriod, setSelectedPeriod] = useState(value);

  const _onPeriodChange = useCallback(
    (period) => {
      setSelectedPeriod(period);
      onChange(period);
    },
    [onChange]
  );

  const _onNextPeriod = useCallback(() => {
    const newPeriod = moment(selectedPeriod).add(1, period);
    _onPeriodChange(newPeriod);
  }, [period, selectedPeriod, _onPeriodChange]);

  const _onPreviousPeriod = useCallback(() => {
    const newPeriod = moment(selectedPeriod).subtract(1, period);
    _onPeriodChange(newPeriod);
  }, [period, selectedPeriod, _onPeriodChange]);

  return (
    <Box display="flex" alignItems="center">
      <Hidden smDown>
        <IconButton
          onClick={_onPreviousPeriod}
          aria-label="previous period"
          size="small"
        >
          <ArrowLeftIcon />
        </IconButton>
      </Hidden>
      <Box width={100}>
        <DatePicker
          autoOk
          views={[period]}
          value={selectedPeriod}
          onChange={_onPeriodChange}
          size="small"
          format={format}
        />
      </Box>
      <Hidden smDown>
        <IconButton
          onClick={_onNextPeriod}
          aria-label="next period"
          size="small"
        >
          <ArrowRightIcon />
        </IconButton>
      </Hidden>
    </Box>
  );
}

export default memo(PeriodPicker);