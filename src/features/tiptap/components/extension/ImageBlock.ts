import { findParentNode, mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { ImageBlockNode } from '../node/ImageBlockNode/ImageBlockNode';

// コマンドの型定義
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageBlock: {
      deleteImageBlock: () => ReturnType;
    };
  }
}

export const ImageBlock = Node.create({
  name: 'imageBlock',

  group: 'block',

  content: 'image caption',

  defining: true,

  isolating: true,
  parseHTML() {
    return [
      {
        tag: 'figure[data-image-block]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'figure',
      {
        ...HTMLAttributes,
        'data-image-block': '',
        class: 'tiptap-image-block',
      },
    ];
  },

  addNodeView() {
    const options = this.options.HTMLAttributes;
    return ReactNodeViewRenderer(ImageBlockNode, {
      as: 'figure',
      attrs: ({ HTMLAttributes }) => ({
        ...mergeAttributes(options, HTMLAttributes),
        'data-image-block': '',
        class: 'tiptap-image-block',
      }),
    });
  },

  addCommands() {
    return {
      deleteImageBlock:
        () =>
        ({ tr, dispatch, editor }) => {
          const { selection } = tr;

          const imageBlock = findParentNode(
            (node) => node.type === editor.schema.nodes.imageBlock
          )(selection);

          if (!imageBlock) {
            return false;
          }

          if (dispatch) {
            const { pos, node } = imageBlock;

            tr.delete(pos, pos + node.nodeSize).scrollIntoView();
          }

          return true;
        },
    };
  },
});
