import { findParentNode, mergeAttributes, Node } from '@tiptap/core';

// コマンドの型定義
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageFigure: {
      deleteImageFigure: () => ReturnType;
    };
  }
}

export const ImageFigure = Node.create({
  name: 'imageFigure',

  group: 'block',

  content: 'image caption',

  defining: true,

  isolating: true,
  parseHTML() {
    return [
      {
        tag: 'figure[data-image-figure]',
      },
    ];
  },

  addAttributes() {
    return {
      'data-image-figure': {
        default: '',
      },
      class: {
        default: 'tiptap-image-figure',
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'figure',
      { ...mergeAttributes(this.options.HTMLAttributes, HTMLAttributes) },
      0,
    ];
  },

  addCommands() {
    return {
      deleteImageFigure:
        () =>
        ({ tr, dispatch, editor }) => {
          const { selection } = tr;

          const imageFigure = findParentNode(
            (node) => node.type === editor.schema.nodes.imageFigure
          )(selection);

          if (!imageFigure) {
            return false;
          }

          if (dispatch) {
            const { pos, node } = imageFigure;

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

        // caption の親が imageFigure か確認
        const captionDepth = $from.depth;
        const figureDepth = captionDepth - 1;

        if (figureDepth < 1) {
          return false;
        }

        const figureNode = $from.node(figureDepth);

        if (figureNode.type !== this.editor.schema.nodes.imageFigure) {
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
