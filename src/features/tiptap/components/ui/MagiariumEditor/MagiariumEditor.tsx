import { Button } from '@/common/components/Button';
import { saveItemData } from '@/features/api/libs/saveItemData';
import { useNotice } from '@/features/app-controller/hooks/useNotice';
import { usePermission } from '@/features/auth/hooks/usePermission';
import { MagiariumEditor as MagiariumEditorExtensions } from '@/features/tiptap/components/extension/MagiariumEditor';
import { ItemData } from '@magiarium/structure';
import DragHandle from '@tiptap/extension-drag-handle-react';
import { EditorContent, Extensions, useEditor } from '@tiptap/react';
import { useState } from 'react';
import { BsGripVertical } from 'react-icons/bs';
import { MagiariumEditorContextMenu } from '../MagiariumEditorContextMenu/MagiariumEditorContextMenu';
import './MagiariumEditor.scss';

export const MagiariumEditor = ({
  itemData,
  immediatelyRender = true,
  customExtensions = [],
}: {
  itemData: ItemData;
  immediatelyRender?: boolean;
  customExtensions?: Extensions;
}) => {
  const { can } = usePermission();
  const [viewItemData, setViewItemData] = useState<ItemData>(itemData);
  const { setNotice } = useNotice();
  const editor = useEditor({
    immediatelyRender: immediatelyRender,
    extensions: [...MagiariumEditorExtensions, ...customExtensions],
    content: viewItemData.content,
    editable: can('EDIT'),
    editorProps: {
      attributes: {
        class: 'magiarium-editor__cotent',
      },
    },
  });

  if (!can('EDIT')) {
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
      {can('EDIT') && (
        <aside className="blog-content__edit-aside">
          {can('SAVE:DRAFT') && (
            <Button
              onClick={async () => {
                const saveItemDataResult = await saveItemData({
                  editItemData: {
                    ...viewItemData,
                    content: editor.getJSON(),
                  },
                });
                if (!saveItemDataResult.success) {
                  alert('保存処理に失敗しました。');
                } else {
                  alert('保存処理に成功しました。');
                  setViewItemData(saveItemDataResult.results);
                }
              }}
            >
              下書き保存
            </Button>
          )}
          {itemData.itemState === 'draft' && can('SAVE:PUBLIC') && (
            <Button
              onClick={async () => {
                const saveItemDataResult = await saveItemData({
                  editItemData: {
                    ...viewItemData,
                    content: editor.getJSON(),
                  },
                });
                if (!saveItemDataResult.success) {
                  alert('保存処理に失敗しました。');
                } else {
                  // ここで公開処理(プレビューモードを作った方が安全なので要検討)
                  setViewItemData(saveItemDataResult.results);
                }
              }}
              priority={'SECONDARY'}
            >
              下書き公開
            </Button>
          )}
        </aside>
      )}
    </>
  );
};
