import { MagiariumEditor as MagiariumEditorExtensions } from '@/features/tiptap/components/extension/MagiariumEditor';
import DragHandle from '@tiptap/extension-drag-handle-react';
import { Content, EditorContent, Extensions, useEditor } from '@tiptap/react';
import { BsGripVertical } from 'react-icons/bs';
import { MagiariumEditorContextMenu } from '../MagiariumEditorContextMenu/MagiariumEditorContextMenu';
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
    editorProps: {
      attributes: {
        class: 'magiarium-editor__cotent',
      },
    },
  });
  if (!isEditable) {
    return <EditorContent editor={editor} className="magiarium-editor" />;
  }
  return (
    <>
      <DragHandle
        editor={editor}
        computePositionConfig={{
          placement: 'left',
        }}
      >
        <div className="magiarium-editor__drag-handle">
          <BsGripVertical className="tiptap-button" data-style="ghost" />
        </div>
      </DragHandle>
      <MagiariumEditorContextMenu editor={editor}>
        <EditorContent editor={editor} className="magiarium-content" />
      </MagiariumEditorContextMenu>
    </>
  );
};
