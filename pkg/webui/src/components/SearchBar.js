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

import { InputAdornment, TextField } from '@material-ui/core';
import { useCallback, useState } from 'react';

import SearchIcon from '@material-ui/icons/Search';
import { useTimeout } from '../utils/hooks';
import useTranslation from 'next-translate/useTranslation';

const SearchBar = ({ onSearch, defaultValue = '' }) => {
  const { t } = useTranslation('common');
  const [searchText, setSearchText] = useState(defaultValue);
  const triggerSearch = useTimeout(() => {
    onSearch(searchText);
  }, 250);

  // TODO: use useEffect to trigger the search
  // commented as now this cause infinite rendering loop
  // useEffect(() => {
  //   triggerSearch.start();
  // }, [searchText, onSearch]);

  const onChange = useCallback(
    (event) => {
      setSearchText(event.target.value || '');
      // this hack works without useEffect because the action
      // is triggered 250ms later after the state update
      triggerSearch.start();
    },
    [setSearchText, triggerSearch]
  );

  return (
    <TextField
      fullWidth
      placeholder={t('Search')}
      defaultValue={defaultValue}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      onChange={onChange}
    />
  );
};

export default SearchBar;