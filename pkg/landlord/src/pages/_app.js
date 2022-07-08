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

import 'moment/locale/fr';
import 'moment/locale/pt';
import 'moment/locale/de';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import 'react-awesome-lightbox/build/style.css';
import '../components/PdfViewer/pdfviewer.css';
import '../components/RichTextEditor/richtexteditor.css';

import * as Yup from 'yup';

import { memo, useEffect } from 'react';

import App from 'next/app';
import Application from '../components/Application';
import CssBaseline from '@material-ui/core/CssBaseline';
import DateFnsUtils from '@date-io/moment';
import getConfig from 'next/config';
import Head from 'next/head';
import { InjectStoreContext } from '../store';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import theme from '../styles/theme';
import { ThemeProvider } from '@material-ui/core/styles';

const {
  publicRuntimeConfig: { BASE_PATH, APP_NAME, DEMO_MODE },
} = getConfig();

const APP_TITLE = [APP_NAME];
if (process.env.NODE_ENV === 'development') {
  APP_TITLE.push('DEV');
} else if (DEMO_MODE) {
  APP_TITLE.push('DEMO');
}

Yup.addMethod(Yup.string, 'emails', function (message) {
  return this.test({
    name: 'emails',
    message: message || '${path} one of the emails is invalid or is not unique',
    test: (value) => {
      if (value == null) {
        return true;
      }
      const schema = Yup.string().email();
      const emails = value.replace(/\s/g, '').split(',');
      return (
        emails.every((email) => schema.isValidSync(email)) &&
        emails.length === new Set(emails).size
      );
    },
  });
});

const MyApp = memo(function MyApp(props) {
  console.log('MyApp functional component');
  const { Component, pageProps } = props;

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <link rel="shortcut icon" href={`${BASE_PATH}/favicon.svg`} />
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css"
          rel="stylesheet"
        ></link>
        <title>{APP_TITLE.join(' - ')}</title>
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <InjectStoreContext initialData={pageProps.initialState.store}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Application {...pageProps}>
              <Component {...pageProps} />
            </Application>
          </MuiPickersUtilsProvider>
        </InjectStoreContext>
      </ThemeProvider>
    </>
  );
});

MyApp.getInitialProps = async (appContext) => {
  console.log('MyApp.getInitialProps');
  const appProps = await App.getInitialProps(appContext);
  if (!appProps.pageProps.initialState) {
    appProps.pageProps.initialState = {};
  }
  return appProps;
};

export default MyApp;