import Youtube from '@tiptap/extension-youtube';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { YoutubeNode } from '../../node/YoutubeNode/YoutubeNode';

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

  addNodeView() {
    return ReactNodeViewRenderer((props) => (
      <YoutubeNode {...props} options={this.options} />
    ));
  },
});
