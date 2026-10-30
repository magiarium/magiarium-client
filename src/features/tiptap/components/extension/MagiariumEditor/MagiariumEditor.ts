import Document from '@tiptap/extension-document';
import Text from '@tiptap/extension-text';
import { EDITOR_EXTENSIONS } from './internal/editor';
import { MARKS_EXTENSIONS } from './internal/marks';
import { NODE_EXTENSIONS } from './internal/node';

export const MagiariumEditor = [
  Document,
  Text,
  ...NODE_EXTENSIONS,
  ...MARKS_EXTENSIONS,
  ...EDITOR_EXTENSIONS,
];
