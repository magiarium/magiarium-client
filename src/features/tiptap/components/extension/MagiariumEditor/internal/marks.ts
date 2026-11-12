import Bold from '@tiptap/extension-bold';
import Code from '@tiptap/extension-code';
import Highlight from '@tiptap/extension-highlight';
import Italic from '@tiptap/extension-italic';
import Link from '@tiptap/extension-link';
import RubyText from '@tiptap/extension-ruby-text';
import Strike from '@tiptap/extension-strike';
import TextAlign from '@tiptap/extension-text-align';
import { Color, TextStyle } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import type { Extensions } from '@tiptap/react';
import { InlineLink } from '../../InlineLink';
import { InlineQuote } from '../../InlineQuote';
import { Kbd } from '../../Kbd';

export const MARKS_EXTENSIONS: Extensions = [
  Bold,
  Code,
  Highlight.configure({
    multicolor: true,
  }),
  Italic,
  RubyText,
  Strike,
  Underline,
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  InlineQuote,
  TextStyle,
  Color,
  Kbd,
  Link,
  InlineLink,
];
