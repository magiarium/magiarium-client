import { ContextMenu } from '@/common/components/ContextMenu';
import { NodeViewProps } from '@tiptap/core';
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import { ReactNode } from 'react';
import { BsArrowDown, BsArrowUp } from 'react-icons/bs';

/**
 * テーブルキャプションノード
 */
export const TableCaptionNode = (props: NodeViewProps): ReactNode => {
  const { editor } = props;

  if (editor.isEditable) {
    return EditableTableCaptionNode(props);
  }

  return (
    <NodeViewWrapper>
      <NodeViewContent />
    </NodeViewWrapper>
  );
};

/**
 * テーブルキャプションノード(編集用)
 */
export const EditableTableCaptionNode = (props: NodeViewProps): ReactNode => {
  const { editor, node } = props;

  return (
    <NodeViewWrapper>
      <ContextMenu
        contextItems={[
          {
            children: (
              <>
                {node.attrs.tableCaptionSide === 'bottom' ? (
                  <BsArrowUp />
                ) : (
                  <BsArrowDown />
                )}
                キャプション位置を変更
              </>
            ),
            onSelect: () => {
              editor.chain().focus().toggleTableCaptionSide().run();
            },
          },
        ]}
      >
        <NodeViewContent className="tiptap-table-caption--editable" />
      </ContextMenu>
    </NodeViewWrapper>
  );
};
