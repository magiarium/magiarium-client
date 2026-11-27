'use client';

import {
  NodeViewContent,
  NodeViewWrapper,
  type NodeViewProps,
} from '@tiptap/react';
import { BsTrash } from 'react-icons/bs';
import { Button } from '../../ui-primitive/Button';
import './YoutubeFigureNode.scss';

/**
 * YoutubeFigure(削除機能付き)
 */
export const YoutubeFigureNode = ({ editor, deleteNode }: NodeViewProps) => {
  return (
    <NodeViewWrapper className="tiptap-youtube-figure-node">
      {editor.isEditable && <YoutubeFigureTrashButton onClick={deleteNode} />}
      <NodeViewContent />
    </NodeViewWrapper>
  );
};

const YoutubeFigureTrashButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button
      className="tiptap-youtube-figure-node__delete-button"
      variant="ghost"
      onClick={onClick}
    >
      <BsTrash />
    </Button>
  );
};
