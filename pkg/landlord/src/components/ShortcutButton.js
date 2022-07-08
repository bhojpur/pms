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
    Hidden,
    makeStyles,
    Typography,
    useTheme,
  } from '@material-ui/core';
  
  const ShortcutButton = ({ Icon, label, disabled, onClick }) => {
    const theme = useTheme();
    const useStyles = makeStyles((theme) => ({
      root: {
        paddingTop: 10,
        paddingBottom: 10,
        color: theme.palette.info.contrastText,
        backgroundColor: theme.palette.info.main,
        '&:hover': {
          background: theme.palette.info.dark,
        },
      },
    }));
    const classes = useStyles();
  
    return (
      <>
        <Hidden smDown>
          <Button
            startIcon={<Icon style={{ fontSize: 28 }} />}
            size="large"
            className={classes.root}
            fullWidth
            disabled={!!disabled}
            onClick={onClick}
          >
            <Box minWidth={250} textAlign="left">
              {label}
            </Box>
          </Button>
        </Hidden>
        <Hidden mdUp>
          <Button
            startIcon={<Icon fontSize="small" />}
            className={classes.root}
            fullWidth
            disabled={!!disabled}
            onClick={onClick}
          >
            <Box
              minWidth={200}
              textAlign="left"
              fontSize={theme.typography.caption.fontSize}
            >
              <Typography variant="inherit">{label}</Typography>
            </Box>
          </Button>
        </Hidden>
      </>
    );
  };
  
  export default ShortcutButton;