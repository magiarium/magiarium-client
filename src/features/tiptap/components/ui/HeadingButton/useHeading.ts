'use client';

import { NodeSelection, TextSelection } from '@tiptap/pm/state';
import { type Editor } from '@tiptap/react';
import { useCallback, useEffect, useState } from 'react';

// --- Hooks ---
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';

// --- Lib ---
import {
  findNodePosition,
  getSelectedBlockNodes,
  isNodeInSchema,
  isNodeTypeSelected,
  isValidPosition,
  selectionWithinConvertibleTypes,
} from '@/features/tiptap/lib/tiptapUtils';

// --- Icons ---
import {
  BsTypeH1,
  BsTypeH2,
  BsTypeH3,
  BsTypeH4,
  BsTypeH5,
  BsTypeH6,
} from 'react-icons/bs';

export type Level = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * 見出し機能の設定
 */
export interface UseHeadingConfig {
  /**
   * Tiptapエディターのインスタンス(任意)
   */
  editor?: Editor | null;

  /**
   * 見出しレベル
   */
  level: Level;

  /**
   * 見出しが使用できない場合に、ボタンを非表示にするかどうか。
   * @default false
   */
  hideWhenUnavailable?: boolean;

  /**
   * 見出しの切り替えが正常に完了した後に呼び出されるコールバック関数
   */
  onToggled?: () => void;
}

/**
 * 見出しアイコンの一覧
 */
export const headingIcons = {
  1: BsTypeH1,
  2: BsTypeH2,
  3: BsTypeH3,
  4: BsTypeH4,
  5: BsTypeH5,
  6: BsTypeH6,
};
/**
 * 見出しアイコンショートカットキーの一覧
 */
export const HEADING_SHORTCUT_KEYS: Record<Level, string> = {
  1: 'ctrl+alt+1',
  2: 'ctrl+alt+2',
  3: 'ctrl+alt+3',
  4: 'ctrl+alt+4',
  5: 'ctrl+alt+5',
  6: 'ctrl+alt+6',
};

/**
 * 現在のエディター状態で、見出しの切り替えが可能かどうかをチェックする処理
 *
 * @param editor Tiptapエディターのインスタンス
 * @param level 見出しレベル(任意)
 * @param turnInfo パラグラフへの変換時に追加の判定を行うかどうか
 */
export function canToggle(
  editor: Editor | null,
  level?: Level,
  turnInto: boolean = true
): boolean {
  if (!editor || !editor.isEditable) return false;
  if (
    !isNodeInSchema('heading', editor) ||
    isNodeTypeSelected(editor, ['image'])
  )
    return false;

  if (!turnInto) {
    return level
      ? editor.can().setNode('heading', { level })
      : editor.can().setNode('heading');
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
  ) {
    return false;
  }

  // 選択範囲に対して見出しを直接設定できるか、
  // または書式やノードをクリアすることで見出しに変換できるかをチェック
  return level
    ? editor.can().setNode('heading', { level }) || editor.can().clearNodes()
    : editor.can().setNode('heading') || editor.can().clearNodes();
}

/**
 * 見出し要素が現在アクティブ状態かどうかチェックする
 *
 * @param editor Tiptapエディターインスタンス
 * @param level 見出しレベル(任意)
 */
export function isHeadingActive(
  editor: Editor | null,
  level?: Level | Level[]
): boolean {
  if (!editor || !editor.isEditable) return false;

  if (Array.isArray(level)) {
    return level.some((l) => editor.isActive('heading', { level: l }));
  }

  return level
    ? editor.isActive('heading', { level })
    : editor.isActive('heading');
}

/**
 * エディター内の見出しのオン・オフを切り替える処理
 *
 * @param editor Tiptapエディターのインスタンス
 * @param level 見出しレベル(任意)
 * @return true:切り替え成功, false:切り替え失敗
 */
export function toggleHeading(
  editor: Editor | null,
  level: Level | Level[]
): boolean {
  if (!editor || !editor.isEditable) return false;

  const levels = Array.isArray(level) ? level : [level];
  const toggleLevel = levels.find((l) => canToggle(editor, l));

  if (!toggleLevel) return false;

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

    const isActive = levels.some((l) =>
      editor.isActive('heading', { level: l })
    );

    const toggle = isActive
      ? chain.setNode('paragraph')
      : chain.setNode('heading', { level: toggleLevel });

    toggle.run();

    editor.chain().focus().selectTextblockEnd().run();

    return true;
  } catch {
    return false;
  }
}

/**
 * 見出しボタンを表示するかどうかを判定する処理
 *
 * @param props.editor Tiptapエディターのインスタンス
 * @param props.hideWhenUnavailable 見出しが使用できない場合に、ボタンを非表示にするかどうか。
 * @returns false:表示する, true:非表示
 */
export function shouldShowButton(props: {
  editor: Editor | null;
  level?: Level | Level[];
  hideWhenUnavailable: boolean;
}): boolean {
  const { editor, level, hideWhenUnavailable } = props;

  if (!editor) return false;

  if (!hideWhenUnavailable) {
    return true;
  }

  if (!editor.isEditable) return false;

  if (!isNodeInSchema('heading', editor)) return false;

  if (!editor.isActive('code')) {
    if (Array.isArray(level)) {
      return level.some((l) => canToggle(editor, l));
    }
    return canToggle(editor, level);
  }

  return true;
}

/**
 * Tiptapエディター向けのパラグラフ機能を提供するカスタムフック。
 *
 * @example
 * ```tsx
 * // シンプルな使用方法 - パラメーター不要
 * function MySimpleHeadingButton() {
 *   const { isVisible, isActive, handleToggle, Icon } = useHeading({ level: 1 })
 *
 *   if (!isVisible) return null
 *
 *   return (
 *     <button
 *       onClick={handleToggle}
 *       aria-pressed={isActive}
 *     >
 *       <Icon />
 *       Heading 1
 *     </button>
 *   )
 * }
 *
 * // 設定を指定した高度な使用方法
 * function MyAdvancedHeadingButton() {
 *   const { isVisible, isActive, handleToggle, label, Icon } = useHeading({
 *     level: 2,
 *     editor: myEditor,
 *     hideWhenUnavailable: true,
 *     onToggled: (isActive) => console.log('見出しの切り替え:', isActive)
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
 *       <Icon />
 *       見出しを切り替える
 *     </MyButton>
 *   )
 * }
 * ```
 */
export function useHeading(config: UseHeadingConfig) {
  const {
    editor: providedEditor,
    level,
    hideWhenUnavailable = false,
    onToggled,
  } = config;

  const { editor } = useTiptapEditor(providedEditor);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const canToggleState = canToggle(editor, level);
  const isActive = isHeadingActive(editor, level);

  useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      setIsVisible(shouldShowButton({ editor, level, hideWhenUnavailable }));
    };

    handleSelectionUpdate();

    editor.on('selectionUpdate', handleSelectionUpdate);

    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate);
    };
  }, [editor, level, hideWhenUnavailable]);

  const handleToggle = useCallback(() => {
    if (!editor) return false;

    const success = toggleHeading(editor, level);
    if (success) {
      onToggled?.();
    }
    return success;
  }, [editor, level, onToggled]);

  return {
    isVisible,
    isActive,
    handleToggle,
    canToggle: canToggleState,
    label: `Heading ${level}`,
    shortcutKeys: HEADING_SHORTCUT_KEYS[level],
    Icon: headingIcons[level],
  };
}
