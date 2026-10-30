import { Node, mergeAttributes } from '@tiptap/core';

export type NodeLinkTarget = '_self' | '_blank' | '_parent' | '_top';

// コマンドの型定義
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    linkCard: {
      setLinkCard: (attributes: LinkCardAttributes) => ReturnType;
      unsetLinkCard: () => ReturnType;
    };
  }
}

export interface LinkCardOptions {
  HTMLAttributes: Record<string, unknown>;
}

export interface LinkCardAttributes {
  thumbnailUrl: string | null;
  title: string;
  linkUrl: string;
  target: NodeLinkTarget;
}

export const LinkCard = Node.create<LinkCardOptions>({
  name: 'linkCard',

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
          'data-type': 'link-card',
          class: 'link-card',
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
                class: 'link-card__thumbnail',
                src: thumbnail,
                alt: '',
                loading: 'lazy',
              },
            ],
          ]
        : []),
      ['span', { class: 'link-card__title' }, title],
    ];
  },

  addCommands() {
    return {
      setLinkCard:
        (attributes) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: attributes,
          });
        },
      unsetLinkCard:
        () =>
        ({ commands }) => {
          return commands.deleteNode(this.name);
        },
    };
  },
});
