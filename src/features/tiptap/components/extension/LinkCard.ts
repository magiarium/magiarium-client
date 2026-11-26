import { ImageMetadata } from '@magiarium/structure';
import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { LinkCardNode } from '../node/LinkCardNode/LinkCardNode';

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
  href: string | null;
  thumbnail?: ImageMetadata | null;
  title?: string | null;
  description?: string | null;
  target?: string | null;
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
      href: {
        default: null,

        parseHTML: (element) => element.getAttribute('data-href') ?? '',

        renderHTML: (attributes) => ({
          'data-href': attributes.href,
        }),
      },

      thumbnail: {
        default: null,

        parseHTML: (element) => element.getAttribute('data-thumbnail') ?? '',

        renderHTML: (attributes) =>
          attributes.thumbnail
            ? { 'data-thumbnail': attributes.thumbnail }
            : {},
      },

      title: {
        default: null,

        parseHTML: (element) => element.getAttribute('data-title') ?? '',

        renderHTML: (attributes) => ({
          'data-title': attributes.title,
        }),
      },

      description: {
        default: null,

        parseHTML: (element) => element.getAttribute('data-description') ?? '',

        renderHTML: (attributes) => ({
          'data-description': attributes.description,
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
        tag: 'a[data-type="link-card"]',
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      {
        ...mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
        class: 'tiptap-link-card',
      },
      [
        'a',
        {
          href: HTMLAttributes.href,
          target: HTMLAttributes.target,
        },
        [
          'div',
          { class: 'tiptap-link-card__capture' },
          HTMLAttributes.thumbnail.src
            ? [
                'img',
                {
                  class: 'tiptap-link-card__image',
                  src: HTMLAttributes.thumbnail.src,
                  alt: 'リンクカード画像',
                  width: 1200,
                  height: 800,
                },
              ]
            : [
                'span',
                { class: 'tiptap-link-card__image' },
                '画像が設定されていません。',
              ],
          ['span', { class: 'tiptap-link-card__link' }, HTMLAttributes.href],
        ],
        ['span', { class: 'tiptap-link-card__title' }, HTMLAttributes.title],
        [
          'span',
          { class: 'tiptap-link-card__description' },
          HTMLAttributes.description,
        ],
      ],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(LinkCardNode);
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
