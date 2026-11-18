'use client';
import { forwardRef, useCallback, useEffect, useState } from 'react';

// --- Hooks ---
import { useIsBreakpoint } from '@/features/tiptap/hooks/useIsBreakpoint';
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';

// --- Lib ---
import { parseShortcutKeys } from '@/features/tiptap/lib/tiptapUtils';

// --- Tiptap UI ---
import type { UseRubyConfig } from '@/features/tiptap/components/ui/RubyTextPopover';
import {
  RUBY_TEXT_SHORTCUT_KEY,
  useRubyText,
} from '@/features/tiptap/components/ui/RubyTextPopover';

// --- UI Primitives ---
import { Badge } from '@/features/tiptap/components/ui-primitive/Badge';
import {
  Button,
  ButtonProps,
} from '@/features/tiptap/components/ui-primitive/Button';
import { ButtonGroup } from '@/features/tiptap/components/ui-primitive/ButtonGroup';
import {
  Card,
  CardBody,
  CardItemGroup,
} from '@/features/tiptap/components/ui-primitive/Card';
import { Input } from '@/features/tiptap/components/ui-primitive/Input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/features/tiptap/components/ui-primitive/Popover';
import { Separator } from '@/features/tiptap/components/ui-primitive/Separator';

// --- Icons ---
import { CornerDownLeftIcon } from '@/features/tiptap/components/icons/CornerDownLeftIcon';
import { BsTranslate, BsTrash } from 'react-icons/bs';

export interface RubyButtonPros
  extends Omit<ButtonProps, 'type'>, UseRubyConfig {
  /**
   * アイコンの横に表示する補足テキスト(任意)
   */
  text?: string;

  /**
   * ポップオーバー開閉時のコールバック関数
   * @param isOpen
   * @returns
   */
  onOpenChange?: (isOpen: boolean) => void;

  /**
   * ボタン内にショートカットキーを表示するかどうか(任意)
   * @default false
   */
  showShortcut?: boolean;

  /**
   * ルビがアクティブになったときに、ポップオーバーを自動的に開くかどうか
   * @default true
   */
  autoOpenOnRubyText?: boolean;
}

/**
 * ルビ機能ショートカットバッジ
 * @param params.shortcutKeys ショートカットキー
 */
export const RubyShorcutBadge = ({
  shortcutKeys = RUBY_TEXT_SHORTCUT_KEY,
}: {
  shortcutKeys?: string;
}) => {
  return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
};

/**
 * ルビ機能ボタン
 */
export const RubyTextButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Button
        type="button"
        className={className}
        variant="ghost"
        role="button"
        tabIndex={-1}
        aria-label="ルビ"
        tooltip="ルビ"
        ref={ref}
        {...props}
      >
        {children || <BsTranslate className="tiptap-button-icon" />}
      </Button>
    );
  }
);

RubyTextButton.displayName = 'RubyTextButton';

export interface RubyTextProps {
  /**
   * ルビテキスト
   */
  rubyText: string;

  /**
   * ルビテキストを更新するための関数
   */
  setRubyText: React.Dispatch<React.SetStateAction<string | null>>;

  /**
   * エディター内にルビを設定するための関数
   */
  setRuby: () => void;

  /**
   * エディターからルビを取り除くための関数
   */
  removeRuby: () => boolean;

  /**
   * エディターに対して、現在ルビがアクティブ状態か否か
   * @default false
   */
  isActive: boolean;
}

/**
 * ルビ機能ポップオーバーのメインコンテンツ
 */
const RubyTextMain = ({
  rubyText,
  setRubyText,
  setRuby,
  removeRuby,
  isActive,
}: RubyTextProps) => {
  const isMobile = useIsBreakpoint();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setRuby();
    }
  };

  return (
    <Card
      style={{
        ...(isMobile ? { boxShadow: 'none', border: 0 } : {}),
      }}
    >
      <CardBody
        style={{
          ...(isMobile ? { padding: 0 } : {}),
        }}
      >
        <CardItemGroup orientation="horizontal">
          <Input
            type="url"
            placeholder="ルビテキスト"
            value={rubyText}
            onChange={(e) => {
              setRubyText(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            className="tiptap-ruby-text-input"
          />

          <ButtonGroup>
            <Button
              type="button"
              onClick={setRuby}
              title="ルビ適用"
              disabled={!rubyText && !isActive}
              variant="ghost"
            >
              <CornerDownLeftIcon className="tiptap-button-icon" />
            </Button>
          </ButtonGroup>

          <Separator />

          {isActive && (
            <ButtonGroup>
              <Button
                type="button"
                onClick={removeRuby}
                title="ルビ削除"
                disabled={!rubyText && !isActive}
                variant="ghost"
              >
                <BsTrash className="tiptap-button-icon" />
              </Button>
            </ButtonGroup>
          )}
        </CardItemGroup>
      </CardBody>
    </Card>
  );
};
/**
 * Tiptapエディターのルビ機能ポップオーバーコンポーネント
 *
 * カスタムボタンを実装する場合は、代わりに `useRubyText` フックを使用してください。
 */
export const RubyTextPopover = forwardRef<HTMLButtonElement, RubyButtonPros>(
  (
    {
      editor: providedEditor,
      text,
      hideWhenUnavailable = false,
      onSetRubyText,
      showShortcut = false,
      onOpenChange,
      autoOpenOnRubyText,
      onClick,
      children,
      ...buttonProps
    },
    ref
  ) => {
    const { editor } = useTiptapEditor(providedEditor);
    const [isOpen, setIsOpen] = useState(false);
    const {
      rubyText,
      isVisible,
      setRubyText,
      setRuby,
      removeRuby,
      label,
      canSet,
      isActive,
      Icon,
      shortcutKeys,
    } = useRubyText({
      editor,
      hideWhenUnavailable,
      onSetRubyText,
    });
    const shouldAutoOpen =
      autoOpenOnRubyText && !!editor?.isFocused && isActive;

    const handleOnOpenChange = useCallback(
      (nextIsOpen: boolean) => {
        setIsOpen(nextIsOpen);
        onOpenChange?.(nextIsOpen);
      },
      [onOpenChange]
    );

    const handleSetRuby = useCallback(() => {
      setRuby();
      setIsOpen(false);
    }, [setRuby]);

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        setIsOpen(!isOpen);
      },
      [onClick, isOpen]
    );

    useEffect(() => {
      if (shouldAutoOpen) {
        setIsOpen(true);
      }
    }, [shouldAutoOpen]);

    if (!isVisible) {
      return null;
    }

    return (
      <Popover open={isOpen} onOpenChange={handleOnOpenChange}>
        <PopoverTrigger asChild>
          <RubyTextButton
            disabled={!canSet}
            data-active-state={isActive ? 'on' : 'off'}
            data-disabled={!canSet}
            aria-label={label}
            aria-pressed={isActive}
            onClick={handleClick}
            {...buttonProps}
            ref={ref}
          >
            {children ?? (
              <>
                <Icon className="tiptap-button-icon" />
                {text && <span className="tiptap-button-text">{text}</span>}
                {showShortcut && (
                  <RubyShorcutBadge shortcutKeys={shortcutKeys} />
                )}
              </>
            )}
          </RubyTextButton>
        </PopoverTrigger>

        <PopoverContent collisionPadding={4}>
          <RubyTextMain
            rubyText={rubyText}
            setRubyText={setRubyText}
            setRuby={handleSetRuby}
            removeRuby={removeRuby}
            isActive={isActive}
          />
        </PopoverContent>
      </Popover>
    );
  }
);
