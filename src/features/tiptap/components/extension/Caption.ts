import { Node } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    caption: {
      toggleCaptionSide: () => ReturnType;
    };
  }
}

/**
 * テーブルキャプション
 */
export const Caption = Node.create({
  name: 'caption',

  content: 'inline*',

  defining: true,

  addAttributes() {
    return {
      captionSide: {
        default: 'bottom',
        parseHTML: (element) => element.getAttribute('data-caption-side'),
        renderHTML: (attributes) =>
          attributes.captionSide
            ? { 'data-caption-side': attributes.captionSide }
            : {},
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'figcaption[data-caption]',
      },
    ];
  },

  renderHTML({ node }) {
    return [
      'figcaption',
      {
        'data-caption': '',
        class: 'tiptap-caption',
        style: `--caption-order: ${node.attrs.captionSide === 'top' ? -1 : 1}`,
      },
      0,
    ];
  },

  addCommands() {
    return {
      toggleCaptionSide:
        () =>
        ({ editor, commands }) => {
          const currentSide = editor.getAttributes(this.name).captionSide;

          const captionSide = currentSide === 'top' ? 'bottom' : 'top';
          return commands.updateAttributes(this.name, { captionSide });
        },
    };
  },
});
