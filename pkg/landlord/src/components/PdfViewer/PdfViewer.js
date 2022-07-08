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
    Button,
    Dialog,
    Typography,
    withStyles,
  } from '@material-ui/core';
  import React, { useCallback, useContext, useEffect, useState } from 'react';
  import { Viewer, Worker } from '@react-pdf-viewer/core';
  import { apiFetcher } from '../../utils/fetch';
  import EditorButton from '../RichTextEditor/EditorButton';
  import { grayColor } from '../../styles/styles';
  import Loading from '../Loading';
  import { printPlugin } from '@react-pdf-viewer/print';
  import { StoreContext } from '../../store';
  import useTranslation from 'next-translate/useTranslation';
  
  const StyledDialog = withStyles(() => ({
    paperFullScreen: {
      backgroundColor: grayColor[10],
      overflow: 'hidden',
    },
  }))(Dialog);
  
  export default function PdfViewer({ open, setOpen }) {
    const { t } = useTranslation('common');
    const store = useContext(StoreContext);
    const [pdfSrc, setPdfSrc] = useState();
  
    const printPluginInstance = printPlugin();
    const { Print } = printPluginInstance;
  
    const handleClose = useCallback(() => {
      setPdfSrc();
      setOpen(false);
    }, [setOpen]);
  
    useEffect(() => {
      (async () => {
        if (open?.url) {
          try {
            const response = await apiFetcher().get(open.url, {
              responseType: 'blob',
            });
            setPdfSrc(URL.createObjectURL(response.data));
          } catch (error) {
            handleClose();
            console.error(error);
            store.pushToastMessage({
              message: t('Document not found'),
              severity: 'error',
            });
          }
        }
      })();
    }, [t, open, store, handleClose]);
  
    if (open && pdfSrc) {
      return (
        <StyledDialog fullScreen open={!!open} onClose={handleClose}>
          <AppBar>
            <Box display="flex" justifyContent="space-between" p={1}>
              <Typography variant="h6" component="div">
                {open.title}
              </Typography>
              <Box display="flex">
                <Box mr={1}>
                  <Print>
                    {(props) => (
                      <EditorButton
                        iconType="ri-printer-fill"
                        onClick={props.onClick}
                      />
                    )}
                  </Print>
                </Box>
                <Button variant="contained" size="small" onClick={handleClose}>
                  {t('Close')}
                </Button>
              </Box>
            </Box>
          </AppBar>
          <Box overflow="auto">
            <Box pt={8} maxWidth="230mm">
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.14.305/legacy/build/pdf.worker.js">
                <Viewer fileUrl={pdfSrc} plugins={[printPluginInstance]} />
              </Worker>
            </Box>
          </Box>
        </StyledDialog>
      );
    }
  
    if (open && !pdfSrc) {
      return <Loading fullScreen />;
    }
  
    return null;
  }