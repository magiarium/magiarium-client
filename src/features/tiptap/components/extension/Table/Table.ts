import { Table } from '@tiptap/extension-table';

/**
 * カスタムテーブル
 */
export const CustomTable = Table.extend({
  addCommands() {
    return {
      ...this.parent?.(),
      // キャプションを利用できるように、既存処理をオーバーライド
      insertTable:
        (options) =>
        ({ commands }) => {
          return commands.insertTableFigure(options);
        },
      // ラッパーごと削除できるように、既存処理をオーバーライド
      deleteTable:
        () =>
        ({ commands }) => {
          return commands.deleteTableFigure();
        },
    };
  },
});
