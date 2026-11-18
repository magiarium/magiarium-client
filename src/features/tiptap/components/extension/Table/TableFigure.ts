import { findParentNode, Node } from '@tiptap/core';
import { createTable } from '@tiptap/extension-table';
import { TextSelection } from '@tiptap/pm/state';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    tableFigure: {
      insertTableFigure: (options?: {
        rows?: number;
        cols?: number;
        withHeaderRow?: boolean;
      }) => ReturnType;
      deleteTableFigure: () => ReturnType;
    };
  }
}

/**
 * テーブル+キャプション用のラッパーノード
 */
export const TableFigure = Node.create({
  name: 'tableFigure',

  group: 'block',

  content: 'caption table',

  defining: true,

  isolating: true,

  parseHTML() {
    return [
      {
        tag: 'figure[data-table-figure]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'figure',
      {
        ...HTMLAttributes,
        'data-table-figure': '',
        class: 'tiptap-table-figure',
      },
      0,
    ];
  },
  addCommands() {
    return {
      ...this.parent?.(),
      insertTableFigure:
        ({ rows = 3, cols = 3, withHeaderRow = true } = {}) =>
        ({ tr, dispatch, editor }) => {
          // 既存のTable生成処理を利用
          const table = createTable(editor.schema, rows, cols, withHeaderRow);

          // tableFigure(テーブル+テーブルキャプションのラッパー)を生成
          const caption = editor.schema.nodes.caption.create();

          const tableFigure = editor.schema.nodes.tableFigure.create(null, [
            caption,
            table,
          ]);

          if (dispatch) {
            const offset = tr.selection.from + 1;

            tr.replaceSelectionWith(tableFigure)
              .scrollIntoView()
              .setSelection(TextSelection.near(tr.doc.resolve(offset)));
          }

          return true;
        },
      deleteTableFigure:
        () =>
        ({ tr, dispatch, editor }) => {
          const { selection } = tr;

          const tableFigure = findParentNode(
            (node) => node.type === editor.schema.nodes.tableFigure
          )(selection);

          if (!tableFigure) {
            return false;
          }

          if (dispatch) {
            const { pos, node } = tableFigure;

            tr.delete(pos, pos + node.nodeSize).scrollIntoView();
          }

          return true;
        },
    };
  },
});
