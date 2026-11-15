import { Node } from '@tiptap/core';

/**
 * テーブル+キャプション用のラッパーノード
 */
export const TableBlock = Node.create({
  name: 'tableBlock',

  group: 'block',

  content: 'tableCaption table',

  defining: true,

  isolating: true,

  parseHTML() {
    return [
      {
        tag: 'figure[data-table-block]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'figure',
      {
        ...HTMLAttributes,
        'data-table-block': '',
        class: 'tiptap-table-block',
      },
      0,
    ];
  },
});
