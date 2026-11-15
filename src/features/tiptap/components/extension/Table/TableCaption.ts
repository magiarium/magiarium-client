import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { TableCaptionNode } from '../../node/TableNode/TableCaptionNode';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    tableCaption: {
      toggleTableCaptionSide: () => ReturnType;
    };
  }
}

/**
 * テーブルキャプション
 */
export const TableCaption = Node.create({
  name: 'tableCaption',

  content: 'inline*',

  defining: true,

  addAttributes() {
    return {
      tableCaptionSide: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-table-caption-side'),
        renderHTML: (attributes) =>
          attributes.tableCaptionSide
            ? { 'data-table-caption-side': attributes.tableCaptionSide }
            : {},
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'figcaption[data-table-caption]',
      },
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TableCaptionNode, {
      as: 'figcaption',
      attrs: ({ node }) => ({
        'data-table-caption': '',
        'data-placeholder': 'キャプションを入力...',
        class: 'tiptap-table-caption',
        style: `--table-caption-side: ${node.attrs.tableCaptionSide || 'bottom'}`,
      }),
    });
  },

  addCommands() {
    return {
      toggleTableCaptionSide:
        () =>
        ({ editor, commands }) => {
          const currentSide = editor.getAttributes(this.name).tableCaptionSide;

          const tableCaptionSide = currentSide === 'top' ? 'bottom' : 'top';
          return commands.updateAttributes(this.name, { tableCaptionSide });
        },
    };
  },
});
