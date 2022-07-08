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

import { Paper, Tab, Tabs } from '@material-ui/core';
import { TabPanel, useTabChangeHelper } from '../Tabs';

import BillingForm from './forms/BillingForm';
import DocumentsForm from './forms/DocumentsForm';
import LeaseContractForm from './forms/LeaseContractForm';
import TenantForm from './forms/TenantForm';
import useTranslation from 'next-translate/useTranslation';

const hashes = ['tenant', 'contract', 'billing', 'documents'];

export default function TenantTabs({ onSubmit /*, setError*/, readOnly }) {
  const { t } = useTranslation('common');
  const { handleTabChange, tabSelectedIndex, tabsReady } =
    useTabChangeHelper(hashes);

  return (
    tabsReady && (
      <Paper>
        <Tabs
          variant="scrollable"
          value={tabSelectedIndex}
          onChange={handleTabChange}
          aria-label="Tenant tabs"
        >
          <Tab label={t('Tenant')} wrapped />
          <Tab label={t('Lease')} wrapped />
          <Tab label={t('Billing')} wrapped />
          <Tab label={t('Documents')} wrapped />
        </Tabs>
        <TabPanel value={tabSelectedIndex} index={0}>
          <TenantForm onSubmit={onSubmit} readOnly={readOnly} />
        </TabPanel>
        <TabPanel value={tabSelectedIndex} index={1}>
          <LeaseContractForm onSubmit={onSubmit} readOnly={readOnly} />
        </TabPanel>
        <TabPanel value={tabSelectedIndex} index={2}>
          <BillingForm onSubmit={onSubmit} readOnly={readOnly} />
        </TabPanel>
        <TabPanel value={tabSelectedIndex} index={3}>
          <DocumentsForm onSubmit={onSubmit} readOnly={readOnly} />
        </TabPanel>
      </Paper>
    )
  );
}