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
    grayColor,
    hexToRgb,
    primaryColor,
    successColor,
    warningColor,
    whiteColor,
  } from './styles';
  
  import { createTheme } from '@material-ui/core/styles';
  
  // Create a theme instance.
  const theme = createTheme({
    palette: {
      primary: {
        light: primaryColor[0],
        main: primaryColor[1],
        dark: primaryColor[2],
        contrastText: whiteColor,
      },
      success: {
        light: successColor[0],
        main: successColor[1],
        dark: successColor[2],
        contrastText: 'rgba(0, 0, 0, 0.87)',
      },
      warning: {
        light: warningColor[0],
        main: warningColor[1],
        dark: warningColor[2],
        contrastText: 'rgba(0, 0, 0, 0.87)',
      },
      backgroundColor: grayColor[10],
    },
    overrides: {
      MuiInputAdornment: {
        root: {
          color: grayColor[7],
        },
      },
      MuiButton: {
        root: {
          color: grayColor[7],
        },
        containedPrimary: {
          color: whiteColor,
          '&.Mui-selected': {
            backgroundColor: '#7a1e89',
          },
        },
      },
      MuiInput: {
        root: {
          color: grayColor[7],
        },
      },
      MuiAppBar: {
        colorPrimary: {
          color: grayColor[2],
          backgroundColor: whiteColor,
        },
      },
      MuiDrawer: {
        paper: {
          overflowX: 'hidden',
        },
      },
      MuiStepIcon: {
        root: {
          '&$completed': {
            color: successColor[1],
          },
        },
      },
      MuiTableRow: {
        root: {
          '&$selected, &$selected$hover': {
            backgroundColor: 'rgba(' + hexToRgb(successColor[1]) + ', 0.08)',
          },
        },
      },
    },
  });
  
  export default theme;