import { forwardRef, useCallback } from 'react';

// --- Lib ---
import { parseShortcutKeys } from '@/features/tiptap/lib/tiptapUtils';

// --- Hooks ---
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';

// --- Tiptap UI ---
import type {
  Level,
  UseHeadingConfig,
} from '@/features/tiptap/components/ui/HeadingButton';
import {
  HEADING_SHORTCUT_KEYS,
  useHeading,
} from '@/features/tiptap/components/ui/HeadingButton';

// --- UI Primitives ---
import { Badge } from '@/features/tiptap/components/ui-primitive/Badge';
import type { ButtonProps } from '@/features/tiptap/components/ui-primitive/Button';
import { Button } from '@/features/tiptap/components/ui-primitive/Button';

export interface HeadingButtonProps
  extends Omit<ButtonProps, 'type'>, UseHeadingConfig {
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
 * 見出し切り替えショートカットバッジ
 * @param params.shortcutKeys ショートカットキー
 */
export const HeadingShortcutBadge = ({
  level,
  shortcutKeys = HEADING_SHORTCUT_KEYS[level],
}: {
  level: Level;
  shortcutKeys?: string;
}) => {
  return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
};

/**
 * Tiptapエディター内のパラグラフを切り替えるためのボタンコンポーネント
 *
 * カスタムボタンを実装する場合は、代わりに `useHeading` フックを使用してください。
 */
export const HeadingButton = forwardRef<HTMLButtonElement, HeadingButtonProps>(
  (
    {
      editor: providedEditor,
      level,
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
      Icon,
      shortcutKeys,
    } = useHeading({
      editor,
      level,
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
              <HeadingShortcutBadge level={level} shortcutKeys={shortcutKeys} />
            )}
          </>
        )}
      </Button>
    );
  }
);

HeadingButton.displayName = 'HeadingButton';
