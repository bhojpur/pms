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

import { Box, Typography } from '@material-ui/core';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { useCallback } from 'react';
import { useDialog } from '../utils/hooks';
import useTranslation from 'next-translate/useTranslation';
import WarningIcon from '@material-ui/icons/ReportProblemOutlined';

function ConfirmDialog({
  title,
  subTitle,
  subTitle2,
  open,
  setOpen,
  onConfirm,
}) {
  const { t } = useTranslation('common');
  const handleClose = useCallback(() => setOpen(false), [setOpen]);
  const handleConfirm = useCallback(() => {
    setOpen(false);
    onConfirm(open);
  }, [setOpen, onConfirm, open]);

  return (
    <Dialog
      open={!!open}
      onClose={handleClose}
      aria-labelledby="confirm-dialog"
    >
      <Box p={1}>
        <DialogContent>
          <Box display="flex" alignItems="center">
            <Box pr={1}>
              <WarningIcon fontSize="large" color="secondary" />
            </Box>
            <Typography variant="h6">{title}</Typography>
          </Box>
          {!!subTitle && (
            <Box py={2}>
              <Typography variant="body2" align="center">
                {subTitle}
              </Typography>
            </Box>
          )}
          {!!subTitle2 && (
            <Box pb={2}>
              <Typography variant="body2" align="center">
                {subTitle2}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button size="small" variant="contained" onClick={handleClose}>
            {t('No')}
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={handleConfirm}
            color="primary"
          >
            {t('Yes')}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default function useConfirmDialog() {
  return useDialog(ConfirmDialog);
}