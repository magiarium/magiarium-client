import { Mark, mergeAttributes } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    inlineQuote: {
      setInlineQuote: () => ReturnType;
      toggleInlineQuote: () => ReturnType;
      unsetInlineQuote: () => ReturnType;
    };
  }
}

export const InlineQuote = Mark.create({
  name: 'inlineQuote',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return [
      {
        tag: 'q',
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'q',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
  addCommands() {
    return {
      setInlineQuote:
        () =>
        ({ commands }) => {
          return commands.setMark(this.name);
        },
      toggleInlineQuote:
        () =>
        ({ commands }) => {
          return commands.toggleMark(this.name);
        },
      unsetInlineQuote:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },
  addKeyboardShortcuts() {
    return {
      'Mod-Shift-q': () => this.editor.commands.toggleInlineQuote(),
    };
  },
});
