import FileHandler from '@tiptap/extension-file-handler';
import Placeholder from '@tiptap/extension-placeholder';
import {
  BackgroundColor,
  FontSize,
  LineHeight,
  TextStyle,
} from '@tiptap/extension-text-style';
import { Dropcursor, Focus, Gapcursor, UndoRedo } from '@tiptap/extensions';
import type { Extensions } from '@tiptap/react';

export const EDITOR_EXTENSIONS: Extensions = [
  TextStyle,
  BackgroundColor,
  Dropcursor,
  FileHandler.configure({
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
    onDrop: (currentEditor, files, pos) => {
      files.forEach((file) => {
        const fileReader = new FileReader();

        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
          currentEditor
            .chain()
            .insertContentAt(pos, {
              type: 'image',
              attrs: {
                src: fileReader.result,
              },
            })
            .focus()
            .run();
        };
      });
    },
    onPaste: (currentEditor, files, htmlContent) => {
      files.forEach((file) => {
        if (htmlContent) {
          // if there is htmlContent, stop manual insertion & let other extensions handle insertion via inputRule
          // you could extract the pasted file from this url string and upload it to a server for example
          console.log(htmlContent); // oxlint-disable-line no-console
          return false;
        }

        const fileReader = new FileReader();

        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
          currentEditor
            .chain()
            .insertContentAt(currentEditor.state.selection.anchor, {
              type: 'image',
              attrs: {
                src: fileReader.result,
              },
            })
            .focus()
            .run();
        };
      });
    },
  }),
  Focus.configure({
    className: 'magiarium-editor__node--focus', // フォーカス時に付与するクラス名
    mode: 'deepest',
  }),
  FontSize,
  Gapcursor,
  LineHeight,
  Placeholder.configure({
    showOnlyWhenEditable: false, // 編集可能な場合のみ表
    placeholder: ({ node }) => {
      switch (node.type.name) {
        case 'paragraph':
          return '本文を入力してください。';
        case 'heading':
          return '見出しを入力してください。';
        default:
          return 'ノードブロックを選択してください';
      }
    },
  }),
  UndoRedo,
  Gapcursor,
];
