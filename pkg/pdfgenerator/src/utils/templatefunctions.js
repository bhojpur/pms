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

const path = require('path');
const moment = require('moment');
const i18n = require('i18n');

i18n.configure({
  locales: ['en', 'fr-FR', 'pt-BR', 'de-DE'],
  directory: path.join(__dirname, '..', '..', 'templates', 'locales'),
  updateFiles: false,
});

module.exports = ({ locale, currency }) => {
  moment.locale(locale);
  i18n.setLocale(locale);

  return {
    t: (...params) => {
      return i18n.__(...params);
    },
    formatNumber: (value, style = 'decimal', minimumFractionDigits = 2) => {
      if (['currency', 'decimal'].includes(style)) {
        return Intl.NumberFormat(locale, {
          style,
          currency,
          minimumFractionDigits,
        }).format(value);
      }

      if (style === 'percent') {
        return Number(value).toLocaleString(locale, {
          style: 'percent',
          minimumFractionDigits,
        });
      }

      return value;
    },
    formatDate: (dateTxt, localizedFormat) => {
      return moment(dateTxt, 'DD/MM/YYYY').format(localizedFormat);
    },
    formatTerm: (termTxt, timeRange) => {
      const term = moment(termTxt, 'YYYYMMDDHH');
      if (timeRange === 'days') {
        return term.format('LL');
      }

      if (timeRange === 'weeks') {
        return i18n.__('{{month}} {{startDay}} to {{endDay}}', {
          month: term.format('MMM'),
          startDay: term.startOf('week').format('Do'),
          endDay: term.endOf('week').format('Do'),
        });
      }

      if (timeRange === 'months') {
        return term.format('MMMM YYYY');
      }

      if (timeRange === 'years') {
        return term.format('YYYY');
      }
      return termTxt;
    },
  };
};