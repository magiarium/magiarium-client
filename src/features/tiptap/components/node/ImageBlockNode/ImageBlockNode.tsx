import { ContextMenu } from '@/common/components/ContextMenu';
import { NodeViewContent, NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import { ReactNode } from 'react';
import { BsArrowRepeat, BsTrash } from 'react-icons/bs';
import { useImageUpload } from '../../ui/ImageUploadButton';
import './ImageBlockNode.scss';

export const ImageBlockNode = (props: NodeViewProps): ReactNode => {
  const { editor } = props;

  if (editor.isEditable) {
    return EditableImageBlockNode(props);
  }

  return (
    <NodeViewWrapper>
      <NodeViewContent />
    </NodeViewWrapper>
  );
};

export const EditableImageBlockNode = (props: NodeViewProps): ReactNode => {
  const { editor } = props;
  const { handleImage } = useImageUpload({
    editor,
  });
  return (
    <NodeViewWrapper>
      <ContextMenu
        contextItems={[
          {
            children: (
              <>
                <BsTrash />
                画像削除
              </>
            ),
            onSelect: () => {
              editor.chain().focus().deleteImageBlock().run();
            },
          },
          {
            children: (
              <>
                <BsArrowRepeat />
                画像差し替え
              </>
            ),
            onSelect: () => {
              handleImage();
            },
          },
        ]}
      >
        <NodeViewContent />
      </ContextMenu>
    </NodeViewWrapper>
  );
};
