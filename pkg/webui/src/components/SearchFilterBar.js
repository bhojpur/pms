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
    Box,
    InputAdornment,
    TextField,
    useMediaQuery,
    withStyles,
  } from '@material-ui/core';
  import { useCallback, useMemo, useState } from 'react';
  
  import FilterListIcon from '@material-ui/icons/FilterList';
  import SearchIcon from '@material-ui/icons/Search';
  import ToggleMenu from './ToggleMenu';
  import { useTimeout } from '../utils/hooks';
  import useTranslation from 'next-translate/useTranslation';
  
  const StyledTextField = withStyles({
    root: {
      width: '100%',
      '& .MuiInput-root': {
        color: 'inherit',
        '& .MuiInputAdornment-root': {
          color: 'inherit',
        },
      },
    },
  })(TextField);
  
  const SearchFilterBar = ({
    filters,
    onSearch,
    defaultValue = { status: '', searchText: '' },
  }) => {
    const { t } = useTranslation('common');
    const [filter, setFilter] = useState(defaultValue.status);
    const [searchText, setSearchText] = useState(defaultValue.searchText);
    const triggerSearch = useTimeout(() => {
      onSearch(filter, searchText);
    }, 250);
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  
    // TODO: use useEffect to trigger the search
    // commented as now this cause infinite rendering loop
    // useEffect(() => {
    //   triggerSearch.start();
    // }, [filter, searchText, triggerSearch]);
  
    const onTextChange = useCallback(
      (event) => {
        setSearchText(event.target.value || '');
        // this hack works without useEffect because the action
        // is triggered 250ms later after the state update
        triggerSearch.start();
      },
      [setSearchText, triggerSearch]
    );
  
    const onToggleChange = useCallback(
      (option) => {
        setFilter(option.id);
        // this hack works without useEffect because the action
        // is triggered 250ms later after the state update
        triggerSearch.start();
      },
      [setFilter, triggerSearch]
    );
  
    const selectedItem = useMemo(
      () => filters.find((f) => f.id === defaultValue.status) || filters[0],
      [defaultValue, filters]
    );
  
    return (
      <Box display="flex" flexWrap="nowrap" alignItems="center">
        <Box flexGrow={1}>
          <StyledTextField
            placeholder={t('Search')}
            defaultValue={defaultValue.searchText}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            onChange={onTextChange}
          />
        </Box>
        <Box>
          <ToggleMenu
            startIcon={<FilterListIcon />}
            options={filters}
            value={selectedItem}
            noLabel={isMobile}
            onChange={onToggleChange}
          />
        </Box>
      </Box>
    );
  };
  
  export default SearchFilterBar;