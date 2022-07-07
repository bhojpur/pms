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

import { Box, Breadcrumbs, Typography, useMediaQuery } from '@material-ui/core';

import { memo, useCallback } from 'react';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Link from './Link';
import { MobileButton } from './MobileMenuButton';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { useRouter } from 'next/router';

function BreadcrumbBar({ backPath, backPage, currentPage }) {
  const router = useRouter();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const handleClick = useCallback(() => {
    router.push(backPath);
  }, [router, backPath]);

  return !isMobile ? (
    <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon />}>
      <Link underline="always" color="inherit" href={backPath}>
        {backPage}
      </Link>
      <Typography variant="h6" noWrap>
        {currentPage}
      </Typography>
    </Breadcrumbs>
  ) : (
    <Box display="flex" alignItems="center" width="100%">
      <MobileButton
        // label={t('Back')}
        Icon={ArrowBackIcon}
        onClick={handleClick}
      />
    </Box>
  );
}

export default memo(BreadcrumbBar);