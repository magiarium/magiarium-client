import Bold from '@tiptap/extension-bold';
import Code from '@tiptap/extension-code';
import Highlight from '@tiptap/extension-highlight';
import Italic from '@tiptap/extension-italic';
import RubyText from '@tiptap/extension-ruby-text';
import Strike from '@tiptap/extension-strike';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import type { Extensions } from '@tiptap/react';
import { InlineLink } from './custom/InlineLink';

export const MARKS_EXTENSIONS: Extensions = [
  Bold,
  Code,
  Highlight,
  Italic,
  InlineLink,
  RubyText,
  Strike,
  Underline,
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
];
