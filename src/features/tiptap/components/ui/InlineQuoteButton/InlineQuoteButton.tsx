import { forwardRef, useCallback } from 'react';

// --- Hooks ---
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';

// --- Lib ---
import { parseShortcutKeys } from '@/features/tiptap/lib/tiptapUtils';

// --- Tiptap UI ---
import {
  INLINE_QUOTE_SHORTCUT_KEY,
  useInlineQuote,
  type UseInlineQuoteConfig,
} from '@/features/tiptap/components/ui/InlineQuoteButton';

// --- UI Primitives ---
import { Badge } from '@/features/tiptap/components/ui-primitive/Badge';
import type { ButtonProps } from '@/features/tiptap/components/ui-primitive/Button';
import { Button } from '@/features/tiptap/components/ui-primitive/Button';

export interface InlineQuoteButtonProps
  extends Omit<ButtonProps, 'type'>, UseInlineQuoteConfig {
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
 * インライン引用切り替えショートカットバッジ
 * @param params.shortcutKeys ショートカットキー
 */
export const InlineQuoteShorcutBadge = ({
  shortcutKeys = INLINE_QUOTE_SHORTCUT_KEY,
}: {
  shortcutKeys?: string;
}) => {
  return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
};

/**
 * Tiptapエディター内のインライン引用を切り替えるためのボタンコンポーネント
 *
 * カスタムボタンを実装する場合は、代わりに `useInlineQuote` フックを使用してください。
 */
export const InlineQuoteButton = forwardRef<
  HTMLButtonElement,
  InlineQuoteButtonProps
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
      handleInlineQuote,
      label,
      canToggle,
      isActive,
      Icon,
      shortcutKeys,
    } = useInlineQuote({
      editor,
      hideWhenUnavailable,
      onToggled,
    });
    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        handleInlineQuote();
      },
      [handleInlineQuote, onClick]
    );

    if (!isVisible) {
      return null;
    }

    return (
      <Button
        type="button"
        disabled={!canToggle}
        variant="ghost"
        data-active-state={isActive ? 'on' : 'off'}
        data-disabled={!canToggle}
        role="button"
        tabIndex={-1}
        aria-label={label}
        aria-pressed={isActive}
        tooltip={label}
        onClick={handleClick}
        {...buttonProps}
        ref={ref}
      >
        {children ?? (
          <>
            <Icon className="tiptap-button-icon" />
            {text && <span className="tiptap-button-text">{text}</span>}
            {showShortcut && (
              <InlineQuoteShorcutBadge shortcutKeys={shortcutKeys} />
            )}
          </>
        )}
      </Button>
    );
  }
);
