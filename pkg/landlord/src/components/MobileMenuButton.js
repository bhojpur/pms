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
    Button,
    Typography,
    useTheme,
    withStyles,
  } from '@material-ui/core';
  
  import { hexToRgb } from '../styles/styles';
  import { useCallback } from 'react';
  import useTranslation from 'next-translate/useTranslation';
  
  const StyledButton = withStyles(() => ({
    root: {
      fontSize: 9,
    },
  }))(Button);
  
  const StyleMenuButton = withStyles((theme) => ({
    root: {
      color: 'rgba(' + hexToRgb(theme.palette.info.contrastText) + ', 0.8)',
      fontSize: 9,
      padding: 0,
      margin: 0,
      paddingTop: 2,
      borderRadius: 0,
    },
  }))(Button);
  
  function MobileMenuButton({ labelId, Icon, selected, item, onClick }) {
    const theme = useTheme();
    const { t } = useTranslation('common');
  
    const handleClick = useCallback(() => {
      onClick(item);
    }, [item, onClick]);
  
    return (
      <Box
        borderTop={`5px solid ${
          selected ? theme.palette.primary.main : 'transparent'
        }`}
      >
        <StyleMenuButton onClick={handleClick}>
          <Box display="flex" flexDirection="column">
            <Box>
              <Icon fontSize="small" />
            </Box>
            <Typography variant="inherit">{t(labelId)}</Typography>
          </Box>
        </StyleMenuButton>
      </Box>
    );
  }
  
  export default MobileMenuButton;
  
  export function MobileButton({ label, Icon, onClick, ...props }) {
    const handleClick = useCallback(() => {
      onClick();
    }, [onClick]);
  
    return (
      <StyledButton {...props} size="small" onClick={handleClick}>
        <Box display="flex" flexDirection="column">
          <Box>
            <Icon fontSize="small" />
          </Box>
          <Typography variant="inherit">{label}</Typography>
        </Box>
      </StyledButton>
    );
  }