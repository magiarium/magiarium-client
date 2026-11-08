import { ImageSelector } from '@/features/image/components/ImageSelector';
import type { InlineLinkAttributes } from '@/features/tiptap/components/extension/InlineLink';
import type { Editor } from '@tiptap/react';
import { forwardRef, useCallback, useEffect, useState } from 'react';

// --- Hooks ---
import { useIsBreakpoint } from '@/features/tiptap/hooks/useIsBreakpoint';
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';

// --- Icons ---
import { ExternalLinkIcon } from '@/features/tiptap/components/icons/ExternalLinkIcon';
import { LinkIcon } from '@/features/tiptap/components/icons/LinkIcon';
import { TrashIcon } from '@/features/tiptap/components/icons/TrashIcon';
// --- Tiptap UI ---
import type { UseLinkPopoverConfig } from '@/features/tiptap/components/ui/InlineLinkPopover';
import { useInlineLinkPopover } from '@/features/tiptap/components/ui/InlineLinkPopover';

// --- UI Primitives ---
import { Button as MagiariumButton } from '@/common/components/Button';
import type { ButtonProps } from '@/features/tiptap/components/ui-primitive/Button';
import { Button } from '@/features/tiptap/components/ui-primitive/Button';
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

import { BsTrash } from 'react-icons/bs';
import './InlineLinkPopover.scss';

export interface InlineLinkMainProps {
  /**
   * linkに設定するURL
   */
  inlineLinkState: InlineLinkAttributes;

  /**
   * URLの状態を更新するための関数
   */
  setInlineLinkState: React.Dispatch<
    React.SetStateAction<InlineLinkAttributes | null>
  >;

  /**
   * エディター内にインラインリンクを設定するための関数
   */
  setInlineLink: () => void;

  /**
   * エディターからインラインリンクを取り除く太目の関数
   */
  removeInlineLink: () => void;

  /**
   * リンクを開くための関数
   */
  openLink: () => void;

  /**
   * エディターに対して、現在リンクがアクティブ状態か否か
   * @default false
   */
  isActive: boolean;
}

export interface InlineLinkPopoverProps
  extends Omit<ButtonProps, 'type'>, UseLinkPopoverConfig {
  /**
   * ポップオーバー開閉時のコールバック関数
   */
  onOpenChange?: (isOpen: boolean) => void;

  /**
   * リンクがアクティブになったときに、ポップオーバーを自動的に開くかどうか
   * @default true
   */
  autoOpenOnLinkActive?: boolean;
}

/**
 * InlineLinkポップオーバーのトリガー用ボタン
 */
export const InlineLinkButton = forwardRef<HTMLButtonElement, ButtonProps>(
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
        {children || <LinkIcon className="tiptap-button-icon" />}
      </Button>
    );
  }
);

InlineLinkButton.displayName = 'InlineLinkButton';

/**
 * InlineLinkポップオーバーのメインコンテンツ
 */
const InlineLinkMain = ({
  inlineLinkState,
  setInlineLinkState,
  setInlineLink,
  removeInlineLink,
  openLink,
  isActive,
}: InlineLinkMainProps) => {
  const isMobile = useIsBreakpoint();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setInlineLink();
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
        className="tiptap-inline-link__content-container"
      >
        {inlineLinkState.href && isActive && (
          <Button
            type="button"
            onClick={removeInlineLink}
            title="Remove link"
            variant="ghost"
          >
            <TrashIcon className="tiptap-button-icon" />
          </Button>
        )}
        <CardItemGroup orientation="vertical">
          <CardItemGroup orientation="horizontal">
            <Input
              type="url"
              placeholder="Paste a link..."
              value={inlineLinkState.href}
              onChange={(e) =>
                setInlineLinkState((prev) => {
                  return {
                    ...prev,
                    href: e.target.value,
                  };
                })
              }
              onKeyDown={handleKeyDown}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              className="tiptap-inline-link__input"
            />
            <ButtonGroup>
              <Button
                type="button"
                onClick={openLink}
                title="Open in new window"
                disabled={!inlineLinkState.href && !isActive}
                variant="ghost"
              >
                <ExternalLinkIcon className="tiptap-button-icon" />
              </Button>
            </ButtonGroup>
          </CardItemGroup>
          <CardItemGroup className="tiptap-inline-link__group">
            <ImageSelector
              className="tiptap-inline-link__icon-selector"
              templates={[
                {
                  path: '/assets/images/preset/x_icon.png',
                  mimeType: 'image/png',
                  alt: 'Xアイコン',
                  fileName: 'x_icon.png',
                  size: { width: 32, height: 32 },
                  uploadedAt: '20261108122000',
                },
                {
                  path: '/assets/images/preset/youtube_icon.png',
                  mimeType: 'image/png',
                  alt: 'Youtubeアイコン',
                  fileName: 'youtube_icon.png',
                  size: { width: 32, height: 32 },
                  uploadedAt: '20261108122000',
                },
                {
                  path: '/assets/images/preset/pixiv_icon.png',
                  mimeType: 'image/png',
                  alt: 'Xアイコン',
                  fileName: 'pixiv_icon.png',
                  size: { width: 32, height: 32 },
                  uploadedAt: '20261108122000',
                },
                {
                  path: '/assets/images/preset/magiarium_icon.png',
                  mimeType: 'image/png',
                  alt: 'まぎありうむブログアイコン',
                  fileName: 'magiarium_icon.png',
                  size: { width: 32, height: 32 },
                  uploadedAt: '20261108122000',
                },
                {
                  path: '/assets/images/preset/magiarium_blog_icon.png',
                  mimeType: 'image/png',
                  alt: 'まぎありうむアイコン',
                  fileName: 'magiarium_blog_icon.png',
                  size: { width: 32, height: 32 },
                  uploadedAt: '20261108122000',
                },
              ]}
              isActive={(current) => {
                if (inlineLinkState.href === '') return false;
                return current.path === inlineLinkState.icon;
              }}
              onSelect={(imageInfo) => {
                setInlineLinkState((prev) => {
                  return {
                    ...prev,
                    href: prev?.href || '',
                    icon: imageInfo.path,
                  };
                });
              }}
            />
            {inlineLinkState.icon && inlineLinkState.icon !== '' && (
              <Button
                onClick={() => {
                  setInlineLinkState((prev) => {
                    return {
                      ...prev,
                      href: prev?.href || '',
                      icon: null,
                    };
                  });
                }}
              >
                <BsTrash />
              </Button>
            )}
          </CardItemGroup>

          <label className="tiptap-inline-link__target-selector">
            target:
            <select
              value={inlineLinkState.target ?? '_blank'}
              onChange={(event) => {
                setInlineLinkState((prev) => {
                  return {
                    ...prev,
                    href: prev?.href || '',
                    target: event.target.value,
                  };
                });
              }}
            >
              <option value="_blank">別タブ</option>
              <option value="_self">同タブ</option>
            </select>
          </label>

          <MagiariumButton
            onClick={setInlineLink}
            isDisabled={!inlineLinkState.href && !isActive}
            priority={'PRIMARY'}
          >
            決定
          </MagiariumButton>
        </CardItemGroup>
      </CardBody>
    </Card>
  );
};

/**
 * InlineLinkContentを単体で利用するためのコンポーネント
 *
 * @param editor Tiptapエディターのインスタンス
 */
export const InlineLinkContent = ({ editor }: { editor?: Editor | null }) => {
  const linkPopover = useInlineLinkPopover({
    editor,
  });

  return <InlineLinkMain {...linkPopover} />;
};

/**
 * TiptapエディターのLinkポップオーバーコンポーネント
 *
 * カスタムボタンを実装する場合は、代わりに `useInlineLinkPopover` フックを使用してください。
 */
export const InlineLinkPopover = forwardRef<
  HTMLButtonElement,
  InlineLinkPopoverProps
>(
  (
    {
      editor: providedEditor,
      hideWhenUnavailable = false,
      onSetInlineLink,
      onOpenChange,
      autoOpenOnLinkActive = true,
      onClick,
      children,
      ...buttonProps
    },
    ref
  ) => {
    const { editor } = useTiptapEditor(providedEditor);
    const [isOpen, setIsOpen] = useState(false);

    const {
      isVisible,
      canSet,
      isActive,
      inlineLinkState,
      setInlineLinkState,
      setInlineLink,
      removeInlineLink,
      openLink,
      label,
      Icon,
    } = useInlineLinkPopover({
      editor,
      hideWhenUnavailable,
      onSetInlineLink,
    });

    const shouldAutoOpen =
      autoOpenOnLinkActive && !!editor?.isFocused && isActive;

    const handleOnOpenChange = useCallback(
      (nextIsOpen: boolean) => {
        setIsOpen(nextIsOpen);
        onOpenChange?.(nextIsOpen);
      },
      [onOpenChange]
    );

    const handleSetInlineLink = useCallback(() => {
      setInlineLink();
      setIsOpen(false);
    }, [setInlineLink]);

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
          <InlineLinkButton
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
          </InlineLinkButton>
        </PopoverTrigger>

        <PopoverContent collisionPadding={10}>
          <InlineLinkMain
            inlineLinkState={inlineLinkState}
            setInlineLinkState={setInlineLinkState}
            setInlineLink={handleSetInlineLink}
            removeInlineLink={removeInlineLink}
            openLink={openLink}
            isActive={isActive}
          />
        </PopoverContent>
      </Popover>
    );
  }
);

InlineLinkPopover.displayName = 'InlineLinkPopover';
