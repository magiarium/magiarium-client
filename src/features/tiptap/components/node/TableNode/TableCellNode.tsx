import { ContextMenu } from '@/common/components/ContextMenu';
import { NodeViewProps } from '@tiptap/core';
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import { ReactNode } from 'react';
import { BsToggleOff } from 'react-icons/bs';
import { MdCallMerge, MdCallSplit } from 'react-icons/md';
import {
  TbColumnInsertRight,
  TbColumnRemove,
  TbRowInsertBottom,
  TbRowRemove,
} from 'react-icons/tb';

/**
 * テーブルセルノード
 */
export const TableCellNode = (props: NodeViewProps): ReactNode => {
  const { editor } = props;

  if (editor.isEditable) {
    return EditableTableCellNode(props);
  }

  return (
    <NodeViewWrapper>
      <NodeViewContent />
    </NodeViewWrapper>
  );
};

/**
 * テーブルセルノード(編集用)
 */
export const EditableTableCellNode = (props: NodeViewProps): ReactNode => {
  const { editor } = props;

  return (
    <NodeViewWrapper>
      <ContextMenu
        contextItems={[
          {
            children: (
              <>
                <TbRowInsertBottom />
                行を追加
              </>
            ),
            onSelect: () => {
              editor.chain().focus().addRowAfter().run();
            },
          },
          {
            children: (
              <>
                <TbRowRemove />
                行を削除
              </>
            ),
            onSelect: () => {
              editor.chain().focus().deleteRow().run();
            },
          },
          {
            children: (
              <>
                <TbColumnInsertRight />
                列を追加
              </>
            ),
            onSelect: () => {
              editor.chain().focus().addColumnAfter().run();
            },
          },
          {
            children: (
              <>
                <TbColumnRemove />
                列を削除
              </>
            ),
            onSelect: () => {
              editor.chain().focus().deleteColumn().run();
            },
          },
          {
            children: (
              <>
                <MdCallMerge />
                セル結合
              </>
            ),
            onSelect: () => {
              editor.chain().focus().mergeCells().run();
            },
          },
          {
            children: (
              <>
                <MdCallSplit />
                セル分割
              </>
            ),
            onSelect: () => {
              editor.chain().focus().splitCell().run();
            },
          },
          {
            children: (
              <>
                <BsToggleOff />
                見出し切り替え
              </>
            ),
            onSelect: () => {
              editor.chain().focus().toggleHeaderCell().run();
            },
          },
        ]}
      >
        <NodeViewContent />
      </ContextMenu>
    </NodeViewWrapper>
  );
};
