import { NodeSelection, TextSelection } from '@tiptap/pm/state';
import { type Editor } from '@tiptap/react';
import { useCallback, useEffect, useState } from 'react';

// --- Hooks ---
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';

// --- Icons ---
import { ListIcon } from '@/features/tiptap/components/icons/ListIcon';
import { ListOrderedIcon } from '@/features/tiptap/components/icons/ListOrderedIcon';
import { ListTodoIcon } from '@/features/tiptap/components/icons/ListTodoIcon';

// --- Lib ---
import {
  findNodePosition,
  getSelectedBlockNodes,
  isNodeInSchema,
  isNodeTypeSelected,
  isValidPosition,
  selectionWithinConvertibleTypes,
} from '@/features/tiptap/lib/tiptapUtils';

// リスト切り替え用ショートカットキー
export type ListType = 'bulletList' | 'orderedList' | 'taskList';

/**
 * リスト機能の設定
 */
export interface UseListConfig {
  /**
   * Tiptapエディターのインスタンス(任意)
   */
  editor?: Editor | null;

  /**
   * ListType
   */
  type: ListType;

  /**
   * リストが使用できない場合に、ボタンを非表示にするかどうか。
   * @default false
   */
  hideWhenUnavailable?: boolean;

  /**
   * リストの切り替えが正常に完了した後に呼び出されるコールバック関数
   */
  onToggled?: () => void;
}

/**
 * リストアイコン一覧
 */
export const listIcons = {
  bulletList: ListIcon,
  orderedList: ListOrderedIcon,
  taskList: ListTodoIcon,
};

/**
 * リストラベル一覧
 */
export const listLabels: Record<ListType, string> = {
  bulletList: '箇条書きリスト',
  orderedList: '順序付きリスト',
  taskList: 'チェック付きリスト',
};

/**
 * リストショートカットキー一覧
 */
export const LIST_SHORTCUT_KEYS: Record<ListType, string> = {
  bulletList: 'mod+shift+8',
  orderedList: 'mod+shift+7',
  taskList: 'mod+shift+9',
};

/**
 * 現在のエディター状態で、リストの切り替えが可能かどうかをチェックする処理
 *
 * @param editor Tiptapエディターのインスタンス
 * @param type ListType
 * @param turnInfo リストへの変換時に追加の判定を行うかどうか
 * @returns true:可能、false:不可
 */
export const canToggleList = (
  editor: Editor | null,
  type: ListType,
  turnInto: boolean = true
): boolean => {
  if (!editor || !editor.isEditable) return false;
  if (!isNodeInSchema(type, editor) || isNodeTypeSelected(editor, ['image']))
    return false;

  if (!turnInto) {
    switch (type) {
      case 'bulletList':
        return editor.can().toggleBulletList();
      case 'orderedList':
        return editor.can().toggleOrderedList();
      case 'taskList':
        return editor.can().toggleList('taskList', 'taskItem');
      default:
        return false;
    }
  }

  // 選択範囲が、変換を許可されているノード内であるかチェック
  if (
    !selectionWithinConvertibleTypes(editor, [
      'paragraph',
      'heading',
      'bulletList',
      'orderedList',
      'taskList',
      'blockquote',
      'codeBlock',
    ])
  )
    return false;

  // 選択範囲に直接リストを設定する/あるいは書式やノードをクリアする
  switch (type) {
    case 'bulletList':
      return editor.can().toggleBulletList() || editor.can().clearNodes();
    case 'orderedList':
      return editor.can().toggleOrderedList() || editor.can().clearNodes();
    case 'taskList':
      return (
        editor.can().toggleList('taskList', 'taskItem') ||
        editor.can().clearNodes()
      );
    default:
      return false;
  }
};

/**
 * 現在のノードでリストが有効になっているかチェックする
 *
 * @param editor Tiptapエディターのインスタンス
 * @param type ListType
 * @return true:有効、flase：無効
 */
export const isListActive = (
  editor: Editor | null,
  type: ListType
): boolean => {
  if (!editor || !editor.isEditable) return false;

  switch (type) {
    case 'bulletList':
      return editor.isActive('bulletList');
    case 'orderedList':
      return editor.isActive('orderedList');
    case 'taskList':
      return editor.isActive('taskList');
    default:
      return false;
  }
};

/**
 * エディター内のリストクのオン・オフを切り替える処理
 *
 * @param editor Tiptapエディターのインスタンス
 * @param type ListType
 * @return true:切り替え成功, false:切り替え失敗
 */
export const toggleList = (editor: Editor | null, type: ListType): boolean => {
  if (!editor || !editor.isEditable) return false;
  if (!canToggleList(editor, type)) return false;

  try {
    const view = editor.view;
    let state = view.state;
    let tr = state.tr;

    const blocks = getSelectedBlockNodes(editor);

    // 選択範囲に複数のブロックが含まれる場合、ノードへの切り替えを許可するのは、選択されているブロックが1つの場合のみとする。
    // また後続のロジックにフォールバックするため、canToggle は制限しない。
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

    // 選択範囲がない場合は、カーソルの位置を取得する。
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

    // NodeSelection（ノード選択）の場合を処理
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

    if (editor.isActive(type)) {
      // リスト構造の解除
      chain
        .liftListItem('listItem')
        .lift('bulletList')
        .lift('orderedList')
        .lift('taskList')
        .run();
    } else {
      // 種別ごとのリストを適用
      const toggleMap: Record<ListType, () => typeof chain> = {
        bulletList: () => chain.toggleBulletList(),
        orderedList: () => chain.toggleOrderedList(),
        taskList: () => chain.toggleList('taskList', 'taskItem'),
      };

      const toggle = toggleMap[type];
      if (!toggle) return false;

      toggle().run();
    }

    editor.chain().focus().selectTextblockEnd().run();

    return true;
  } catch {
    return false;
  }
};

/**
 * リストボタンを表示するかどうかを判定する処理
 *
 * @param props.editor Tiptapエディターのインスタンス
 * @param prosp.type ListType
 * @param props.hideWhenUnavailable リストボタンが使用できない場合に、ボタンを非表示にするかどうか。
 * @returns false:表示する, true:非表示
 */
export const shouldShowButton = (props: {
  editor: Editor | null;
  type: ListType;
  hideWhenUnavailable: boolean;
}): boolean => {
  const { editor, type, hideWhenUnavailable } = props;

  if (!editor) return false;

  if (!hideWhenUnavailable) {
    return true;
  }

  if (!editor.isEditable) return false;

  if (!isNodeInSchema(type, editor)) return false;

  if (!editor.isActive('code')) {
    return canToggleList(editor, type);
  }

  return true;
};

/**
 * Tiptapエディター向けのリスト機能を提供するカスタムフック。
 * @param config リスト機能の設定
 *
 * @example
 * ```tsx
 * // シンプルな使用方法 - パラメーター不要
 * function MySimpleListButton() {
 *   const { isVisible, handleToggle, isActive } = useList({ type: "bulletList" })
 *
 *   if (!isVisible) return null
 *
 *   return <button onClick={handleToggle}>Bullet List</button>
 * }
 *
 * // 設定を指定した高度な使用方法
 * function MyAdvancedListButton() {
 *   const { isVisible, handleToggle, label, isActive } = useList({
 *     type: "orderedList",
 *     editor: myEditor,
 *     hideWhenUnavailable: true,
 *     onToggled: () => console.log('リストの切り替え')
 *   })
 *
 *   if (!isVisible) return null
 *
 *   return (
 *     <MyButton
 *       onClick={handleToggle}
 *       aria-label={label}
 *       aria-pressed={isActive}
 *     >
 *       リストの切り替え
 *     </MyButton>
 *   )
 * }
 * ```
 */
export const useList = (config: UseListConfig) => {
  const {
    editor: providedEditor,
    type,
    hideWhenUnavailable = false,
    onToggled,
  } = config;

  const { editor } = useTiptapEditor(providedEditor);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const canToggle = canToggleList(editor, type);
  const isActive = isListActive(editor, type);

  useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      setIsVisible(shouldShowButton({ editor, type, hideWhenUnavailable }));
    };

    handleSelectionUpdate();

    editor.on('selectionUpdate', handleSelectionUpdate);

    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate);
    };
  }, [editor, type, hideWhenUnavailable]);

  const handleToggle = useCallback(() => {
    if (!editor) return false;

    const success = toggleList(editor, type);
    if (success) {
      onToggled?.();
    }
    return success;
  }, [editor, type, onToggled]);

  return {
    isVisible,
    isActive,
    handleToggle,
    canToggle,
    label: listLabels[type],
    shortcutKeys: LIST_SHORTCUT_KEYS[type],
    Icon: listIcons[type],
  };
};
