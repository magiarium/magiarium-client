import { Editor, useEditorState } from '@tiptap/react';
import {
  detectNodeTypeFromNode,
  NodeType,
} from '../lib/detectNodeTypeFromNode';

/**
 * 現在のノード種別を取得する処理
 *
 * @param editor Tiptapエディターのインスタンス
 * @returns Node種別
 */
export const useCurrentNode = (editor: Editor | null): NodeType => {
  const currentNode = useEditorState({
    editor,
    selector: ({ editor }) => {
      if (!editor) return { type: 'undefined' as NodeType };

      const { $from } = editor.state.selection;

      return detectNodeTypeFromNode($from.parent, $from.pos, editor);
    },
  });

  return currentNode?.type ?? 'undefined';
};
