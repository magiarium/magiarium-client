import { forwardRef } from 'react';

// --- Hooks ---
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';

// --- UI Primitives ---
import { Badge } from '@/features/tiptap/components/ui-primitive/Badge';
import {
  Button,
  ButtonProps,
} from '@/features/tiptap/components/ui-primitive/Button';

// --- Tiptap UI ---
import type { UseLinkCardConfig } from '@/features/tiptap/components/ui/LinkCardButton';
import {
  LINKCARD_SHORTCUT_KEY,
  useLinkCard,
} from '@/features/tiptap/components/ui/LinkCardButton';

// ---Libs
import { parseShortcutKeys } from '@/features/tiptap/lib/tiptapUtils';

export interface LinkCardButtonProps
  extends Omit<ButtonProps, 'type'>, UseLinkCardConfig {
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
 * LinkCardポップオーバーのショートカットキーバッジ
 */
export const LinkCardShortcutBadge = ({
  shortcutKeys = LINKCARD_SHORTCUT_KEY,
}: {
  shortcutKeys?: string;
}) => {
  return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
};

/**
 * TiptapエディターのLinkCardボタンコンポーネント
 *
 * カスタムボタンを実装する場合は、代わりに `useLinkCard` フックを使用してください。
 */
export const LinkCardButton = forwardRef<
  HTMLButtonElement,
  LinkCardButtonProps
>(
  (
    {
      editor: providedEditor,
      hideWhenUnavailable = false,
      onSetLinkCard,
      text,
      showShortcut = false,
      onClick,
      children,
      ...buttonProps
    },
    ref
  ) => {
    const { editor } = useTiptapEditor(providedEditor);

    const {
      shortcutKeys,
      isVisible,
      canSet,
      isActive,
      label,
      Icon,
      setLinkCard,
    } = useLinkCard({
      editor,
      hideWhenUnavailable,
      onSetLinkCard,
    });

    if (!isVisible) {
      return null;
    }

    return (
      <Button
        type="button"
        disabled={!canSet}
        variant="ghost"
        data-active-state={isActive ? 'on' : 'off'}
        data-disabled={!canSet}
        role="button"
        tabIndex={-1}
        aria-label={label}
        aria-pressed={isActive}
        tooltip={label}
        onClick={() => setLinkCard()}
        {...buttonProps}
        ref={ref}
      >
        {children ?? (
          <>
            <Icon className="tiptap-button-icon" />
            {text && <span className="tiptap-button-text">{text}</span>}
            {showShortcut && (
              <LinkCardShortcutBadge shortcutKeys={shortcutKeys} />
            )}
          </>
        )}
      </Button>
    );
  }
);
