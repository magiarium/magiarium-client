import { Mark, mergeAttributes } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    kbd: {
      setKbd: () => ReturnType;
      toggleKbd: () => ReturnType;
      unsetKbd: () => ReturnType;
    };
  }
}

export const Kbd = Mark.create({
  name: 'kbd',

  parseHTML() {
    return [{ tag: 'kbd' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['kbd', mergeAttributes(HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setKbd:
        () =>
        ({ commands }) =>
          commands.setMark(this.name),

      toggleKbd:
        () =>
        ({ commands }) =>
          commands.toggleMark(this.name),

      unsetKbd:
        () =>
        ({ commands }) =>
          commands.unsetMark(this.name),
    };
  },
});
