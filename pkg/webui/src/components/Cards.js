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
    Box,
    Card,
    CardActionArea,
    Divider,
    Paper,
    Typography,
    Toolbar as UIToolbar,
  } from '@material-ui/core';
  import { Children, memo, useMemo } from 'react';
  
  import IconTypography from './IconTypography';
  
  const _variantToBgColor = (variant) => {
    switch (variant) {
      case 'success':
        return 'success.main';
      case 'warning':
        return 'warning.main';
      case 'danger':
        return 'error.main';
      default:
        return 'info.main';
    }
  };
  
  export const CardRow = memo(function CardRow({ children, ...props }) {
    return (
      <Box display="flex" alignItems="center" {...props}>
        {Children.toArray(children).map((child, index) => (
          <Box key={index} flexGrow={index === 0 ? 1 : 0}>
            {child}
          </Box>
        ))}
      </Box>
    );
  });
  
  export const PageCard = memo(function PageCard({
    variant,
    Icon,
    title,
    info,
    children,
  }) {
    const bgColor = useMemo(() => _variantToBgColor(variant), [variant]);
    return (
      <Paper>
        <Box
          p={1}
          bgcolor={bgColor}
          color="primary.contrastText"
          style={{
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
          }}
        >
          <Typography>{title}</Typography>
          <Box
            position="relative"
            height={130}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Box
              position="absolute"
              left={0}
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize={40}
            >
              <Icon fontSize="inherit" />
            </Box>
            {children}
          </Box>
          {!!info && <Typography>{info}</Typography>}
        </Box>
      </Paper>
    );
  });
  
  const CardContent = ({ Toolbar, info, minHeight, children }) => (
    <Box pt={1.8}>
      {!!Toolbar && (
        <>
          <UIToolbar>
            <Box width="100%" display="flex" justifyContent="flex-end">
              {Toolbar}
            </Box>
          </UIToolbar>
          <Box pb={1}>
            <Divider variant="middle" />
          </Box>
        </>
      )}
  
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        px={1.8}
        minHeight={minHeight}
      >
        {children}
      </Box>
  
      {info && (
        <>
          <Divider />
          <Box p={1}>
            <Typography component="div" color="textSecondary" variant="caption">
              {info}
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
  
  export const DashboardCard = memo(function DashboardCard({
    variant,
    Icon,
    title,
    info,
    Toolbar,
    minHeight = 'none',
    onClick,
    children,
  }) {
    return (
      <Box position="relative">
        {onClick ? (
          <Card onClick={onClick}>
            <CardActionArea>
              <CardContent info={info} Toolbar={Toolbar}>
                {children}
              </CardContent>
            </CardActionArea>
          </Card>
        ) : (
          <Card>
            <CardContent info={info} Toolbar={Toolbar} minHeight={minHeight}>
              {children}
            </CardContent>
          </Card>
        )}
        <Box
          display="flex"
          alignItems="center"
          position="absolute"
          top={-12}
          left={10}
          right={10}
          p={0.5}
          borderRadius={3}
          color="primary.contrastText"
          bgcolor={_variantToBgColor(variant)}
        >
          <IconTypography Icon={Icon} noWrap>
            {title}
          </IconTypography>
        </Box>
      </Box>
    );
  });
  
  export const PageInfoCard = memo(function PageInfoCard({
    variant,
    Icon,
    title,
    info,
    Toolbar,
    onClick,
    children,
  }) {
    return (
      <DashboardCard
        variant={variant}
        Icon={Icon}
        title={title}
        info={info}
        Toolbar={Toolbar}
        minHeight={200}
        onClick={onClick}
      >
        {children}
      </DashboardCard>
    );
  });