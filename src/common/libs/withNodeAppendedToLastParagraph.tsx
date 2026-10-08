import {
  Children,
  cloneElement,
  Fragment,
  isValidElement,
  ReactNode,
} from 'react';

/**
 * appendNodeをtarget配下の最終行に追加する処理
 *
 * @param params.target Nodeを追加するNode
 * @param params.appendNode 追加Node
 * @returns
 */
export const withNodeAppendedToLastParagraph = ({
  target,
  appendNode,
}: {
  target: ReactNode;
  appendNode: ReactNode;
}): ReactNode => {
  const childArray = Children.toArray(target);

  const lastPIndex = childArray.findLastIndex(
    (child) => isValidElement(child) && child.type === 'p'
  );

  return childArray.map((child, index) => {
    if (!isValidElement(child)) {
      return child;
    }

    if (child.type === Fragment) {
      return cloneElement(
        child,
        {},
        withNodeAppendedToLastParagraph({
          target: child.props.children,
          appendNode,
        })
      );
    }

    if (child.type === 'p' && index === lastPIndex) {
      return cloneElement(
        child,
        {},
        <>
          {child.props.children}
          {appendNode}
        </>
      );
    }

    return child;
  });
};
