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
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    Paper,
    Typography,
  } from '@material-ui/core';
  import { useCallback, useMemo } from 'react';
  
  import Alert from './Alert';
  import DeleteIcon from '@material-ui/icons/Delete';
  import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
  import moment from 'moment';
  import ScannerOutlinedIcon from '@material-ui/icons/ScannerOutlined';
  import useTranslation from 'next-translate/useTranslation';
  
  const DocumentItem = ({ document, onEdit, onDelete, disabled }) => {
    const { t } = useTranslation('common');
  
    const handleEditClick = useCallback(() => {
      onEdit(document);
    }, [onEdit, document]);
  
    const handleDeleteClick = useCallback(() => {
      onDelete(document);
    }, [onDelete, document]);
  
    const expiryMoment = useMemo(() => {
      return document.expiryDate ? moment(document.expiryDate) : null;
    }, [document.expiryDate]);
  
    const isExpired = useMemo(() => {
      return expiryMoment ? moment().isSameOrAfter(expiryMoment) : false;
    }, [expiryMoment]);
  
    return (
      <ListItem button divider dense onClick={handleEditClick}>
        <ListItemText
          id={document._id}
          primary={
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              minHeight={65.5}
            >
              <Box display="flex">
                <Box mr={1}>
                  {document.type === 'text' ? (
                    <DescriptionOutlinedIcon color="action" />
                  ) : (
                    <ScannerOutlinedIcon color="action" />
                  )}
                </Box>
                <Typography component="div">{document.name}</Typography>
              </Box>
  
              {expiryMoment ? (
                <Alert
                  severity={isExpired ? 'warning' : 'info'}
                  title={
                    isExpired
                      ? t('expired document')
                      : t('expiry {{relativeDate}}', {
                          relativeDate: expiryMoment.fromNow(),
                        })
                  }
                />
              ) : (
                !!document.description && (
                  <Typography variant="caption">
                    {document.description}
                  </Typography>
                )
              )}
            </Box>
          }
        />
        {!disabled ? (
          <ListItemSecondaryAction>
            <IconButton edge="end" onClick={handleDeleteClick}>
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        ) : null}
      </ListItem>
    );
  };
  
  export default function DocumentList({
    documents,
    onEdit,
    onDelete,
    disabled = false,
  }) {
    return (
      <Paper variant="outlined">
        <Box height={396} overflow="auto">
          {documents.length > 0 ? (
            <List dense>
              {documents
                .sort(({ type: type1 }, { type: type2 }) =>
                  type1.localeCompare(type2)
                )
                .map((document) => (
                  <DocumentItem
                    key={document._id}
                    document={document}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    disabled={disabled}
                  />
                ))}
            </List>
          ) : null}
        </Box>
      </Paper>
    );
  }