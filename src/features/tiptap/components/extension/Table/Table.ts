import { createTable, Table } from '@tiptap/extension-table';
import { TextSelection } from '@tiptap/pm/state';
import { findParentNode } from '@tiptap/react';

/**
 * カスタムテーブル
 */
export const CustomTable = Table.extend({
  addCommands() {
    return {
      ...this.parent?.(),
      // キャプションを利用できるように、既存処理をオーバーライド
      insertTable:
        ({ rows = 3, cols = 3, withHeaderRow = true } = {}) =>
        ({ tr, dispatch, editor }) => {
          // 既存のTable生成処理を利用
          const table = createTable(editor.schema, rows, cols, withHeaderRow);

          // tableBlock(テーブル+テーブルキャプションのラッパー)を生成
          const caption = editor.schema.nodes.tableCaption.create();

          const tableBlock = editor.schema.nodes.tableBlock.create(null, [
            caption,
            table,
          ]);

          if (dispatch) {
            const offset = tr.selection.from + 1;

            tr.replaceSelectionWith(tableBlock)
              .scrollIntoView()
              .setSelection(TextSelection.near(tr.doc.resolve(offset)));
          }

          return true;
        },
      // ラッパーごと削除できるように、既存処理をオーバーライド
      deleteTable:
        () =>
        ({ tr, dispatch, editor }) => {
          const { selection } = tr;

          const tableBlock = findParentNode(
            (node) => node.type === editor.schema.nodes.tableBlock
          )(selection);

          if (!tableBlock) {
            return false;
          }

          if (dispatch) {
            const { pos, node } = tableBlock;

            tr.delete(pos, pos + node.nodeSize).scrollIntoView();
          }

          return true;
        },
    };
  },
});
