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
    AppBar,
    Box,
    Card,
    CardActionArea,
    CardContent,
    Toolbar,
    useMediaQuery,
    useTheme,
  } from '@material-ui/core';
  import { forwardRef, Fragment, useCallback, useState } from 'react';
  
  import Button from '@material-ui/core/Button';
  import Dialog from '@material-ui/core/Dialog';
  import { hexToRgb } from '../styles/styles';
  import Loading from './Loading';
  import { MobileButton } from './MobileMenuButton';
  import Slide from '@material-ui/core/Slide';
  import Typography from '@material-ui/core/Typography';
  import { useComponentMountedRef } from '../utils/hooks';
  import useTranslation from 'next-translate/useTranslation';
  
  const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  
  const CardMenuItemContent = ({ illustration, label, description }) => {
    return (
      <Card>
        <CardActionArea>
          <CardContent>
            {illustration}
            <Box py={2}>
              <Typography align="center" variant="subtitle1">
                {label}
              </Typography>
            </Box>
            {!!description && (
              <Box height={50}>
                <Typography variant="body2" color="textSecondary">
                  {description}
                </Typography>
              </Box>
            )}
          </CardContent>
        </CardActionArea>
      </Card>
    );
  };
  
  const CardMenuItem = ({ value, illustration, label, description, onClick }) => {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  
    const onMenuClick = useCallback(() => {
      onClick(value);
    }, [value, onClick]);
  
    return (
      <Box
        width={!isMobile ? 300 : '100%'}
        pr={!isMobile ? 2 : 0}
        pb={2}
        onClick={onMenuClick}
        data-cy={`template-${label.replace(/\s/g, '')}`}
      >
        <CardMenuItemContent
          illustration={illustration}
          label={label}
          description={description}
        />
      </Box>
    );
  };
  
  const FullScreenDialogMenu = ({
    buttonLabel,
    dialogTitle,
    Icon,
    menuItems,
    onClick,
    ...props
  }) => {
    const { t } = useTranslation('common');
    const mountedRef = useComponentMountedRef();
    const theme = useTheme();
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  
    const [runningAction, setRunningAction] = useState(false);
    const [open, setOpen] = useState(false);
  
    const handleClickOpen = useCallback(() => {
      setOpen(true);
    }, []);
  
    const handleClose = useCallback(() => {
      setOpen(false);
    }, []);
  
    const handleMenuClick = useCallback(
      async (value) => {
        setRunningAction(true);
        await onClick(value);
        if (mountedRef.current) {
          setOpen(false);
          setRunningAction(false);
        }
      },
      [onClick, mountedRef]
    );
  
    return (
      <>
        {!isMobile ? (
          <Button
            {...props}
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
        >
          <AppBar position="sticky">
            <Toolbar>
              <Box width="100%" display="flex" alignItems="center">
                <Box flexGrow={1}>
                  <Typography>{dialogTitle}</Typography>
                </Box>
                <Box ml={4}>
                  <Button color="inherit" onClick={handleClose}>
                    {t('Close')}
                  </Button>
                </Box>
              </Box>
            </Toolbar>
          </AppBar>
  
          <Box display="flex" flexWrap="wrap" py={2} px={5}>
            {menuItems.map((menuItem) => {
              const {
                key,
                label,
                description,
                illustration,
                badgeContent,
                badgeColor,
                value,
              } = menuItem;
  
              return (
                <CardMenuItem
                  key={key}
                  value={value}
                  label={label}
                  description={description}
                  illustration={illustration}
                  badgeContent={badgeContent}
                  badgeColor={badgeColor}
                  onClick={handleMenuClick}
                />
              );
            })}
          </Box>
          {runningAction && (
            <Box
              sx={{
                position: 'fixed',
                top: 0,
                right: 0,
                height: '100%',
                width: '100%',
                backgroundColor: `rgba(${hexToRgb(
                  theme.palette.background.paper
                )}, 0.5)`,
              }}
            >
              <Loading />
            </Box>
          )}
        </Dialog>
      </>
    );
  };
  
  export default FullScreenDialogMenu;