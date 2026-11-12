import { CornerDownLeftIcon } from '@/features/tiptap/components/icons/CornerDownLeftIcon';
import { TrashIcon } from '@/features/tiptap/components/icons/TrashIcon';
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
import { useIsBreakpoint } from '@/features/tiptap/hooks/useIsBreakpoint';
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';
import { parseShortcutKeys } from '@/features/tiptap/lib/tiptapUtils';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import { BsTranslate } from 'react-icons/bs';
import {
  RUBY_TEXT_SHORTCUT_KEY,
  UseRubyConfig,
  useRubyTextPopover,
} from './useRubyTextPopover';

export interface RubyButtonPros
  extends Omit<ButtonProps, 'type'>, UseRubyConfig {
  onOpenChange?: (isOpen: boolean) => void;
  autoOpenOnRubyText?: boolean;
}

export const RubyShorcutBadge = ({
  shortcutKeys = RUBY_TEXT_SHORTCUT_KEY,
}: {
  shortcutKeys?: string;
}) => {
  return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
};

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
  rubyText: string;

  setRubyText: React.Dispatch<React.SetStateAction<string | null>>;

  setRuby: () => void;

  removeRuby: () => void;

  isActive: boolean;
}

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
            onChange={(e) => setRubyText(e.target.value)}
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

          <ButtonGroup>
            <Button
              type="button"
              onClick={removeRuby}
              title="ルビ削除"
              disabled={!rubyText && !isActive}
              variant="ghost"
            >
              <TrashIcon className="tiptap-button-icon" />
            </Button>
          </ButtonGroup>
        </CardItemGroup>
      </CardBody>
    </Card>
  );
};

export const RubyTextPopover = forwardRef<HTMLButtonElement, RubyButtonPros>(
  (
    {
      editor: providedEditor,
      hideWhenUnavailable = false,
      onSetRubyText,
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
    } = useRubyTextPopover({
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
            {children ?? <Icon className="tiptap-button-icon" />}
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
