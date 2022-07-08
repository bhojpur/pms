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

import { AppBar, Box, Grid, useMediaQuery } from '@material-ui/core';
import React, { memo, useCallback } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { MobileButton } from './MobileMenuButton';
import Slide from '@material-ui/core/Slide';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import useTranslation from 'next-translate/useTranslation';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FullScreenDialogButton = ({
  dialogTitle,
  buttonLabel,
  saveButtonLabel,
  cancelButtonLabel,
  showSave,
  showCancel,
  Icon,
  children,
  ...props
}) => {
  const { t } = useTranslation('common');
  const [open, setOpen] = React.useState(false);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const handleClickOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleSave = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      {!isMobile ? (
        <Button
          {...props}
          size="small"
          startIcon={<Icon />}
          onClick={handleClickOpen}
          style={{ whiteSpace: 'nowrap' }}
        >
          {buttonLabel}
        </Button>
      ) : (
        <MobileButton
          {...props}
          variant="text"
          Icon={Icon}
          label={buttonLabel}
          onClick={handleClickOpen}
        />
      )}
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        keepMounted
      >
        <AppBar position="sticky">
          <Toolbar>
            <Box width="100%" display="flex" alignItems="center">
              <Box flexGrow={1}>
                <Typography variant="h6">{dialogTitle}</Typography>
              </Box>
              <Box>
                <Grid container spacing={1}>
                  <Grid item>
                    {showCancel && (
                      <Button color="inherit" onClick={handleClose}>
                        {cancelButtonLabel || t('Cancel')}
                      </Button>
                    )}
                  </Grid>
                  <Grid item>
                    {showSave && (
                      <Button
                        autoFocus
                        color="primary"
                        onClick={handleSave}
                        data-cy="submit"
                      >
                        {saveButtonLabel || t('Save')}
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>

        <Box py={2} px={3}>
          {open ? children : null}
        </Box>
      </Dialog>
    </>
  );
};

export default memo(FullScreenDialogButton);