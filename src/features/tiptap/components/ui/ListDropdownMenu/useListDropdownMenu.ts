'use client';

import type { Editor } from '@tiptap/react';
import { useEffect, useMemo, useState } from 'react';

// --- Hooks ---
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';

// --- Icons ---
import { ListIcon } from '@/features/tiptap/components/icons/ListIcon';
import { ListOrderedIcon } from '@/features/tiptap/components/icons/ListOrderedIcon';
import { ListTodoIcon } from '@/features/tiptap/components/icons/ListTodoIcon';

// --- Lib ---
import { isNodeInSchema } from '@/features/tiptap/lib/tiptapUtils';

// --- Tiptap UI ---
import {
  canToggleList,
  isListActive,
  listIcons,
  type ListType,
} from '@/features/tiptap/components/ui/ListButton';

/**
 * リストドロップダウン機能の設定
 */
export interface UseListDropdownMenuConfig {
  /**
   * Tiptapエディターのインスタンス(任意)
   */
  editor?: Editor | null;

  /**
   * ドロップダウンに表示するリスト種別の一覧
   * @default ["bulletList", "orderedList", "taskList"]
   */
  types?: ListType[];

  /**
   * リストが使用できない場合に、ボタンを非表示にするかどうか。
   * @default false
   */
  hideWhenUnavailable?: boolean;
}

/**
 * リストオプション
 */
export interface ListOption {
  /**
   * ラベル
   */
  label: string;
  /**
   * リスト種別
   */
  type: ListType;
  /**
   * アイコン
   */
  icon: React.ElementType;
}

/**
 * リストオプション一覧
 */
export const listOptions: ListOption[] = [
  {
    label: '箇条書きリスト',
    type: 'bulletList',
    icon: ListIcon,
  },
  {
    label: '順序付きリスト',
    type: 'orderedList',
    icon: ListOrderedIcon,
  },
  {
    label: 'Task List',
    type: 'taskList',
    icon: ListTodoIcon,
  },
];

/**
 * 現在のエディター状態で、任意のリストに切り替えが可能かどうかをチェックする処理
 *
 * @param editor Tiptapエディターのインスタンス
 * @param listTypes リスト種別一覧
 * @returns true:可能、false:不可
 */
export const canToggleAnyList = (
  editor: Editor | null,
  listTypes: ListType[]
): boolean => {
  if (!editor || !editor.isEditable) return false;
  return listTypes.some((type) => canToggleList(editor, type));
};

/**
 * 現在のノードで任意のリストが有効になっているかチェックする
 *
 * @param editor Tiptapエディターのインスタンス
 * @param type リスト種別一覧
 * @return true:有効、flase：無効
 */
export const isAnyListActive = (
  editor: Editor | null,
  listTypes: ListType[]
): boolean => {
  if (!editor || !editor.isEditable) return false;
  return listTypes.some((type) => isListActive(editor, type));
};

/**
 * 利用可能なリスト種別に基づいて、リストの選択肢を絞り込む。
 *
 * @param availableTypes 利用可能なリスト種別一覧
 * @returns リスト種別
 */
export const getFilteredListOptions = (
  availableTypes: ListType[]
): typeof listOptions => {
  return listOptions.filter(
    (option) => !option.type || availableTypes.includes(option.type)
  );
};
/**
 * リストボタンを表示するかどうかを判定する処理
 *
 * @param props.editor Tiptapエディターのインスタンス
 * @param prosp.listTypes リスト種別一覧
 * @param props.hideWhenUnavailable リストボタンが使用できない場合に、ボタンを非表示にするかどうか。
 * @param props.listInSchema スキーマに対象リストが含まれているか
 * @param props.canToggleAny 切り替え可能か
 * @returns false:表示する, true:非表示
 */
export const shouldShowListDropdown = (params: {
  editor: Editor | null;
  listTypes: ListType[];
  hideWhenUnavailable: boolean;
  listInSchema: boolean;
  canToggleAny: boolean;
}): boolean => {
  const { editor, hideWhenUnavailable, listInSchema, canToggleAny } = params;

  if (!editor) return false;

  if (!hideWhenUnavailable) {
    return true;
  }

  if (!listInSchema) return false;

  if (!editor.isActive('code')) {
    return canToggleAny;
  }

  return true;
};

/**
 * エディタで現在有効になっているリスト種別を取得する。
 *
 * @param editor エディタインスタンス
 * @param availableTypes 利用可能なリスト種別一覧
 * @returns 現在有効なリスト種別。該当する種別がない場合は undefined
 */
export const getActiveListType = (
  editor: Editor | null,
  availableTypes: ListType[]
): ListType | undefined => {
  if (!editor || !editor.isEditable) return undefined;
  return availableTypes.find((type) => isListActive(editor, type));
};

/**
 * Tiptapエディター向けのリスト機能を提供するカスタムフック。
 * @param config リスト機能の設定
 *
 * @example
 * ```tsx
 * // シンプルな使用方法 - パラメーター不要
 * function MyListDropdown() {
 *   const {
 *     isVisible,
 *     activeType,
 *     isAnyActive,
 *     canToggleAny,
 *     filteredLists,
 *   } = useListDropdownMenu()
 *
 *   if (!isVisible) return null
 *
 *   return (
 *     <DropdownMenu>
 *       // ドロップダウンコンテキスト
 *     </DropdownMenu>
 *   )
 * }
 *
 * // 設定を指定した高度な使用方法
 * function MyAdvancedListDropdown() {
 *   const {
 *     isVisible,
 *     activeType,
 *   } = useListDropdownMenu({
 *     editor: myEditor,
 *     types: ["bulletList", "orderedList"],
 *     hideWhenUnavailable: true,
 *   })
 *
 *    実際のコンポーネントを実装
 * }
 * ```
 */
export const useListDropdownMenu = (config?: UseListDropdownMenuConfig) => {
  const {
    editor: providedEditor,
    types = ['bulletList', 'orderedList', 'taskList'],
    hideWhenUnavailable = false,
  } = config || {};

  const { editor } = useTiptapEditor(providedEditor);
  const [isVisible, setIsVisible] = useState(true);

  const listInSchema = types.some((type) => isNodeInSchema(type, editor));

  const filteredLists = useMemo(() => getFilteredListOptions(types), [types]);

  const canToggleAny = canToggleAnyList(editor, types);
  const isAnyActive = isAnyListActive(editor, types);
  const activeType = getActiveListType(editor, types);
  const activeList = filteredLists.find((option) => option.type === activeType);

  useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      setIsVisible(
        shouldShowListDropdown({
          editor,
          listTypes: types,
          hideWhenUnavailable,
          listInSchema,
          canToggleAny,
        })
      );
    };

    handleSelectionUpdate();

    editor.on('selectionUpdate', handleSelectionUpdate);

    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate);
    };
  }, [canToggleAny, editor, hideWhenUnavailable, listInSchema, types]);

  return {
    isVisible,
    activeType,
    isActive: isAnyActive,
    canToggle: canToggleAny,
    types,
    filteredLists,
    label: 'List',
    Icon: activeList ? listIcons[activeList.type] : ListIcon,
  };
};
