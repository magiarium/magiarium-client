import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';
import {
  isNodeInSchema,
  isNodeTypeSelected,
} from '@/features/tiptap/lib/tiptapUtils';
import { Editor } from '@tiptap/react';
import { useCallback, useEffect, useState } from 'react';
import { BsTable } from 'react-icons/bs';

export interface UseTableConfig {
  editor?: Editor | null;

  hideWhenUnavailable?: boolean;

  onSetTable?: () => void;
}

export const canSetTable = (editor: Editor | null): boolean => {
  if (!editor || !editor.isEditable) return false;

  if (
    !isNodeInSchema('table', editor) ||
    isNodeTypeSelected(editor, ['image'])
  ) {
    return false;
  }

  return editor.can().insertTable();
};

export const shouldShowButton = (props: {
  editor: Editor | null;
  hideWhenUnavailable: boolean;
}): boolean => {
  const { editor, hideWhenUnavailable } = props;

  if (!editor || !editor.isEditable) return false;

  if (!hideWhenUnavailable) {
    return true;
  }

  if (!editor.isActive('code')) {
    return canSetTable(editor);
  }

  return true;
};

export interface TableHandlerProps {
  editor: Editor | null;
  onSetTable?: () => void;
}

export interface TableOptions {
  cols: number;
  rows: number;
  withHeaderRow?: boolean;
}

export const DEFAULT_TABLE_OPTIONS = {
  cols: 2,
  rows: 3,
  withHeaderRow: true,
};

export const useTableHandler = (props: TableHandlerProps) => {
  const { editor, onSetTable } = props;
  const [tableOptions, setTableOptions] = useState<TableOptions | null>(null);

  useEffect(() => {
    if (!editor) return;

    const { rows, cols, withHeaderRow } = editor.getAttributes('table');
    if (editor?.isActive('tableKit') && tableOptions === null) {
      setTableOptions({
        rows: rows ?? DEFAULT_TABLE_OPTIONS.rows,
        cols: cols ?? DEFAULT_TABLE_OPTIONS.cols,
        withHeaderRow: withHeaderRow ?? DEFAULT_TABLE_OPTIONS.withHeaderRow,
      });
    }
  }, [editor, tableOptions]);

  useEffect(() => {
    if (!editor) return;

    const updateTableOptions = () => {
      const { rows, cols, withHeaderRow } = editor.getAttributes('table');
      setTableOptions({
        rows: rows ?? DEFAULT_TABLE_OPTIONS.rows,
        cols: cols ?? DEFAULT_TABLE_OPTIONS.cols,
        withHeaderRow: withHeaderRow ?? DEFAULT_TABLE_OPTIONS.withHeaderRow,
      });
    };

    editor.on('selectionUpdate', updateTableOptions);
    return () => {
      editor.off('selectionUpdate', updateTableOptions);
    };
  }, [editor]);

  const setTable = useCallback(() => {
    if (!tableOptions || !editor) {
      return;
    }

    editor.chain().focus().insertTable(tableOptions).run();

    setTableOptions(null);

    onSetTable?.();
  }, [editor, onSetTable, tableOptions]);

  return {
    tableOptions: tableOptions || DEFAULT_TABLE_OPTIONS,
    setTableOptions,
    setTable,
  };
};

export const useTable = (config?: UseTableConfig) => {
  const {
    editor: providedEditor,
    hideWhenUnavailable = false,
    onSetTable,
  } = config || {};

  const { editor } = useTiptapEditor(providedEditor);

  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      setIsVisible(
        shouldShowButton({
          editor,
          hideWhenUnavailable,
        })
      );
    };

    handleSelectionUpdate();

    editor.on('selectionUpdate', handleSelectionUpdate);

    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate);
    };
  }, [editor, hideWhenUnavailable]);
  const isActive = editor?.isActive('table') || false;
  const canSet = canSetTable(editor);

  const tableHandler = useTableHandler({
    editor,
    onSetTable,
  });

  return {
    isVisible,
    canSet,
    isActive,
    label: 'Table',
    Icon: BsTable,
    ...tableHandler,
  };
};
