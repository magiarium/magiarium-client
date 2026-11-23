import { findParentNode, mergeAttributes, Node } from '@tiptap/core';
import { createTable } from '@tiptap/extension-table';
import { TextSelection } from '@tiptap/pm/state';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { TableFigureNode } from '../../node/TableNode/TableFigureNode';

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

  addNodeView() {
    const options = this.options.HTMLAttributes;
    return ReactNodeViewRenderer(TableFigureNode, {
      as: 'figure',
      attrs: ({ HTMLAttributes }) => ({
        ...mergeAttributes(options, HTMLAttributes),
      }),
    });
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

  addKeyboardShortcuts() {
    return {
      Backspace: () => {
        const { selection } = this.editor.state;
        const { $from } = selection;

        // テキスト選択中は通常の削除処理に任せる
        if (!selection.empty) {
          return false;
        }

        // caption の先頭以外では通常動作
        if ($from.parentOffset !== 0) {
          return false;
        }

        // caption の親が tableFigure か確認
        const captionDepth = $from.depth;
        const figureDepth = captionDepth - 1;

        if (figureDepth < 1) {
          return false;
        }

        const figureNode = $from.node(figureDepth);

        if (figureNode.type !== this.editor.schema.nodes.tableFigure) {
          return false;
        }

        const pos = $from.before(figureDepth);

        this.editor
          .chain()
          .deleteRange({
            from: pos,
            to: pos + figureNode.nodeSize,
          })
          .run();

        return true;
      },
    };
  },
});
