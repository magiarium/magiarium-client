import { Node, mergeAttributes } from '@tiptap/core';

export interface TipsOptions {
  HTMLAttributes: Record<string, unknown>;
}

export const Tips = Node.create<TipsOptions>({
  name: 'tips',

  group: 'block',

  atom: true,

  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      title: {
        default: '詳細',
        parseHTML: (element) =>
          element.querySelector('summary')?.textContent ?? '詳細',
        renderHTML: () => ({}),
      },

      content: {
        default: '',
        parseHTML: (element) => {
          const details = element.querySelector('details');
          const content = details?.querySelector('[data-tips-content]');

          return content?.innerHTML ?? '';
        },
        renderHTML: () => ({}),
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
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
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
