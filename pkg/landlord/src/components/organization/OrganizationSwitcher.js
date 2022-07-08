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

import { useCallback, useContext, useMemo } from 'react';
import getConfig from 'next/config';

import LocationCityIcon from '@material-ui/icons/LocationCity';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../../store';
import ToggleMenu from '../ToggleMenu';
import { useMediaQuery } from '@material-ui/core';

const {
  publicRuntimeConfig: { BASE_PATH },
} = getConfig();

const OrganizationSwitcher = observer(() => {
  const store = useContext(StoreContext);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const onChange = useCallback(
    ({ id }) => {
      if (store.organization.selected?._id !== id) {
        const organization = store.organization.items.find(
          ({ _id }) => _id === id
        );
        window.location.assign(
          `${BASE_PATH}/${organization.locale}/${organization.name}/dashboard`
        );
      }
    },
    [store.organization.selected, store.organization.items]
  );

  const options = useMemo(
    () =>
      store.organization.items.map(({ _id, name }) => ({
        id: _id,
        label: name,
      })),
    [store.organization.items]
  );

  const value = useMemo(
    () => options.find(({ id }) => id === store.organization.selected._id),
    [options, store.organization.selected]
  );

  return store.organization?.items?.length > 0 ? (
    <ToggleMenu
      startIcon={<LocationCityIcon />}
      options={options}
      value={value}
      noLabel={isMobile}
      onChange={onChange}
    />
  ) : null;
});

export default OrganizationSwitcher;