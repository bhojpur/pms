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

import { Box, Divider } from '@material-ui/core';
import { memo, useCallback, useEffect, useState } from 'react';

import { useRouter } from 'next/router';

export const useTabChangeHelper = (hashes) => {
  const router = useRouter();
  const [tabsReady, setTabsReady] = useState(false);
  const [tabSelectedIndex, setTabSelectedIndex] = useState(0);

  useEffect(() => {
    const hash = router.asPath.split('#')?.[1];
    if (hash && hashes.includes(hash)) {
      setTabSelectedIndex(hashes.indexOf(hash));
    } else {
      router.push(`#${hashes[0]}`, null, { shallow: true });
    }
    setTabsReady(true);
  }, [router, hashes]);

  const handleTabChange = useCallback(
    (event, newValue) => {
      router.push(`#${hashes[newValue]}`, null, { shallow: true });
      setTabSelectedIndex(newValue);
    },
    [router, hashes]
  );

  return { handleTabChange, tabSelectedIndex, tabsReady };
};

export const TabPanel = memo(function TabPanel(props) {
  const { children, value, index } = props;

  return value === index ? (
    <>
      <Divider />
      <Box p={5}>{children}</Box>
    </>
  ) : null;
});