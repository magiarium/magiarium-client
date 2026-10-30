import { Button } from '@/features/tiptap/components/ui-primitive/Button';
import { Editor, useEditorState } from '@tiptap/react';
import { ReactNode } from 'react';
import { FaMinus } from 'react-icons/fa6';

export const DeleteBlockButton = ({
  editor,
  children,
}: {
  editor: Editor;
  children?: ReactNode;
}) => {
  const nodeCount = useEditorState({
    editor,
    selector: ({ editor }) => editor.state.doc.childCount,
  });
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => {
        editor.commands.deleteCurrentNode();
      }}
      disabled={nodeCount <= 1}
      data-disabled={nodeCount <= 1}
      aria-label="ブロック削除"
      tooltip="ブロック削除"
    >
      {children ? children : <FaMinus />}
    </Button>
  );
};
