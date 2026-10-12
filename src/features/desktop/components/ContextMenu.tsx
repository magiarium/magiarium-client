import { ContextMenu as RadixContextMenu } from 'radix-ui';
import { BsBoxArrowUpRight, BsLink45Deg, BsWindowPlus } from 'react-icons/bs';
import './ContextMenu.scss';

/**
 * コンテキストメニュー
 */
export const ContextMenu = ({
  children,
  href,
}: {
  children: React.ReactNode;
  href?: string;
}) => {
  /**
   * 新規タブハンドラ
   */
  const handleOpenNewTab = () => {
    window.open(href, '_blank', 'noopener,noreferrer');
  };
  /**
   * 新規ウィンドウハンドラ
   */
  const handleOpenNewWindow = () => {
    window.open(
      href,
      '_blank',
      'noopener,noreferrer,popup,width=1200,height=800'
    );
  };
  /**
   * コピーアドレスハンドラ
   */
  const handleCopyAddress = async () => {
    try {
      const fullUrl = new URL(href ?? '', window.location.origin).href;
      await navigator.clipboard.writeText(fullUrl);
    } catch (error) {
      console.error('リンクのコピーに失敗しました:', error);
    }
  };

  return (
    <RadixContextMenu.Root>
      <RadixContextMenu.Trigger asChild>{children}</RadixContextMenu.Trigger>

      <RadixContextMenu.Portal>
        <RadixContextMenu.Content className="context-menu__content">
          <RadixContextMenu.Item
            className="context-menu__item"
            onSelect={handleOpenNewTab}
          >
            <BsBoxArrowUpRight />
            <span>新しいタブで開く</span>
          </RadixContextMenu.Item>

          <RadixContextMenu.Item
            className="context-menu__item"
            onSelect={handleOpenNewWindow}
          >
            <BsWindowPlus />
            <span>新しいウィンドウで開く</span>
          </RadixContextMenu.Item>

          <RadixContextMenu.Item
            className="context-menu__item"
            onSelect={handleCopyAddress}
          >
            <BsLink45Deg />
            <span>リンクのアドレスをコピー</span>
          </RadixContextMenu.Item>
        </RadixContextMenu.Content>
      </RadixContextMenu.Portal>
    </RadixContextMenu.Root>
  );
};
