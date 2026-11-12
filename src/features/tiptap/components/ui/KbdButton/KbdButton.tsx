import { forwardRef, useCallback } from 'react';

// --- Tiptap UI ---
import type { UseKbdConfig } from '@/features/tiptap/components/ui/KbdButton';
import {
  KBD_SHORTCUT_KEY,
  useKbdButton,
} from '@/features/tiptap/components/ui/KbdButton';

// --- Hooks ---
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';

// --- Lib ---
import { parseShortcutKeys } from '@/features/tiptap/lib/tiptapUtils';

// --- UI Primitives ---
import { Badge } from '@/features/tiptap/components/ui-primitive/Badge';
import type { ButtonProps } from '@/features/tiptap/components/ui-primitive/Button';
import { Button } from '@/features/tiptap/components/ui-primitive/Button';

export interface KbdButtonProps
  extends Omit<ButtonProps, 'type'>, UseKbdConfig {
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
 * キーボード切り替えショートカットバッジ
 * @param params.shortcutKeys ショートカットキー
 */
export const KbdShorcutBadge = ({
  shortcutKeys = KBD_SHORTCUT_KEY,
}: {
  shortcutKeys?: string;
}) => {
  return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
};

/**
 * Tiptapエディター内のキーボードを切り替えるためのボタンコンポーネント
 *
 * カスタムボタンを実装する場合は、代わりに `useKbdButton` フックを使用してください。
 */
export const KbdButton = forwardRef<HTMLButtonElement, KbdButtonProps>(
  (
    {
      editor: providedEditor,
      showShortcut,
      text,
      hideWhenUnavailable = false,
      onToggled,
      onClick,
      children,
      ...buttonProps
    },
    ref
  ) => {
    const { editor } = useTiptapEditor(providedEditor);

    const {
      isVisible,
      isActive,
      handleKbd,
      canToggle,
      label,
      shortcutKeys,
      Icon,
    } = useKbdButton({
      editor,
      hideWhenUnavailable,
    });

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        handleKbd();
      },
      [handleKbd, onClick]
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
            {showShortcut && <KbdShorcutBadge shortcutKeys={shortcutKeys} />}
          </>
        )}
      </Button>
    );
  }
);
