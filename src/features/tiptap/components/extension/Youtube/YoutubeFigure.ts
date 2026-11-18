import { findParentNode, mergeAttributes, Node } from '@tiptap/core';
import { isValidYoutubeUrl } from '@tiptap/extension-youtube';
import { SetYoutubeVideoOptions } from '../../ui/YoutubePopover';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    youtubeFigure: {
      setYoutubeFigure: (options: SetYoutubeVideoOptions) => ReturnType;
      unsetYoutubeFigure: () => ReturnType;
    };
  }
}

/**
 * Youtubeノード用のWrapper(画面中央に配置するため)
 */
export const YoutubeFigure = Node.create({
  name: 'youtubeFigure',

  group: 'block',

  content: 'youtube', // キャプションは一旦なし

  defining: true,

  isolating: true,

  addAttributes() {
    return {
      'data-youtube-figure': {
        default: '',
      },
      class: {
        default: 'tiptap-youtube-figure',
      },
    };
  },

  parseHTML() {
    return [{ tag: 'figure[data-youtube-figure]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'figure',
      {
        ...mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      },
      0,
    ];
  },

  addCommands() {
    return {
      setYoutubeFigure:
        (options: SetYoutubeVideoOptions) =>
        ({ commands }) => {
          if (!isValidYoutubeUrl(options.src)) {
            return false;
          }

          return commands.insertContent({
            type: this.name,
            content: [{ type: 'youtube', attrs: options }],
          });
        },
      unsetYoutubeFigure:
        () =>
        ({ tr, dispatch, editor }) => {
          const { selection } = tr;

          const youtubeBlock = findParentNode(
            (node) => node.type === editor.schema.nodes.youtubeBlock
          )(selection);

          if (!youtubeBlock) {
            return false;
          }

          if (dispatch) {
            const { pos, node } = youtubeBlock;

            tr.delete(pos, pos + node.nodeSize).scrollIntoView();
          }

          return true;
        },
    };
  },
});
