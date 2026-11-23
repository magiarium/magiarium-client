import { NodeViewProps } from '@tiptap/core';
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import { BsTrash } from 'react-icons/bs';
import { Button } from '../../ui-primitive/Button';
import './TableFigureNode.scss';

/**
 * テーブルFigure(削除ボタン付き)
 */
export const TableFigureNode = ({ editor, deleteNode }: NodeViewProps) => {
  return (
    <NodeViewWrapper>
      <div className="tiptap-table-figure-node">
        {editor.isEditable && <TableFigureTrashButton onClick={deleteNode} />}
        <NodeViewContent />
      </div>
    </NodeViewWrapper>
  );
};

const TableFigureTrashButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button
      className="tiptap-table-figure-node__delete-button"
      variant="ghost"
      onClick={onClick}
    >
      <BsTrash />
    </Button>
  );
};
