import { mergeAttributes } from '@tiptap/core';
import Link from '@tiptap/extension-link';

export const InlineLink = Link.extend({
  addAttributes() {
    return {
      ...this.parent?.(),

      icon: {
        default: null,

        parseHTML: (element) => element.getAttribute('data-icon'),

        renderHTML: (attributes) =>
          attributes.icon ? { 'data-icon': attributes.icon } : {},
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    const { icon, ...attributes } = HTMLAttributes;

    return [
      'a',
      mergeAttributes(attributes, {
        class: 'inline-link',
      }),
      ...(icon
        ? [
            [
              'span',
              {
                class: 'inline-link__icon',
                'aria-hidden': 'true',
              },
              icon,
            ],
          ]
        : []),
      ['span', { class: 'inline-link__text' }, 0],
    ];
  },
});
