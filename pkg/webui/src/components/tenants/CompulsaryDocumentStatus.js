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

import Alert from '../Alert';
import { Box } from '@material-ui/core';
import moment from 'moment';
import { useMemo } from 'react';
import useTranslation from 'next-translate/useTranslation';

const now = moment();

function CompulsoryDocumentStatus({ tenant, ...boxProps }) {
  const { t } = useTranslation('common');

  const missingDocuments = useMemo(() => {
    return tenant.filesToUpload?.filter(
      ({ required, requiredOnceContractTerminated, documents }) =>
        (required || (requiredOnceContractTerminated && tenant.terminated)) &&
        (!documents.length ||
          !documents.some(({ expiryDate }) =>
            expiryDate ? moment(expiryDate).isSameOrAfter(now) : true
          ))
    );
  }, [tenant.filesToUpload, tenant.terminated]);

  return (
    !!missingDocuments?.length && (
      <Box {...boxProps}>
        <Alert
          title={
            missingDocuments.length > 1
              ? t('The following compulsary documents are missing')
              : t('The following compulsary document is missing')
          }
        >
          <ul>
            {missingDocuments.map(({ _id, name }) => {
              return <li key={_id}>{name}</li>;
            })}
          </ul>
        </Alert>
      </Box>
    )
  );
}

export default CompulsoryDocumentStatus;