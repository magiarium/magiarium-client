import { mergeAttributes, Node } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    tips: {
      setTips: () => ReturnType;
      toggleTips: () => ReturnType;
      unsetTips: () => ReturnType;
    };
  }
}

export const Tips = Node.create({
  name: 'tips',

  content: 'block+',

  group: 'block',

  defining: true,

  parseHTML() {
    return [
      {
        tag: 'aside[data-tips]',
      },
    ];
  },

  addAttributes() {
    return {
      class: {
        default: 'tiptap-tips',
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'aside',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },

  addCommands() {
    return {
      setTips:
        () =>
        ({ commands }) => {
          return commands.wrapIn(this.name);
        },
      toggleTips:
        () =>
        ({ commands }) => {
          return commands.toggleWrap(this.name);
        },
      unsetTips:
        () =>
        ({ commands }) => {
          return commands.lift(this.name);
        },
    };
  },
});
