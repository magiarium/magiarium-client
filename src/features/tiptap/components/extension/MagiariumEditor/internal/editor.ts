import { detectNodeTypeFromNode } from '@/features/tiptap/lib/detectNodeTypeFromNode';
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
                {
                  type: 'image',
                  attrs: {
                    src: fileReader.result,
                  },
                },
                { type: 'caption' },
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
                {
                  type: 'image',
                  attrs: {
                    src: fileReader.result,
                  },
                },
                { type: 'caption' },
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
    showOnlyWhenEditable: true, // 編集可能な場合のみ表示
    showOnlyCurrent: false, // 空ノードすべてに表示
    includeChildren: true,
    placeholder: ({ node, pos, editor }) => {
      const currentNode = detectNodeTypeFromNode(node, pos, editor);
      return currentNode.placeholder;
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
