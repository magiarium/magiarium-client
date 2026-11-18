import { ContextMenu } from '@/common/components/ContextMenu';
import { NodeViewContent, NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import { ReactNode } from 'react';
import { BsArrowRepeat, BsTrash } from 'react-icons/bs';
import { useImageUpload } from '../../ui/ImageUploadButton';
import './ImageFigureNode.scss';

export const ImageFigureNode = (props: NodeViewProps): ReactNode => {
  const { editor } = props;

  if (editor.isEditable) {
    return EditableImageFigureNode(props);
  }

  return (
    <NodeViewWrapper>
      <NodeViewContent />
    </NodeViewWrapper>
  );
};

export const EditableImageFigureNode = (props: NodeViewProps): ReactNode => {
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
              editor.chain().focus().deleteImageFigure().run();
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
