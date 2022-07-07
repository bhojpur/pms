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

import { drawerWidth } from '../styles.js';

import { makeStyles } from '@material-ui/core/styles';
const drawerOuterHeight = 330;
const drawerInnerHeight = 300;

export const useStyles = makeStyles((theme) => ({
  drawerOpen: {
    position: 'fixed',
    top: `calc(40vh - ${drawerOuterHeight / 2}px)`,
    left: 11,
    height: drawerOuterHeight,
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    border: 0,
    borderRadius: theme.shape.borderRadius,
    zIndex: theme.zIndex.appBar + 1,
    boxShadow: theme.shadows[3],
  },
  drawerClose: {
    position: 'fixed',
    top: `calc(40vh - ${drawerOuterHeight / 2}px)`,
    left: 11,
    height: drawerOuterHeight,
    width: theme.spacing(7) + 1,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    border: 0,
    borderRadius: theme.shape.borderRadius,
    zIndex: theme.zIndex.appBar + 1,
    boxShadow: theme.shadows[3],
  },
  list: {
    margin: 'auto 0',
    height: drawerInnerHeight,
  },
  itemSelected: {
    color: [theme.palette.info.contrastText, '!important'],
    backgroundColor: [theme.palette.primary.main, '!important'],
  },
  mobileItemSelected: {
    color: [theme.palette.primary.main, '!important'],
    backgroundColor: ['none', '!important'],
  },
  itemTextOpen: {
    opacity: 100,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  itemTextClose: {
    opacity: 0,
    transition: theme.transitions.create('opacity', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
}));