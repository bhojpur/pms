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
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography,
  } from '@material-ui/core';
  import { useCallback, useState } from 'react';
  
  import _ from 'lodash';
  import SearchBar from '../SearchBar';
  import useTranslation from 'next-translate/useTranslation';
  import { withStyles } from '@material-ui/core/styles';
  
  const StyledPaper = withStyles((theme) => ({
    root: {
      position: 'fixed',
      zIndex: theme.zIndex.drawer,
      top: 160,
      bottom: 15,
      right: 20,
      width: 350,
      backgroundColor: theme.palette.background.default,
    },
  }))(Paper);
  
  const StyledList = withStyles(() => ({
    root: {
      width: '100%',
    },
  }))(List);
  
  const StyledListItem = withStyles((theme) => ({
    root: {
      backgroundColor: theme.palette.background.paper,
      marginBottom: '0.5rem',
      boxShadow: theme.shadows[1],
    },
  }))(ListItem);
  
  function FieldItem({ field, onClick }) {
    const { t } = useTranslation('common');
    const _onClick = useCallback(() => onClick(field), [field, onClick]);
  
    return (
      <StyledListItem key={field._id} button onClick={_onClick}>
        <Box p={1}>
          <ListItemText
            primary={<Typography noWrap>{t(field._id)}</Typography>}
            disableTypography
          />
        </Box>
      </StyledListItem>
    );
  }
  
  export default function FieldMenu({ editor, fields }) {
    const { t } = useTranslation('common');
    const [filteredFields, setFilteredFields] = useState(fields);
  
    const onSearch = useCallback(
      (text) => {
        setFilteredFields(
          fields.filter(({ _id }) => {
            if (!text) {
              return true;
            }
            const title = _.deburr(t(_id).toLowerCase());
            const textToSearch = _.deburr(text.toLowerCase());
            if (title.indexOf(textToSearch) !== -1) {
              return true;
            }
  
            return false;
          })
        );
      },
      [t, fields]
    );
  
    const onInsertField = useCallback(
      ({ _id, marker }) => {
        // TODO: check why editor.chain().addTemplat(...).focus() doesn't work
        editor.commands.addTemplate(marker, t(_id));
        editor.commands.focus();
      },
      [t, editor]
    );
  
    return (
      <StyledPaper elevation={1} square>
        <Box
          display="flex"
          flexDirection="column"
          align-content="stretch"
          height="100%"
        >
          <Box display="flex" flexGrow={0} pt={4} pb={2} px={1}>
            <SearchBar onSearch={onSearch} />
          </Box>
  
          <Box display="flex" flexGrow={0} p={1}>
            <Typography variant="subtitle2">{t('Computed fields')}</Typography>
          </Box>
  
          <Box display="flex" flexGrow={1} overflow="auto" px={1}>
            <StyledList>
              {filteredFields.map((field) => {
                return (
                  <FieldItem
                    key={field._id}
                    field={field}
                    onClick={onInsertField}
                  />
                );
              })}
            </StyledList>
          </Box>
        </Box>
      </StyledPaper>
    );
  }