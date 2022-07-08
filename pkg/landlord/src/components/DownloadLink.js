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

import { Box, IconButton, Link, Tooltip, Typography } from '@material-ui/core';
import { memo, useCallback } from 'react';

import { downloadDocument } from '../utils/fetch';
import SaveAltIcon from '@material-ui/icons/SaveAlt';

const DownloadLink = ({
  label,
  tooltipText,
  url,
  withIcon = false,
  documentName,
  ...props
}) => {
  const onClick = useCallback(
    () => downloadDocument({ endpoint: url, documentName }),
    [url, documentName]
  );

  return (
    <>
      {withIcon && tooltipText && (
        <Tooltip title={tooltipText} aria-label="download">
          <IconButton size="small" onClick={onClick} aria-label="download">
            <SaveAltIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
      )}
      {!withIcon && label && (
        <Link
          component="button"
          variant={props.variant}
          underline="always"
          onClick={onClick}
        >
          <Typography {...props}>{label}</Typography>
        </Link>
      )}
      {withIcon && !tooltipText && (
        <Box display="flex" alignItems="center">
          {label && <Typography {...props}>{label}</Typography>}
          <IconButton size="small" onClick={onClick} aria-label="download">
            <SaveAltIcon fontSize="inherit" />
          </IconButton>
        </Box>
      )}
    </>
  );
};

export default memo(DownloadLink);