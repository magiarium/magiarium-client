import { TableCell } from '@tiptap/extension-table';
import { mergeAttributes, ReactNodeViewRenderer } from '@tiptap/react';
import { TableCellNode } from '../../node/TableNode/TableCellNode';

/**
 * カスタムテーブルセル
 */
export const CustomTableCell = TableCell.extend({
  addNodeView() {
    const options = this.options.HTMLAttributes;
    return ReactNodeViewRenderer(TableCellNode, {
      as: 'td',
      attrs: ({ HTMLAttributes }) => mergeAttributes(options, HTMLAttributes),
      stopEvent: () => false, // イベントを止めると既存のリサイズ処理が使えないのでfalse
    });
  },
});
