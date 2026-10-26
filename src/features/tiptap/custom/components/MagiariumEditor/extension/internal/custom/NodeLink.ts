import { Node, mergeAttributes } from '@tiptap/core';

export type NodeLinkTarget = '_self' | '_blank' | '_parent' | '_top';

export interface NodeLinkOptions {
  HTMLAttributes: Record<string, unknown>;
}

export interface NodeLinkAttributes {
  thumbnail: string | null;
  title: string;
  url: string;
  target: NodeLinkTarget;
}

export const NodeLink = Node.create<NodeLinkOptions>({
  name: 'nodeLink',

  group: 'block',

  atom: true,

  draggable: true,

  selectable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      thumbnail: {
        default: null,

        parseHTML: (element) => element.getAttribute('data-thumbnail'),

        renderHTML: (attributes) =>
          attributes.thumbnail
            ? { 'data-thumbnail': attributes.thumbnail }
            : {},
      },

      title: {
        default: '',

        parseHTML: (element) => element.getAttribute('data-title') ?? '',

        renderHTML: (attributes) => ({
          'data-title': attributes.title,
        }),
      },

      url: {
        default: '',

        parseHTML: (element) => element.getAttribute('data-url') ?? '',

        renderHTML: (attributes) => ({
          'data-url': attributes.url,
        }),
      },

      target: {
        default: '_blank',

        parseHTML: (element) => {
          const target = element.getAttribute('target');

          return target === '_self' || target === '_parent' || target === '_top'
            ? target
            : '_blank';
        },

        renderHTML: (attributes) => ({
          target: attributes.target,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'a[data-type="node-link"]',
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const { thumbnail, title, url, target } = node.attrs;

    return [
      'a',
      mergeAttributes(
        this.options.HTMLAttributes,
        HTMLAttributes,
        {
          'data-type': 'node-link',
          class: 'node-link',
          href: url,
          target,
          rel: target === '_blank' ? 'noopener noreferrer' : null,
          'aria-label': title,
        },
        thumbnail ? { 'data-thumbnail': thumbnail } : {},
        { 'data-title': title, 'data-url': url }
      ),
      ...(thumbnail
        ? [
            [
              'img',
              {
                class: 'node-link__thumbnail',
                src: thumbnail,
                alt: '',
                loading: 'lazy',
              },
            ],
          ]
        : []),
      ['span', { class: 'node-link__title' }, title],
    ];
  },
});
