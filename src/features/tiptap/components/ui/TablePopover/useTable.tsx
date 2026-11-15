'use client';

import { Editor } from '@tiptap/react';
import { useCallback, useEffect, useState } from 'react';

// --- Hooks ---
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';

// --- Icons ---
import { BsTable } from 'react-icons/bs';

// --- Lib ---
import { useCurrentNode } from '@/features/tiptap/hooks/useCurrentNode';
import {
  isNodeInSchema,
  isNodeTypeSelected,
} from '@/features/tiptap/lib/tiptapUtils';

/**
 * テーブル機能の設定
 */
export interface UseTableConfig {
  /**
   * Tiptapエディターのインスタンス(任意)
   */
  editor?: Editor | null;

  /**
   * テーブル機能が使用できない場合に、ボタンを非表示にするかどうか。
   * @default false
   */
  hideWhenUnavailable?: boolean;

  /**
   * テーブルの設定が正常に完了した後に呼び出されるコールバック関数
   */
  onSetTable?: () => void;
}

/**
 * 現在のエディター状態で、テーブルの設定が可能かどうかをチェックする処理
 *
 * @param editor Tiptapエディターのインスタンス
 * @returns true:利用可、false:利用不可
 */
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

/**
 * ボタンを表示するかどうかを判定する処理
 *
 * @param props.editor Tiptapエディターのインスタンス
 * @param props.hideWhenUnavailable 対象機能が使用できない場合に、ボタンを非表示にするかどうか。
 * @returns false:表示する, true:非表示
 */
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

/**
 * テーブルオプション型定義
 */
export interface TableOptions {
  // 列数
  cols: number;
  // 行数
  rows: number;
  // ヘッダー行を利用するか？
  withHeaderRow?: boolean;
}

/**
 * テーブルオプションのデフォルト設定
 */
export const DEFAULT_TABLE_OPTIONS = {
  cols: 2,
  rows: 3,
  withHeaderRow: true,
};

/**
 * テーブルハンドラーのカスタムフック
 * @param props.editor Tiptapエディターのインスタンス
 * @param props.onSetTable テーブル設定更新時のコールバック関数
 * @returns テーブルハンドラー各種
 */
export const useTableHandler = (props: {
  editor: Editor | null;
  onSetTable?: () => void;
}) => {
  const { editor, onSetTable } = props;
  const [tableOptions, setTableOptions] = useState<TableOptions>({
    rows: DEFAULT_TABLE_OPTIONS.rows,
    cols: DEFAULT_TABLE_OPTIONS.cols,
    withHeaderRow: DEFAULT_TABLE_OPTIONS.withHeaderRow,
  });

  const insertTable = useCallback(() => {
    if (!editor || !editor.isEditable) return false;
    if (!canSetTable(editor)) return false;

    editor
      .chain()
      .focus()
      .insertTable({
        ...tableOptions,
        rows: tableOptions.withHeaderRow
          ? tableOptions.rows + 1
          : tableOptions.rows,
      })
      .run();

    onSetTable?.();
    return true;
  }, [editor, onSetTable, tableOptions]);

  const deleteTable = useCallback(() => {
    if (!editor || !editor.isEditable) return false;
    if (!canSetTable(editor)) return false;

    editor.chain().focus().deleteTable().run();
  }, [editor]);

  return {
    tableOptions: tableOptions,
    setTableOptions,
    insertTable,
    deleteTable,
  };
};

/**
 * Tiptapエディター向けのテーブル機能を提供するカスタムフック。
 * @param config テーブル機能の設定
 */
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
  const isActive = useCurrentNode(editor) === 'table';
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
