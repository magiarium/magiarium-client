import { MagiariumEditor as MagiariumEditorExtensions } from '@/features/tiptap/components/extension/MagiariumEditor';
import DragHandle from '@tiptap/extension-drag-handle-react';
import { Content, EditorContent, Extensions, useEditor } from '@tiptap/react';
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus';
import { BsGripVertical } from 'react-icons/bs';
import { DeleteBlockButton } from '../BlockButton/DeleteBlockButton';
import { InsertBlockButton } from '../BlockButton/InsertBlockButton';
import { MarkToolbar } from '../MarkToolbar';
import {
  NodeDropdownMenuCustom,
  NodeDropdownMenuStandard,
} from '../NodeDropdownMenu';
import './MagiariumEditor.scss';

export const MagiariumEditor = ({
  content,
  immediatelyRender = true,
  customExtensions = [],
  isEditable = false,
}: {
  content: Content;
  immediatelyRender?: boolean;
  customExtensions?: Extensions;
  isEditable?: boolean;
}) => {
  const editor = useEditor({
    immediatelyRender: immediatelyRender,
    extensions: [...MagiariumEditorExtensions, ...customExtensions],
    content: content,
    editable: isEditable,
  });
  return (
    <>
      {isEditable && (
        <>
          <DragHandle
            className="magiarium-editor__drag-handle"
            editor={editor}
            nested={{
              edgeDetection: { threshold: -20, edges: ['left'] },
            }}
            computePositionConfig={{ placement: 'left-start' }}
          >
            <BsGripVertical />
          </DragHandle>
          <BubbleMenu editor={editor} className="magiarium-editor__bubble-menu">
            <NodeDropdownMenuStandard editor={editor} />
            <MarkToolbar editor={editor} />
          </BubbleMenu>
          <FloatingMenu
            pluginKey={'floatingMenu'}
            editor={editor}
            className="magiarium-editor__floating-menu"
            options={{ placement: 'bottom-start' }}
            shouldShow={() => {
              return true;
            }}
          >
            <DeleteBlockButton editor={editor} />
            <InsertBlockButton editor={editor} />
            <NodeDropdownMenuStandard editor={editor} />
            <NodeDropdownMenuCustom editor={editor} />
            <MarkToolbar editor={editor} />
          </FloatingMenu>
        </>
      )}
      <EditorContent
        editor={editor}
        className="magiarium-editor__editor-content"
      />
    </>
  );
};
