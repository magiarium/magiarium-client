import { MagiariumEditor as MagiariumEditorExtensions } from '@/features/tiptap/components/extension/MagiariumEditor';
import { Separator } from '@/features/tiptap/components/ui-primitive/Separator';
import { MarkToolbar } from '@/features/tiptap/components/ui/MarkToolbar';
import {
  NodeDropdownMenuCustom,
  NodeDropdownMenuStandard,
} from '@/features/tiptap/components/ui/NodeDropdownMenu';
import { PopoverTrigger } from '@radix-ui/react-popover';
import DragHandle from '@tiptap/extension-drag-handle-react';
import { Content, EditorContent, Extensions, useEditor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import { BsGearFill, BsGripVertical } from 'react-icons/bs';
import { Button } from '../../ui-primitive/Button';
import { Popover, PopoverContent } from '../../ui-primitive/Popover';
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

  return (
    <>
      {isEditable && (
        <>
          <DragHandle
            editor={editor}
            computePositionConfig={{
              placement: 'left',
            }}
          >
            <div className="magiarium-editor__drag-handle">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost">
                    <BsGearFill className="tiptap-button-icon" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent side="bottom" align="start">
                  <div className="config-content">
                    <NodeDropdownMenuStandard editor={editor} />
                    <NodeDropdownMenuCustom editor={editor} />
                    <Separator />
                    <MarkToolbar editor={editor} />
                  </div>
                </PopoverContent>
              </Popover>
              <BsGripVertical className="tiptap-button" data-style="ghost" />
            </div>
          </DragHandle>
          <BubbleMenu
            editor={editor}
            className="magiarium-editor__bubble-menu"
            options={{ strategy: 'absolute', placement: 'top-start' }}
            shouldShow={(props) => {
              const { editor } = props;
              const { $from } = editor.state.selection;
              const node = $from.parent;
              // エディタにフォーカスがあり、対象ノードが空でない場合のみ表示
              return node.textContent.trim() !== '' && editor.isFocused;
            }}
            getReferencedVirtualElement={() => {
              // カーソル位置に関わらず、バブルメニューの表示位置を固定するための処理
              const { view, state } = editor;
              const { from } = state.selection;

              const $pos = state.doc.resolve(from);
              const lineStart = $pos.start();

              const coords = view.coordsAtPos(lineStart);

              return {
                getBoundingClientRect: () => ({
                  x: coords.left,
                  y: coords.top,
                  left: coords.left,
                  right: coords.left,
                  top: coords.top,
                  bottom: coords.top,
                  width: 0,
                  height: 0,
                }),
              };
            }}
          >
            <NodeDropdownMenuStandard editor={editor} />
            <Separator />
            <MarkToolbar editor={editor} />
          </BubbleMenu>
        </>
      )}
      <EditorContent editor={editor} className="magiarium-editor__content" />
    </>
  );
};
