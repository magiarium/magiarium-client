import { Button } from '@/features/tiptap/basic/components/ui-primitive/button';
import DragHandle from '@tiptap/extension-drag-handle-react';
import { Content, EditorContent, Extensions, useEditor } from '@tiptap/react';
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus';
import { BsGripVertical } from 'react-icons/bs';
import { FaMinus, FaPlus } from 'react-icons/fa6';
import { MarkSelector } from '../MarkSelector';
import { NodeSelectorCustom } from '../NodeSelector.Custom';
import { NodeSelectorStandard } from '../NodeSelector.Standard';
import { MAGIARIUM_EDITOR_EXTENSIONS } from './extension';
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
    extensions: [...MAGIARIUM_EDITOR_EXTENSIONS, ...customExtensions],
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
            <NodeSelectorStandard editor={editor} />
            <MarkSelector editor={editor} />
          </BubbleMenu>
          <FloatingMenu
            editor={editor}
            className="magiarium-editor__floating-menu"
            options={{ placement: 'bottom-start' }}
          >
            <Button
              onClick={() => {
                editor.commands.deleteCurrentNode();
              }}
            >
              <FaMinus />
            </Button>
            <Button
              onClick={() => {
                editor.commands.insertDefaultBlock({ pos: 0 });
              }}
            >
              <FaPlus />
            </Button>
            <NodeSelectorStandard editor={editor} />
            <NodeSelectorCustom editor={editor} />
            <MarkSelector editor={editor} />
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
