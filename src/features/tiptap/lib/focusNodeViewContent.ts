import { TextSelection } from '@tiptap/pm/state';
import { NodeViewProps } from '@tiptap/react';

/**
 * NodeViewContentフォーカス処理
 * ※PopoverなどでAttributesを編集時、対象Nodeにフォーカスするための処理
 *
 * @param props NodeViewProps
 * @param shouldFocus エディタをフォーカスするか
 */
export const focusNodeViewContent = (
  props: NodeViewProps,
  shouldFocus = true
): void => {
  const pos = props.getPos();

  if (typeof pos !== 'number') return;

  const { state, view } = props.editor;
  const node = state.doc.nodeAt(pos);

  if (!node) return;

  const contentStart = pos + 1;

  const selection = TextSelection.near(state.doc.resolve(contentStart), 1);

  const contentEnd = pos + node.nodeSize - 1;

  if (selection.from < contentStart || selection.from > contentEnd) {
    return;
  }

  view.dispatch(state.tr.setSelection(selection));

  // 必要な場合だけエディタにフォーカスする
  if (shouldFocus) {
    view.focus();
  }
};
