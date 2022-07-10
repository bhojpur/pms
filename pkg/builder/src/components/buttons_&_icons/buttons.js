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

import React from 'react';

import { Button, Grid, withStyles } from '@material-ui/core';

import clsx from 'clsx';

import { amber, deepPurple } from '@material-ui/core/colors';

const styles = ({ theme }) => ({
  default: {
    borderRadius: 0,
    textTransform: 'none',
  },

  primary: {
    '&:hover': {
      backgroundColor: amber[500],
      color: deepPurple[900],
    },
  },
  secondary: {
    fontWeight: 700,

  },

});

const Buttons = ({ classes }) => {

  return (

    <Grid container spacing={3}>
      <Grid item>
        <Button
          disableElevation
          variant="contained"
          color="default"
          className={classes.default}
        >
          Default
        </Button>
      </Grid>

      <Grid item>
        <Button
          variant="contained"
          color="primary"
          className={clsx(classes.default, classes.primary)}
          disableElevation
        >
          Primary
        </Button>
      </Grid>

      <Grid item>
        <Button
          variant="contained"
          color="secondary"
          className={clsx(classes.default, classes.secondary)}
          disableElevation
        >
          Secondary
        </Button>
      </Grid>
    </Grid>

  );

};

export default withStyles(styles)(Buttons);