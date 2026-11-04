import { Editor, useEditorState } from '@tiptap/react';
import { detectEditorType } from '../lib/detectEditorType';

export const useCurrentNode = (editor: Editor) => {
  const currentNode = useEditorState({
    editor,
    selector: ({ editor }) => detectEditorType(editor),
  });

  return currentNode;
};
