import Youtube from '@tiptap/extension-youtube';

type SetYoutubeVideoOptions = {
  src: string;
  width?: number | string;
  height?: number | string;
  start?: number;
};

/**
 * Youtubeのカスタムノード（追加時にWrapperを使用するように修正）
 */
export const CustomYoutube = Youtube.extend({
  addCommands() {
    return {
      setYoutubeVideo:
        (options: SetYoutubeVideoOptions) =>
        ({ commands }) => {
          return commands.setYoutubeFigure(options);
        },
    };
  },
});
