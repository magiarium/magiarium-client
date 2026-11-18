import { Extension } from '@tiptap/core';
import { Plugin } from '@tiptap/pm/state';

/**
 * Youtubeノードを追加した際に改行出来なくなる問題の対応
 */
export const YoutubeParagraphGuard = Extension.create({
  name: 'youtubeParagraphGuard',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        appendTransaction: (transactions, _oldState, newState) => {
          // ドキュメント変更がない場合は何もしない
          if (!transactions.some((tr) => tr.docChanged)) {
            return null;
          }

          const { doc, schema } = newState;
          const tr = newState.tr;
          let changed = false;

          // YouTubeノードの位置を収集
          const youtubePositions: number[] = [];

          doc.descendants((node, pos) => {
            if (node.type.name === 'youtube') {
              youtubePositions.push(pos);
            }
          });

          // 後ろから挿入することで位置のずれを防ぐ
          youtubePositions.reverse().forEach((pos) => {
            const node = tr.doc.nodeAt(pos);

            if (!node) {
              return;
            }

            const nextNode = tr.doc.nodeAt(pos + node.nodeSize);

            if (!nextNode || nextNode.type.name !== 'paragraph') {
              tr.insert(pos + node.nodeSize, schema.nodes.paragraph.create());
              changed = true;
            }
          });

          return changed ? tr : null;
        },
      }),
    ];
  },
});
