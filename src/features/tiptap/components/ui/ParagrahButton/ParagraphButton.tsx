import { forwardRef, useCallback } from 'react';
// --- Hooks ---
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';

// --- Lib ---
import { parseShortcutKeys } from '@/features/tiptap/lib/tiptapUtils';

// --- Tiptap UI ---
import {
  PARAGRAPH_SHORTCUT_KEY,
  useParagraph,
  type UseParagraphConfig,
} from '@/features/tiptap/components/ui/ParagrahButton';

// --- UI Primitives ---
import { Badge } from '@/features/tiptap/components/ui-primitive/Badge';
import {
  Button,
  ButtonProps,
} from '@/features/tiptap/components/ui-primitive/Button';

interface ParagraphButtonProps
  extends Omit<ButtonProps, 'type'>, UseParagraphConfig {
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
 * パラグラフ切り替えショートカットバッジ
 * @param params.shortcutKeys ショートカットキー
 */
export const ParagraphShortcutBadge = ({
  shortcutKeys = PARAGRAPH_SHORTCUT_KEY,
}: {
  shortcutKeys?: string;
}) => {
  return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
};

/**
 * Tiptapエディター内のパラグラフを切り替えるためのボタンコンポーネント
 *
 * カスタムボタンを実装する場合は、代わりに `useParagraph` フックを使用してください。
 */
export const ParagraphButton = forwardRef<
  HTMLButtonElement,
  ParagraphButtonProps
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
    } = useParagraph({
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
        tooltip="Paragraph"
        onClick={handleClick}
        {...buttonProps}
        ref={ref}
      >
        {children ?? (
          <>
            <Icon className="tiptap-button-icon" />
            {text && <span className="tiptap-button-text">{text}</span>}
            {showShortcut && (
              <ParagraphShortcutBadge shortcutKeys={shortcutKeys} />
            )}
          </>
        )}
      </Button>
    );
  }
);

ParagraphButton.displayName = 'ParagraphButton';
