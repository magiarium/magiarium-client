import Blockquote from '@tiptap/extension-blockquote';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import HardBreak from '@tiptap/extension-hard-break';
import Heading from '@tiptap/extension-heading';
import Image from '@tiptap/extension-image';
import { BulletList, ListItem, OrderedList } from '@tiptap/extension-list';
import Paragraph from '@tiptap/extension-paragraph';
import { Table, TableKit } from '@tiptap/extension-table';
import Youtube from '@tiptap/extension-youtube';
import type { Extensions } from '@tiptap/react';

// lowlight
import {
  handleImageUpload,
  MAX_FILE_SIZE,
} from '@/features/tiptap/lib/tiptapUtils';
import { DetailsContent, DetailsSummary } from '@tiptap/extension-details';
import { all, createLowlight } from 'lowlight';
import { ImageUploadNode } from '../../../node/ImageUploadNode';
import { CharacterSpeech } from '../../CharacterSpeech';
import { LinkCard } from '../../LinkCard';
import { Tips } from '../../Tips';

const lowlight = createLowlight(all);

const CustomTable = Table.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      noBorder: {
        default: false,
        parseHTML: (element) => element.hasAttribute('data-no-border'),
        renderHTML: (attributes) =>
          attributes.noBorder ? { 'data-no-border': 'true' } : {},
      },
    };
  },
});

export const NODE_EXTENSIONS: Extensions = [
  Blockquote,
  CodeBlockLowlight.configure({
    lowlight,
  }),
  HardBreak,
  Heading.configure({ levels: [3, 4, 5] }), // `h1=サイトタイトル` & `h2=コンテンツタイトル` のため、h3以降のみ許可
  Image,
  ImageUploadNode.configure({
    accept: 'image/*',
    maxSize: MAX_FILE_SIZE,
    limit: 3,
    upload: handleImageUpload,
    onError: (error) => console.error('Upload failed:', error),
  }),
  BulletList,
  ListItem,
  OrderedList,
  Paragraph,
  CustomTable.configure({ resizable: true }),
  TableKit.configure({
    table: false,
  }),
  Youtube.configure({
    controls: false,
    nocookie: true,
  }),
  CharacterSpeech,
  DetailsSummary,
  DetailsContent,
  Tips,
  LinkCard,
];
