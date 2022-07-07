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

import { createContext, useEffect, useState } from 'react';
import { isClient, isServer } from '../utils';

import { enableStaticRendering } from 'mobx-react-lite';
import moment from 'moment';
import Store from './Store';

enableStaticRendering(isServer());

let _store;

function getStoreInstance(initialData) {
  if (isServer()) {
    return new Store();
  }

  if (!_store) {
    console.log('create store');
    _store = new Store();
    _store.hydrate(initialData);
    if (process.env.NODE_ENV === 'development') {
      window.__store = _store;
    }
  }

  return _store;
}

const StoreContext = createContext();

function InjectStoreContext({ children, initialData }) {
  const [store, setStore] = useState();

  useEffect(() => {
    moment.locale(initialData?.organization?.selected?.locale ?? 'en');
    const newStore = getStoreInstance(initialData);
    setStore(newStore);
    if (isClient() && process.env.NODE_ENV === 'development') {
      window.__store = newStore;
    }
  }, [initialData]);

  return store ? (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  ) : null;
}

export { InjectStoreContext, StoreContext, getStoreInstance };