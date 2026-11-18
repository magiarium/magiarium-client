import { detectNodeTypeFromEditor } from '@/features/tiptap/lib/detectNodeTypeFromEditor';
import {
  handleImageUpload,
  MAX_FILE_SIZE,
} from '@/features/tiptap/lib/tiptapUtils';
import FileHandler from '@tiptap/extension-file-handler';
import Placeholder from '@tiptap/extension-placeholder';
import {
  BackgroundColor,
  FontSize,
  LineHeight,
} from '@tiptap/extension-text-style';
import { Dropcursor, Focus, Gapcursor, UndoRedo } from '@tiptap/extensions';
import type { Extensions } from '@tiptap/react';
import { ImageUploadNode } from '../../../node/ImageUploadNode';

export const EDITOR_EXTENSIONS: Extensions = [
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
              type: 'imageFigure',
              content: [
                { type: 'caption' },
                {
                  type: 'image',
                  attrs: {
                    src: fileReader.result,
                  },
                },
              ],
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
              type: 'imageFigure',
              content: [
                { type: 'caption' },
                {
                  type: 'image',
                  attrs: {
                    src: fileReader.result,
                  },
                },
              ],
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
    includeChildren: true,
    placeholder: ({ editor }) => {
      const currentNode = detectNodeTypeFromEditor(editor);
      switch (currentNode) {
        case 'codeBlock':
          return 'コードブロックの内容を入力してください。';
        case 'blockquote':
          return '引用要素の本文を入力してください。';
        case 'list':
          return 'リストアイテムの内容を入力してください。';
        case 'heading':
          return '見出しを入力してください。';
        case 'paragraph':
          return '本文を入力してください。';
        default:
          return 'ノードブロックを選択してください';
      }
    },
  }),
  ImageUploadNode.configure({
    accept: 'image/*',
    maxSize: MAX_FILE_SIZE,
    limit: 3,
    upload: async (file) => {
      const imageInfo = await handleImageUpload(file);
      return imageInfo.blobUrl;
    },
    onError: (error) => console.error('Upload failed:', error),
  }),
  UndoRedo,
];
