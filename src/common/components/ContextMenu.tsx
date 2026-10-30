import { ContextMenu as RadixContextMenu } from 'radix-ui';
import { ReactNode } from 'react';
import './ContextMenu.scss';

type ContextItem = {
  /** コンテキスト子要素 */
  children: ReactNode;
  /** 選択アクション */
  onSelect: () => void;
};

export const ContextMenu = ({
  children,
  contextItems,
}: {
  children: ReactNode;
  contextItems?: ContextItem[];
}) => {
  if (!contextItems) {
    return children;
  }

  return (
    <RadixContextMenu.Root>
      <RadixContextMenu.Trigger asChild>{children}</RadixContextMenu.Trigger>
      <RadixContextMenu.Portal>
        <RadixContextMenu.Content className="context-menu__content">
          {contextItems.map((targetItem, index) => {
            return (
              <RadixContextMenu.Item
                key={`context-item-${index}`}
                className="context-menu__item"
                onSelect={targetItem.onSelect}
              >
                {targetItem.children}
              </RadixContextMenu.Item>
            );
          })}
        </RadixContextMenu.Content>
      </RadixContextMenu.Portal>
    </RadixContextMenu.Root>
  );
};
