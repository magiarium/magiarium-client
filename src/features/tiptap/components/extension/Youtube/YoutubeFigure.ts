import { mergeAttributes, Node, nodePasteRule } from '@tiptap/core';
import { isValidYoutubeUrl } from '@tiptap/extension-youtube';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { YoutubeFigureNode } from '../../node/YoutubeFigureNode';
import {
  SetYoutubeVideoOptions,
  YOUTUBE_DEFAULT_SIZE,
} from '../../ui/YoutubePopover';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    youtubeFigure: {
      setYoutubeFigure: (options: SetYoutubeVideoOptions) => ReturnType;
      unsetYoutubeFigure: () => ReturnType;
      updateYoutubeFigure: (options: SetYoutubeVideoOptions) => ReturnType;
    };
  }
}

const YOUTUBE_REGEX_GLOBAL =
  /^((?:https?:)?\/\/)?((?:www|m|music)\.)?((?:youtube\.com|youtu\.be|youtube-nocookie\.com))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/g;

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

  addNodeView() {
    const options = this.options.HTMLAttributes;
    return ReactNodeViewRenderer(YoutubeFigureNode, {
      as: 'figure',
      attrs: ({ HTMLAttributes }) => ({
        ...mergeAttributes(options, HTMLAttributes),
      }),
    });
  },

  /**
   * URLペースト時にyoutubeではなくyoutubeFigure側で設定するようにする処理
   */
  addPasteRules() {
    return [
      nodePasteRule({
        find: YOUTUBE_REGEX_GLOBAL,
        type: this.type,
        getAttributes: (match) => {
          return { src: match.input };
        },
        getContent: (attrs) => [
          {
            type: 'youtube',
            attrs: {
              width: YOUTUBE_DEFAULT_SIZE.width,
              height: YOUTUBE_DEFAULT_SIZE.height,
              ...attrs,
            },
          },
        ],
      }),
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
        ({ commands }) => {
          return commands.deleteNode(this.name);
        },
    };
  },
});
