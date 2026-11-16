import Blockquote from '@tiptap/extension-blockquote';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { DetailsContent, DetailsSummary } from '@tiptap/extension-details';
import HardBreak from '@tiptap/extension-hard-break';
import Heading from '@tiptap/extension-heading';
import Image from '@tiptap/extension-image';
import { BulletList, ListItem, OrderedList } from '@tiptap/extension-list';
import Paragraph from '@tiptap/extension-paragraph';
import { TableKit } from '@tiptap/extension-table';
import Youtube from '@tiptap/extension-youtube';
import { type Extensions } from '@tiptap/react';
import css from 'highlight.js/lib/languages/css';
import js from 'highlight.js/lib/languages/javascript';
import ts from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';
import { all, createLowlight } from 'lowlight';
import { Caption } from '../../Caption';
import { CharacterSpeech } from '../../CharacterSpeech';
import { ImageBlock } from '../../ImageBlock';
import { LinkCard } from '../../LinkCard';
import { CustomTable } from '../../Table/Table';
import { TableBlock } from '../../Table/TableBlock';
import { CustomTableCell } from '../../Table/TableCell';
import { CustomTableHeader } from '../../Table/TableHeader';
import { Tips } from '../../Tips';

// lowlight
const lowlight = createLowlight(all);
lowlight.register('html', html);
lowlight.register('css', css);
lowlight.register('js', js);
lowlight.register('ts', ts);

export const NODE_EXTENSIONS: Extensions = [
  Blockquote,
  CodeBlockLowlight.configure({
    lowlight,
  }),
  HardBreak,
  Heading.configure({ levels: [3, 4, 5] }), // `h1=サイトタイトル` & `h2=コンテンツタイトル` のため、h3以降のみ許可
  ImageBlock,
  Image,
  BulletList,
  ListItem,
  OrderedList,
  Paragraph,
  CustomTableCell,
  CustomTableHeader,
  CustomTable.configure({
    resizable: true,
  }),
  TableBlock,
  Caption,
  TableKit.configure({
    tableCell: false,
    tableHeader: false,
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
