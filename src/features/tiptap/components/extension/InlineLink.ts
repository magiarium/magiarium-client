import Link from '@tiptap/extension-link';
import { ReactMarkViewRenderer } from '@tiptap/react';
import { InlineLinkMark } from '../node/InlineLinkMark';

export interface InlineLinkAttributes {
  href: string;
  icon?: string | null;
  target?: string | null;
  rel?: string | null;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    inlineLink: {
      setInlineLink: (attributes: InlineLinkAttributes) => ReturnType;
      unsetInlineLink: () => ReturnType;
    };
  }
}

export const InlineLink = Link.extend({
  addAttributes() {
    return {
      ...this.parent?.(),

      icon: {
        default: null,

        parseHTML: (element) => element.getAttribute('data-icon'),

        renderHTML: (attributes) =>
          attributes.icon
            ? {
                'data-icon': attributes.icon,
                style: `--inline-link-icon: url("${attributes.icon}")`,
              }
            : {},
      },
    };
  },

  addCommands() {
    return {
      setInlineLink:
        (attributes) =>
        ({ chain }) => {
          return chain()
            .setLink(attributes)
            .setMeta('preventAutolink', true)
            .run();
        },
      unsetInlineLink:
        () =>
        ({ chain }) => {
          return chain().unsetLink().run();
        },
    };
  },

  addMarkView() {
    return ReactMarkViewRenderer(InlineLinkMark);
  },
});
