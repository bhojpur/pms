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
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
  } from 'react';
  
  import Alert from '@material-ui/lab/Alert';
  import { observer } from 'mobx-react-lite';
  import Snackbar from '@material-ui/core/Snackbar';
  import { StoreContext } from '../store';
  import useTranslation from 'next-translate/useTranslation';
  
  export function useComponentMountedRef() {
    const mountedRef = useRef(false);
  
    useEffect(() => {
      mountedRef.current = true;
      return () => (mountedRef.current = false);
    });
  
    return mountedRef;
  }
  
  export function useTimeout(fn, delay) {
    const mountedRef = useComponentMountedRef();
    const fnRef = useRef(fn);
    const timerRef = useRef();
    const [isRunning, setIsRunning] = useState(false);
    const [isDone, setIsDone] = useState(false);
  
    useEffect(() => {
      fnRef.current = fn;
    }, [fn, clear]);
  
    const clear = useCallback(() => {
      timerRef.current && clearTimeout(timerRef.current);
    }, []);
  
    const start = useCallback(
      (...params) => {
        clear();
        setIsRunning(true);
        setIsDone(false);
        timerRef.current = setTimeout(async () => {
          if (!mountedRef.current) {
            return clear();
          }
          if (fnRef.current) {
            await fnRef.current(...params);
            setIsRunning(false);
            setIsDone(true);
          }
        }, delay);
      },
      [clear, delay, mountedRef]
    );
  
    return { start, clear, isRunning, isDone };
  }
  
  export function useInterval(fn, delay) {
    const mountedRef = useComponentMountedRef();
    const fnRef = useRef(fn);
    const timerRef = useRef();
    const [isRunning, setIsRunning] = useState(false);
  
    useEffect(() => {
      fnRef.current = fn;
    }, [fn, clear]);
  
    const clear = useCallback(() => {
      timerRef.current && clearInterval(timerRef.current);
    }, []);
  
    const start = useCallback(
      (...params) => {
        clear();
        setIsRunning(true);
        timerRef.current = setInterval(async () => {
          if (!mountedRef.current) {
            return clear();
          }
          if (fnRef.current) {
            await fnRef.current(...params);
            setIsRunning(false);
          }
        }, delay);
      },
      [clear, delay, mountedRef]
    );
  
    return { start, clear, isRunning };
  }
  
  export function usePaymentTypes() {
    const { t } = useTranslation('common');
  
    return useMemo(() => {
      const itemList = [
        {
          id: 'cheque',
          label: t('Cheque'),
          value: 'cheque',
        },
        {
          id: 'cash',
          label: t('Cash'),
          value: 'cash',
        },
        {
          id: 'levy',
          label: t('Levy'),
          value: 'levy',
        },
        {
          id: 'transfer',
          label: t('Transfer'),
          value: 'transfer',
        },
      ];
  
      return {
        itemList,
        itemMap: itemList.reduce((acc, { id, label, value }) => {
          acc[id] = { label, value };
          return acc;
        }, {}),
      };
    }, [t]);
  }
  
  export function useToast() {
    const Toast = () => {
      const store = useContext(StoreContext);
  
      const toastData = store.toastMessages?.length
        ? store.toastMessages[0]
        : null;
  
      const handleClose = useCallback(() => {
        store.shiftToastMessage();
      }, [store]);
  
      return (
        <Snackbar
          open={!!toastData?.message}
          autoHideDuration={3000}
          onClose={handleClose}
        >
          {toastData?.message ? (
            <Alert
              elevation={6}
              variant="filled"
              severity={toastData?.severity || 'error'}
            >
              {toastData?.message}
            </Alert>
          ) : null}
        </Snackbar>
      );
    };
  
    return observer(Toast);
  }
  
  export function useDialog(DialogComponent) {
    const [open, setOpen] = useState(false);
  
    const Dialog = (props) => {
      return <DialogComponent {...props} open={open} setOpen={setOpen} />;
    };
  
    return [Dialog, setOpen, open];
  }