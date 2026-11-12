import { Node } from '@tiptap/core';
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
  thumbnailUrl?: string | null;
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
        default: '',

        parseHTML: (element) => element.getAttribute('data-href') ?? '',

        renderHTML: (attributes) => ({
          'data-href': attributes.href,
        }),
      },

      thumbnailUrl: {
        default: '',

        parseHTML: (element) => element.getAttribute('data-thumbnail') ?? '',

        renderHTML: (attributes) =>
          attributes.thumbnailUrl
            ? { 'data-thumbnail': attributes.thumbnailUrl }
            : {},
      },

      title: {
        default: '',

        parseHTML: (element) => element.getAttribute('data-title') ?? '',

        renderHTML: (attributes) => ({
          'data-title': attributes.title,
        }),
      },

      description: {
        default: '',

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
