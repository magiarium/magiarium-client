import { ImageSelector } from '@/features/image/components/ImageSelector';
import { useIsBreakpoint } from '@/features/tiptap/hooks/useIsBreakpoint';
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';
import { parseShortcutKeys } from '@/features/tiptap/lib/tiptapUtils';
import { ImageMetadata } from '@magiarium/structure';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import { BsCardText, BsWindow } from 'react-icons/bs';
import { LinkCardAttributes } from '../../extension/LinkCard';
import { ChevronDownIcon } from '../../icons/ChevronDownIcon';
import { CornerDownLeftIcon } from '../../icons/CornerDownLeftIcon';
import { ExternalLinkIcon } from '../../icons/ExternalLinkIcon';
import { TrashIcon } from '../../icons/TrashIcon';
import { Badge } from '../../ui-primitive/Badge';
import { Button, ButtonProps } from '../../ui-primitive/Button';
import { ButtonGroup } from '../../ui-primitive/ButtonGroup';
import { Card, CardItemGroup } from '../../ui-primitive/Card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui-primitive/DropdownMenu';
import { Input } from '../../ui-primitive/Input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../ui-primitive/Popover';
import {
  LINKCARD_SHORTCUT_KEY,
  useLinkCard,
  UseLinkCardConfig,
} from './useLinkCard';

export interface LinkCardButtonProps
  extends Omit<ButtonProps, 'type'>, UseLinkCardConfig {
  text?: string;
  showShortcut?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  modal?: boolean;
  autoOpenOnCharacterSpeechActive?: boolean;
}
export const LinkCardShortcutBadge = ({
  shortcutKeys = LINKCARD_SHORTCUT_KEY,
}: {
  shortcutKeys?: string;
}) => {
  return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
};

export const LinkCardButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Button
        type="button"
        className={className}
        variant="ghost"
        role="button"
        tabIndex={-1}
        aria-label="Link"
        tooltip="Link"
        ref={ref}
        {...props}
      >
        {children || <BsCardText className="tiptap-button-icon" />}
      </Button>
    );
  }
);
LinkCardButton.displayName = 'LinkCardButton';

export interface LinkCardProps {
  linkCardState: LinkCardAttributes;
  setLinkCardState: React.Dispatch<
    React.SetStateAction<LinkCardAttributes | null>
  >;
  setLinkCard: () => void;
  insertLinkCard: () => void;
  removeLinkCard: () => void;
  openLink: () => void;
  isActive: boolean;
}

export const LinkCardPopoverContent = ({
  linkCardState,
  setLinkCardState,
  setLinkCard,
  insertLinkCard,
  removeLinkCard,
  openLink,
  isActive,
}: LinkCardProps) => {
  const isMobile = useIsBreakpoint();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setLinkCard();
    }
  };

  return (
    <Card
      style={{
        ...(isMobile ? { boxShadow: 'none', border: 0 } : {}),
      }}
    >
      <CardItemGroup>
        <Input
          type="url"
          placeholder="リンクURLを入力してください。"
          value={linkCardState.linkUrl}
          onChange={(e) =>
            setLinkCardState((prev) => {
              return {
                thumbnailUrl: prev?.thumbnailUrl || '',
                linkUrl: e.target.value,
                title: prev?.title || '',
                target: prev?.target || '_blank',
              };
            })
          }
          onKeyDown={handleKeyDown}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          className="tiptap-linkcard-url-input"
        />
        <ButtonGroup>
          <Button
            type="button"
            onClick={openLink}
            title="Open in new window"
            disabled={!linkCardState.linkUrl && !isActive}
            variant="ghost"
          >
            <ExternalLinkIcon className="tiptap-button-icon" />
          </Button>
        </ButtonGroup>
      </CardItemGroup>
      <CardItemGroup>
        <ImageSelector
          templates={[]}
          onSelect={(next: ImageMetadata) => {
            setLinkCardState((prev) => {
              return {
                thumbnailUrl: next?.path || '',
                linkUrl: prev?.linkUrl || '',
                title: prev?.title || '',
                target: prev?.target || '_blank',
              };
            });
          }}
        />
        <Input
          type="text"
          placeholder="リンク先のタイトルを入力してください"
          value={linkCardState.title}
          onChange={(e) =>
            setLinkCardState((prev) => {
              return {
                thumbnailUrl: prev?.thumbnailUrl || '',
                linkUrl: prev?.linkUrl || '',
                title: e.target.value,
                target: prev?.target || '_blank',
              };
            })
          }
          onKeyDown={handleKeyDown}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          className="tiptap-linkcard-title-input"
        />
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button>
              <BsWindow />
              target
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="start">
            <DropdownMenuItem asChild>
              <Button
                type="button"
                variant="ghost"
                role="button"
                data-active-state={
                  linkCardState.target === '_blank' ? 'on' : 'off'
                }
                tabIndex={-1}
                aria-label="target is _blank"
                value="_blank"
                onChange={() =>
                  setLinkCardState((prev) => {
                    return {
                      thumbnailUrl: prev?.thumbnailUrl || '',
                      linkUrl: prev?.linkUrl || '',
                      title: prev?.title || '',
                      target: '_blank',
                    };
                  })
                }
              >
                別ウィンドウ
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Button
                type="button"
                variant="ghost"
                role="button"
                data-active-state={
                  linkCardState.target === '_self' ? 'on' : 'off'
                }
                tabIndex={-1}
                aria-label="target is _self"
                value="_self"
                onChange={() =>
                  setLinkCardState((prev) => {
                    return {
                      thumbnailUrl: prev?.thumbnailUrl || '',
                      linkUrl: prev?.linkUrl || '',
                      title: prev?.title || '',
                      target: '_self',
                    };
                  })
                }
              >
                同ウィンドウ
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardItemGroup>

      <CardItemGroup>
        <Button
          type="button"
          onClick={removeLinkCard}
          title="Remove LinkCard"
          disabled={!linkCardState && !isActive}
          variant="ghost"
        >
          <TrashIcon className="tiptap-button-icon" />
        </Button>
        <Button
          type="button"
          onClick={() => {
            if (linkCardState) {
              setLinkCard();
            } else {
              insertLinkCard();
            }
          }}
          title="Apply link"
          disabled={!isActive}
          variant="ghost"
        >
          <CornerDownLeftIcon className="tiptap-button-icon" />
        </Button>
      </CardItemGroup>
    </Card>
  );
};

export const LinkCardPopover = forwardRef<
  HTMLButtonElement,
  LinkCardButtonProps
>(
  (
    {
      editor: providedEditor,
      modal = true,
      hideWhenUnavailable = false,
      onSetLinkCard,
      onOpenChange,
      text,
      autoOpenOnCharacterSpeechActive = true,
      showShortcut = false,
      onClick,
      children,
      ...buttonProps
    },
    ref
  ) => {
    const { editor } = useTiptapEditor(providedEditor);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const {
      shortcutKeys,
      isVisible,
      canSet,
      isActive,
      label,
      Icon,
      linkCardState,
      setLinkCardState,
      setLinkCard,
      insertLinkCard,
      removeLinkCard,
      openLink,
    } = useLinkCard({
      editor,
      hideWhenUnavailable,
      onSetLinkCard,
    });

    const shouldAutoOpen =
      autoOpenOnCharacterSpeechActive && !!editor?.isFocused && isActive;

    const handleOnOpenChange = useCallback(
      (nextIsOpen: boolean) => {
        setIsOpen(nextIsOpen);
        onOpenChange?.(nextIsOpen);
      },
      [onOpenChange]
    );

    const handleSetLinkCard = useCallback(() => {
      setLinkCard();
      setIsOpen(false);
    }, [setLinkCard]);

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
      <Popover open={isOpen} onOpenChange={handleOnOpenChange} modal={modal}>
        <PopoverTrigger asChild>
          <LinkCardButton
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
                <ChevronDownIcon className="tiptap-button-dropdown-small" />
                {showShortcut && (
                  <LinkCardShortcutBadge shortcutKeys={shortcutKeys} />
                )}
              </>
            )}
          </LinkCardButton>
        </PopoverTrigger>
        <PopoverContent>
          <LinkCardPopoverContent
            linkCardState={linkCardState}
            setLinkCardState={setLinkCardState}
            setLinkCard={handleSetLinkCard}
            removeLinkCard={removeLinkCard}
            insertLinkCard={insertLinkCard}
            openLink={openLink}
            isActive={isActive}
          />
        </PopoverContent>
      </Popover>
    );
  }
);
