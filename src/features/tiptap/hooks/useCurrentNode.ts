import { detectNodeTypeFromEditor } from '@/features/tiptap/lib/detectNodeTypeFromEditor';
import { Editor, useEditorState } from '@tiptap/react';

/** ノード種別 */
type NodeType =
  | 'undefined'
  | 'codeBlock'
  | 'blockquote'
  | 'heading'
  | 'list'
  | 'characterSpeech'
  | 'tips'
  | 'linkCard'
  | 'table'
  | 'image'
  | 'youtube'
  | 'paragraph'
  | null;

/**
 * 現在のノード種別を取得する処理
 *
 * @param editor Tiptapエディターのインスタンス
 * @returns Node種別
 */
export const useCurrentNode = (editor: Editor | null): NodeType => {
  const currentNode = useEditorState({
    editor,
    selector: ({ editor }) => detectNodeTypeFromEditor(editor),
  });

  return currentNode;
};
