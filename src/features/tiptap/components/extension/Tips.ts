import { mergeAttributes } from '@tiptap/core';
import { Details } from '@tiptap/extension-details';

export const Tips = Details.extend({
  name: 'tips',

  addAttributes() {
    return {
      ...this.parent?.(),

      title: {
        default: '詳細',
      },

      content: {
        default: '',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'aside[data-type="tips"]',
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'aside',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'tips',
        class: 'tips',
      }),
      [
        'details',
        {},
        ['summary', {}, node.attrs.title],
        ['div', { 'data-tips-content': '' }, node.attrs.content],
      ],
    ];
  },
});
