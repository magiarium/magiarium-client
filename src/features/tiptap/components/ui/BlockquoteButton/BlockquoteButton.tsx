import { forwardRef, useCallback } from 'react';

// --- Tiptap UI ---
import type { UseBlockquoteConfig } from '@/features/tiptap/components/ui/BlockquoteButton';
import {
  BLOCKQUOTE_SHORTCUT_KEY,
  useBlockquote,
} from '@/features/tiptap/components/ui/BlockquoteButton';

// --- Hooks ---
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';

// --- Lib ---
import { parseShortcutKeys } from '@/features/tiptap/lib/tiptapUtils';

// --- UI Primitives ---
import { Badge } from '@/features/tiptap/components/ui-primitive/Badge';
import type { ButtonProps } from '@/features/tiptap/components/ui-primitive/Button';
import { Button } from '@/features/tiptap/components/ui-primitive/Button';

export interface BlockquoteButtonProps
  extends Omit<ButtonProps, 'type'>, UseBlockquoteConfig {
  /**
   * アイコンの横に表示する補足テキスト(任意)
   */
  text?: string;

  /**
   * ボタン内にショートカットキーを表示するかどうか(任意)
   * @default false
   */
  showShortcut?: boolean;
}

/**
 * 引用ブロック切り替えショートカットバッジ
 * @param params.shortcutKeys ショートカットキー
 */
export const BlockquoteShortcutBadge = ({
  shortcutKeys = BLOCKQUOTE_SHORTCUT_KEY,
}: {
  shortcutKeys?: string;
}) => {
  return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
};

/**
 * Tiptapエディター内の引用ブロックを切り替えるためのボタンコンポーネント
 *
 * カスタムボタンを実装する場合は、代わりに `useBlockquote` フックを使用してください。
 */
export const BlockquoteButton = forwardRef<
  HTMLButtonElement,
  BlockquoteButtonProps
>(
  (
    {
      editor: providedEditor,
      text,
      hideWhenUnavailable = false,
      onToggled,
      showShortcut = false,
      onClick,
      children,
      ...buttonProps
    },
    ref
  ) => {
    const { editor } = useTiptapEditor(providedEditor);
    const {
      isVisible,
      canToggle,
      isActive,
      handleToggle,
      label,
      shortcutKeys,
      Icon,
    } = useBlockquote({
      editor,
      hideWhenUnavailable,
      onToggled,
    });

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        handleToggle();
      },
      [handleToggle, onClick]
    );

    if (!isVisible) {
      return null;
    }

    return (
      <Button
        type="button"
        variant="ghost"
        data-active-state={isActive ? 'on' : 'off'}
        role="button"
        tabIndex={-1}
        disabled={!canToggle}
        data-disabled={!canToggle}
        aria-label={label}
        aria-pressed={isActive}
        tooltip="Blockquote"
        onClick={handleClick}
        {...buttonProps}
        ref={ref}
      >
        {children ?? (
          <>
            <Icon className="tiptap-button-icon" />
            {text && <span className="tiptap-button-text">{text}</span>}
            {showShortcut && (
              <BlockquoteShortcutBadge shortcutKeys={shortcutKeys} />
            )}
          </>
        )}
      </Button>
    );
  }
);

BlockquoteButton.displayName = 'BlockquoteButton';
