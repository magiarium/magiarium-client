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
import { CodeBlockIcon } from '@/features/tiptap/components/icons/CodeBlockIcon';
import { useCurrentNode } from '@/features/tiptap/hooks/useCurrentNode';

// コードブロック切り替え用ショートカットキー
export const CODE_BLOCK_SHORTCUT_KEY = 'mod+alt+c';

/**
 * コードブロック機能の設定
 */
export interface UseCodeBlockConfig {
  /**
   * Tiptapエディターのインスタンス(任意)
   */
  editor?: Editor | null;

  /**
   * コードブロックが使用できない場合に、ボタンを非表示にするかどうか。
   * @default false
   */
  hideWhenUnavailable?: boolean;

  /**
   * コードブロックの切り替えが正常に完了した後に呼び出されるコールバック関数
   */
  onToggled?: () => void;
}

/**
 * 現在のエディター状態で、コードブロックの切り替えが可能かどうかをチェックする処理
 *
 * @param editor Tiptapエディターのインスタンス
 * @param turnInfo コードブロックへの変換時に追加の判定を行うかどうか
 */
export const canToggle = (
  editor: Editor | null,
  turnInto: boolean = true
): boolean => {
  if (!editor || !editor.isEditable) return false;
  if (
    !isNodeInSchema('codeBlock', editor) ||
    isNodeTypeSelected(editor, ['image'])
  )
    return false;

  if (!turnInto) {
    return editor.can().toggleNode('codeBlock', 'paragraph');
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

  // 選択範囲に対してコードブロックを直接設定できるか、
  // または書式やノードをクリアすることでコードブロックに変換できるかをチェック
  return (
    editor.can().toggleNode('codeBlock', 'paragraph') ||
    editor.can().clearNodes()
  );
};

/**
 * エディター内のコードブロックのオン・オフを切り替える処理
 * @param editor Tiptapエディターのインスタンス
 * @return true:切り替え成功, false:切り替え失敗
 */
export const toggleCodeBlock = (editor: Editor | null): boolean => {
  if (!editor || !editor.isEditable) return false;
  if (!canToggle(editor)) return false;

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

    const toggle = editor.isActive('codeBlock')
      ? chain.setNode('paragraph')
      : chain.toggleNode('codeBlock', 'paragraph');

    toggle.run();

    editor.chain().focus().selectTextblockEnd().run();

    return true;
  } catch {
    return false;
  }
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

  if (!editor) return false;

  if (!hideWhenUnavailable) {
    return true;
  }

  if (!editor.isEditable) return false;

  if (!isNodeInSchema('codeBlock', editor)) return false;

  if (!editor.isActive('code')) {
    return canToggle(editor);
  }

  return true;
};

/**
 * Tiptapエディター向けのコードブロック機能を提供するカスタムフック。
 * @param config コードブロック機能の設定
 *
 * @example
 * ```tsx
 * // シンプルな使用方法 - パラメーター不要
 * function MySimpleCodeBlockButton() {
 *   const { isVisible, isActive, handleToggle } = useCodeBlock()
 *
 *   if (!isVisible) return null
 *
 *   return (
 *     <button
 *       onClick={handleToggle}
 *       aria-pressed={isActive}
 *     >
 *       Code Block
 *     </button>
 *   )
 * }
 *
 * // 設定を指定した高度な使用方法
 * function MyAdvancedCodeBlockButton() {
 *   const { isVisible, isActive, handleToggle, label } = useCodeBlock({
 *     editor: myEditor,
 *     hideWhenUnavailable: true,
 *     onToggled: (isActive) => console.log('コードブロックの切り替え:', isActive)
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
 *       コードブロックを切り替える
 *     </MyButton>
 *   )
 * }
 * ```
 */
export const useCodeBlock = (config?: UseCodeBlockConfig) => {
  const {
    editor: providedEditor,
    hideWhenUnavailable = false,
    onToggled,
  } = config || {};

  const { editor } = useTiptapEditor(providedEditor);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const canToggleState = canToggle(editor);
  const isActive = useCurrentNode(editor) === 'codeBlock';

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

    const success = toggleCodeBlock(editor);
    if (success) {
      onToggled?.();
    }
    return success;
  }, [editor, onToggled]);

  return {
    isVisible,
    isActive,
    handleToggle,
    canToggle: canToggleState,
    label: 'Code Block',
    shortcutKeys: CODE_BLOCK_SHORTCUT_KEY,
    Icon: CodeBlockIcon,
  };
};
