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
    AlertIllustration,
    Pending2Illustration,
    PendingIllustration,
    ReceiptIllustration,
  } from '../Illustrations';
  import { memo, useCallback, useContext, useMemo } from 'react';
  
  import FullScreenDialogMenu from '../FullScreenDialogMenu';
  import SendIcon from '@material-ui/icons/Send';
  import { StoreContext } from '../../store';
  import useTranslation from 'next-translate/useTranslation';
  
  const SendRentEmailMenu = ({ period, tenant, terms, ...props }) => {
    const { t } = useTranslation('common');
    const store = useContext(StoreContext);
  
    const onSend = useCallback(
      async (docName) => {
        const sendStatus = await store.rent.sendEmail({
          document: docName,
          tenantIds: [tenant._id],
          terms,
        });
        if (sendStatus !== 200) {
          // TODO check error code to show a more detailed error message
          return store.pushToastMessage({
            message: t('Email service cannot send emails'),
            severity: 'error',
          });
        }
  
        const response = await store.rent.fetch();
        if (response.status !== 200) {
          // TODO check error code to show a more detail error message
          return store.pushToastMessage({
            message: t('Cannot fetch rents from server'),
            severity: 'error',
          });
        }
      },
      [store, tenant._id, terms, t]
    );
  
    const menuItems = useMemo(() => {
      return [
        {
          key: 'first_notice',
          label: t('First notice'),
          illustration: <PendingIllustration />,
          value: 'rentcall',
        },
        {
          key: 'second_notice',
          label: t('Second notice'),
          illustration: <Pending2Illustration />,
          value: 'rentcall_reminder',
        },
        {
          key: 'last_notice',
          label: t('Last notice'),
          illustration: <AlertIllustration />,
          value: 'rentcall_last_reminder',
        },
        {
          key: 'invoice',
          label: t('Invoice'),
          illustration: <ReceiptIllustration />,
          value: 'invoice',
        },
      ];
    }, [t]);
  
    return (
      <FullScreenDialogMenu
        variant="contained"
        buttonLabel={t('Send email')}
        dialogTitle={t('Send a billing email to {{tenantName}}', {
          tenantName: tenant.name,
        })}
        size="small"
        Icon={SendIcon}
        menuItems={menuItems}
        onClick={onSend}
        {...props}
      />
    );
  };
  
  export default memo(SendRentEmailMenu);