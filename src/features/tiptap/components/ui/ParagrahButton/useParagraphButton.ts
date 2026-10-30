import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';
import {
  findNodePosition,
  getSelectedBlockNodes,
  isNodeInSchema,
  isNodeTypeSelected,
  isValidPosition,
  selectionWithinConvertibleTypes,
} from '@/features/tiptap/lib/tiptapUtils';
import { NodeSelection, TextSelection } from '@tiptap/pm/state';
import { Editor } from '@tiptap/react';
import { useCallback, useEffect, useState } from 'react';
import { BsParagraph } from 'react-icons/bs';

export const PARAGRAPH_SHORTCUT_KEY = 'mod+shift+p';

export interface UseParagraphConfig {
  editor?: Editor | null;

  hideWhenUnavailable?: boolean;

  onToggled?: () => void;
}

export const canToggleParagraph = (
  editor: Editor | null,
  turnInfo: boolean = true
): boolean => {
  if (!editor || !editor.isEditable) {
    return false;
  }

  if (
    !isNodeInSchema('paragraph', editor) ||
    isNodeTypeSelected(editor, ['image'])
  ) {
    return false;
  }

  if (!turnInfo) {
    return editor.can().toggleWrap('paragraph');
  }

  if (
    !selectionWithinConvertibleTypes(editor, [
      'paragraph',
      'heaeding',
      'bulletList',
      'orderedList',
      'taskList',
      'blockquote',
      'codeBlock',
    ])
  ) {
    return false;
  }

  return editor.can().toggleWrap('paragraph') || editor.can().clearNodes();
};

export const shouldShowButton = (props: {
  editor: Editor | null;
  hideWhenUnavailable: boolean;
}) => {
  const { editor, hideWhenUnavailable } = props;

  if (!editor) return false;

  if (!hideWhenUnavailable) {
    return true;
  }

  if (!editor.isEditable) return false;

  if (!isNodeInSchema('paragraph', editor)) return false;

  if (!editor.isActive('code')) {
    return canToggleParagraph(editor);
  }

  return true;
};

export const toggleParagraph = (editor: Editor | null): boolean => {
  if (!editor || !editor.isEditable) return false;
  if (!canToggleParagraph(editor)) return false;

  try {
    const view = editor.view;
    let state = view.state;
    let tr = state.tr;

    const blocks = getSelectedBlockNodes(editor);

    const isPossibleToTurnInto =
      selectionWithinConvertibleTypes(editor, [
        'paragraph',
        'heading',
        'bulletList',
        'orderedList',
        'taskList',
        'blockquote',
        'codeBlock',
      ]) && blocks.length === 1;
    if (
      (state.selection.empty || state.selection instanceof TextSelection) &&
      isPossibleToTurnInto
    ) {
      const pos = findNodePosition({
        editor,
        node: state.selection.$anchor.node(1),
      })?.pos;
      if (!isValidPosition(pos)) return false;

      tr = tr.setSelection(NodeSelection.create(state.doc, pos));
      view.dispatch(tr);
      state = view.state;
    }

    const selection = state.selection;
    let chain = editor.chain().focus();

    // Handle NodeSelection
    if (selection instanceof NodeSelection) {
      const firstChild = selection.node.firstChild?.firstChild;
      const lastChild = selection.node.lastChild?.lastChild;

      const from = firstChild
        ? selection.from + firstChild.nodeSize
        : selection.from + 1;

      const to = lastChild
        ? selection.to - lastChild.nodeSize
        : selection.to - 1;

      const resolvedFrom = state.doc.resolve(from);
      const resolvedTo = state.doc.resolve(to);

      chain = chain
        .setTextSelection(TextSelection.between(resolvedFrom, resolvedTo))
        .clearNodes();
    }
    const toggle = editor.isActive('paragraph')
      ? chain.lift('paragraph')
      : chain.wrapIn('paragraph');

    toggle.run();
    editor.chain().focus().selectTextblockEnd().run();

    return true;
  } catch {
    return false;
  }
};

export const useParagraph = (config?: UseParagraphConfig) => {
  const {
    editor: providedEditor,
    hideWhenUnavailable = false,
    onToggled,
  } = config || {};

  const { editor } = useTiptapEditor(providedEditor);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const canToggle = canToggleParagraph(editor);
  const isActive = editor?.isActive('blockquote') || false;

  useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      setIsVisible(shouldShowButton({ editor, hideWhenUnavailable }));
    };

    handleSelectionUpdate();

    editor.on('selectionUpdate', handleSelectionUpdate);

    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate);
    };
  }, [editor, hideWhenUnavailable]);

  const handleToggle = useCallback(() => {
    if (!editor) return false;

    const success = toggleParagraph(editor);

    if (success) {
      onToggled?.();
    }

    return success;
  }, [editor, onToggled]);

  return {
    isVisible,
    isActive,
    handleToggle,
    canToggle,
    label: 'Paragraph',
    shortcutKeys: PARAGRAPH_SHORTCUT_KEY,
    Icon: BsParagraph,
  };
};
