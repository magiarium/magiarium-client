import { Button } from '@/features/tiptap/components/ui-primitive/Button';
import { Editor } from '@tiptap/react';
import { ReactNode } from 'react';
import { FaPlus } from 'react-icons/fa6';

export const InsertBlockButton = ({
  editor,
  children,
}: {
  editor: Editor;
  children?: ReactNode;
}) => {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => {
        editor.commands.insertDefaultBlock({ pos: 0 });
        editor.commands.setMeta('floatingMenu', 'show');
      }}
      aria-label="ブロック追加"
      tooltip="ブロック追加"
    >
      {children ? children : <FaPlus />}
    </Button>
  );
};
