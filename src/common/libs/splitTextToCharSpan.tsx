import React, {
  Children,
  cloneElement,
  isValidElement,
  ReactNode,
} from 'react';

/**
 * テキスト分割処理
 *
 * @param node 分割対象ノード
 * @returns 分割済み(テキストを1文字ずつspan化した)ノード
 */
export const splitTextToCharSpan = (node: ReactNode): ReactNode => {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node)
      .split('')
      .map((char, index) => <span key={index}>{char}</span>);
  }

  if (Array.isArray(node)) {
    return node.map((child, index) => (
      <React.Fragment key={index}>{splitTextToCharSpan(child)}</React.Fragment>
    ));
  }

  if (
    isValidElement<{
      children?: ReactNode;
    }>(node)
  ) {
    return cloneElement(node, {
      children: splitTextToCharSpan(node.props.children),
    });
  }

  return Children.map(node, splitTextToCharSpan);
};
