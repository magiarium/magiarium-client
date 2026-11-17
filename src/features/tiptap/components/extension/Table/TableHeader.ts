import { TableHeader } from '@tiptap/extension-table';
import { mergeAttributes, ReactNodeViewRenderer } from '@tiptap/react';
import { TableHeaderNode } from '../../node/TableNode/TableHeaderNode';

/**
 * カスタムテーブルヘッダー
 */
export const CustomTableHeader = TableHeader.extend({
  addNodeView() {
    const options = this.options.HTMLAttributes;
    return ReactNodeViewRenderer(TableHeaderNode, {
      as: 'th',
      attrs: ({ HTMLAttributes }) => mergeAttributes(options, HTMLAttributes),
      stopEvent: () => false, // イベントを止めると既存のリサイズ処理が使えないのでfalse
    });
  },
});
