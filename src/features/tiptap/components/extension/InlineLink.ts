import { ImageMetadata } from '@magiarium/structure';
import Link from '@tiptap/extension-link';
import { mergeAttributes, ReactMarkViewRenderer } from '@tiptap/react';
import { InlineLinkMark } from '../node/InlineLinkMark';

export interface InlineLinkAttributes {
  href: string;
  icon?: ImageMetadata | null;
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
  name: 'inlineLink',

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
            .updateAttributes('inlineLink', attributes)
            .setMeta('preventAutolink', true)
            .run();
        },
      unsetInlineLink:
        () =>
        ({ chain }) => {
          return chain().unsetMark('inlineLink').run();
        },
    };
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'a',
      {
        ...mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
        class: 'tiptap-inline-link',
      },
      ['span', { class: 'inline-link__text' }, 0],
    ];
  },

  addMarkView() {
    return ReactMarkViewRenderer(InlineLinkMark);
  },
});
