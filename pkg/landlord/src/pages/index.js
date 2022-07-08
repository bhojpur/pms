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

import { isServer, redirect } from '../utils';

import { getStoreInstance } from '../store';
import { setOrganizationId } from '../utils/fetch';
import { toJS } from 'mobx';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { withAuthentication } from '../components/Authentication';

const Index = (props) => {
  const { redirectPath } = props;
  const router = useRouter();

  useEffect(() => {
    router.push(redirectPath);
  }, [router, redirectPath]);

  return null;
};

Index.getInitialProps = async (context) => {
  console.log('Index.getInitialProps');
  const store = isServer() ? context.store : getStoreInstance();

  let redirectPath = '/firstaccess';
  if (store.organization.items.length) {
    if (!store.organization.selected) {
      store.organization.setSelected(store.organization.items[0], store.user);
      setOrganizationId(store.organization.items[0]._id);
    }
    redirectPath = `/${store.organization.selected.name}/dashboard`;
  }

  if (isServer()) {
    redirect(context, redirectPath);
  }

  const props = {
    redirectPath,
    initialState: {
      store: toJS(store),
    },
  };
  return props;
};

export default withAuthentication(Index);