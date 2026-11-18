import { findParentNode, mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { ImageFigureNode } from '../node/ImageFigureNode/ImageFigureNode';

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
    ];
  },

  addNodeView() {
    const options = this.options.HTMLAttributes;
    return ReactNodeViewRenderer(ImageFigureNode, {
      as: 'figure',
      attrs: ({ HTMLAttributes }) => ({
        ...mergeAttributes(options, HTMLAttributes),
      }),
    });
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
});
