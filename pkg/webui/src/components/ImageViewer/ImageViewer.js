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

import { useCallback, useContext, useEffect, useState } from 'react';

import { apiFetcher } from '../../utils/fetch';
import Lightbox from 'react-awesome-lightbox';
import Loading from '../Loading';
import { StoreContext } from '../../store';
import useTranslation from 'next-translate/useTranslation';

export default function ImageViewer({ open, setOpen }) {
  const { t } = useTranslation('common');
  const store = useContext(StoreContext);
  const [imageSrc, setImageSrc] = useState();

  const handleClose = useCallback(() => {
    setImageSrc();
    setOpen(false);
  }, [setOpen]);

  useEffect(() => {
    (async () => {
      if (open?.url) {
        try {
          const response = await apiFetcher().get(open.url, {
            responseType: 'blob',
          });
          setImageSrc(URL.createObjectURL(response.data));
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

  if (open && imageSrc) {
    return (
      <Lightbox image={imageSrc} title={open.title} onClose={handleClose} />
    );
  }
  if (open && !imageSrc) {
    return <Loading fullScreen />;
  }

  return null;
}