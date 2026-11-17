import { ContextMenu } from '@/common/components/ContextMenu';
import { NodeViewProps } from '@tiptap/core';
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import { ReactNode } from 'react';
import { BsArrowDown, BsArrowUp } from 'react-icons/bs';
import './CaptionNode.scss';

/**
 * キャプションノード
 */
export const CaptionNode = (props: NodeViewProps): ReactNode => {
  const { editor } = props;

  if (editor.isEditable) {
    return EditableCaptionNode(props);
  }

  return (
    <NodeViewWrapper>
      <NodeViewContent />
    </NodeViewWrapper>
  );
};

/**
 * キャプションノード(編集用)
 */
export const EditableCaptionNode = (props: NodeViewProps): ReactNode => {
  const { editor, node } = props;

  return (
    <NodeViewWrapper>
      <ContextMenu
        contextItems={[
          {
            children: (
              <>
                {node.attrs.captionSide === 'bottom' ? (
                  <BsArrowUp />
                ) : (
                  <BsArrowDown />
                )}
                キャプション位置を変更
              </>
            ),
            onSelect: () => {
              editor.chain().focus().toggleCaptionSide().run();
            },
          },
        ]}
      >
        <NodeViewContent className="tiptap-caption--editable" />
      </ContextMenu>
    </NodeViewWrapper>
  );
};
