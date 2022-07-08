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

import { EditorContent, useEditor } from '@tiptap/react';
import { useCallback, useEffect, useState } from 'react';

import EditorMenu from './EditorMenu';
import { handlePageBreaks } from './helpers';
import jsesc from 'jsesc';
import Placeholder from '@tiptap/extension-placeholder';
import StarterKit from '@tiptap/starter-kit';
import Superscript from '@tiptap/extension-superscript';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import TemplateNode from './TemplateNode';
import TextAlign from '@tiptap/extension-text-align';
import { toJS } from 'mobx';
import Underline from '@tiptap/extension-underline';
import { useTimeout } from '../../utils/hooks';
import useTranslation from 'next-translate/useTranslation';

const SAVE_DELAY = 250;
const CLEAR_SAVE_LABEL_DELAY = 2500;

const RichTextEditor = ({
  onLoad,
  onSave,
  onClose,
  title: initialTitle,
  fields = [],
  showPrintButton,
  placeholder = '',
  editable = true,
}) => {
  const { t } = useTranslation('common');
  const [ready, setReady] = useState(false);
  const [title, setTitle] = useState(initialTitle || t('Untitled document'));
  const [saving, setSaving] = useState();
  const editor = useEditor({
    editable,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Superscript,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TemplateNode.configure({
        HTMLAttributes: {
          class: 'template',
        },
      }),
    ],
    onUpdate({ editor }) {
      triggerSaveContents.start();
      handlePageBreaks(editor);
    },
  });

  useEffect(() => {
    (async () => {
      if (!editor) {
        return;
      }
      const data = await onLoad();
      setReady(true);
      if (data) {
        editor.commands.setContent(toJS(data));
      }
      handlePageBreaks(editor);
    })();
  }, [editor, onLoad]);

  const triggerClearSaveState = useTimeout(() => {
    setSaving();
  }, CLEAR_SAVE_LABEL_DELAY);

  const triggerSaveContents = useTimeout(async () => {
    if (editor) {
      try {
        setSaving(true);
        await onSave(title, editor.getJSON(), jsesc(editor.getHTML()));
        setSaving(false);
        triggerClearSaveState.start();
      } catch (error) {
        console.error(error);
      }
    }
  }, SAVE_DELAY);

  const onTitleChange = useCallback(
    (value) => {
      setTitle(value);
      triggerSaveContents.start();
    },
    [setTitle, triggerSaveContents]
  );

  return (
    <>
      {editor && ready ? (
        <>
          <EditorMenu
            editor={editor}
            title={title}
            fields={fields}
            showPrintButton={showPrintButton}
            saving={saving}
            onChange={onTitleChange}
            onClose={onClose}
            editable={editable}
          />
          <EditorContent editor={editor} />
        </>
      ) : null}
    </>
  );
};

export default RichTextEditor;