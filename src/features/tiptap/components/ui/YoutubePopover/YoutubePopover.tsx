import { useIsBreakpoint } from '@/features/tiptap/hooks/useIsBreakpoint';
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import { BsYoutube } from 'react-icons/bs';
import { ChevronDownIcon } from '../../icons/ChevronDownIcon';
import { CornerDownLeftIcon } from '../../icons/CornerDownLeftIcon';
import { ExternalLinkIcon } from '../../icons/ExternalLinkIcon';
import { Button, ButtonProps } from '../../ui-primitive/Button';
import { ButtonGroup } from '../../ui-primitive/ButtonGroup';
import { Card, CardBody, CardItemGroup } from '../../ui-primitive/Card';
import { Input } from '../../ui-primitive/Input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../ui-primitive/Popover';
import { Separator } from '../../ui-primitive/Separator';
import {
  useYoutube,
  UseYoutubeConfig,
  YOUTUBE_DEFAULT_SIZE,
  YoutubeAttributes,
} from './useYoutube';

export interface YoutubePopoverProps
  extends Omit<ButtonProps, 'type'>, UseYoutubeConfig {
  text?: string;
  onOpenChange?: (isOpen: boolean) => void;
  autoOpenOnYoutubeActive?: boolean;
  modal?: boolean;
}

export const YoutubeButton = forwardRef<HTMLButtonElement, ButtonProps>(
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
        {children || <BsYoutube className="tiptap-button-icon" />}
      </Button>
    );
  }
);

export interface YoutubeMainProps {
  youtubeState: YoutubeAttributes;
  setYoutubeState: React.Dispatch<
    React.SetStateAction<YoutubeAttributes | null>
  >;
  setYoutube: () => void;
  openYoutube: () => void;
  isActive: boolean;
}

export const YoutubeMain = ({
  youtubeState,
  setYoutubeState,
  setYoutube,
  openYoutube,
  isActive,
}: YoutubeMainProps) => {
  const isMobile = useIsBreakpoint();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setYoutube();
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
          <label>
            縦：
            <Input
              type="number"
              placeholder="動画縦幅"
              value={youtubeState.src}
              onChange={(e) =>
                setYoutubeState((prev) => {
                  return {
                    src: prev?.src ?? '',
                    width: prev?.width ?? YOUTUBE_DEFAULT_SIZE.width,
                    height: Number(e.target.value),
                  };
                })
              }
              onKeyDown={handleKeyDown}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              className="tiptap-youtube-height-input"
            />
          </label>

          <label>
            横：
            <Input
              type="url"
              placeholder="動画横幅"
              value={youtubeState.src}
              onChange={(e) =>
                setYoutubeState((prev) => {
                  return {
                    src: prev?.src ?? '',
                    width: Number(e.target.value),
                    height: prev?.height ?? YOUTUBE_DEFAULT_SIZE.height,
                  };
                })
              }
              onKeyDown={handleKeyDown}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              className="tiptap-youtube-width-input"
            />
          </label>

          <Input
            type="url"
            placeholder="URLリンクを貼ってください。"
            value={youtubeState.src}
            onChange={(e) =>
              setYoutubeState((prev) => {
                return {
                  src: e.target.value,
                  width: prev?.width ?? YOUTUBE_DEFAULT_SIZE.width,
                  height: prev?.height ?? YOUTUBE_DEFAULT_SIZE.height,
                };
              })
            }
            onKeyDown={handleKeyDown}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            className="tiptap-youtube-link-input"
          />
        </CardItemGroup>
        <ButtonGroup>
          <Button
            type="button"
            onClick={setYoutube}
            title="Apply link"
            disabled={!youtubeState.src && !isActive}
            variant="ghost"
          >
            <CornerDownLeftIcon className="tiptap-button-icon" />
          </Button>
        </ButtonGroup>

        <Separator />

        <ButtonGroup>
          <ButtonGroup>
            <Button
              type="button"
              onClick={openYoutube}
              title="Open in new window"
              disabled={!youtubeState.src && !isActive}
              variant="ghost"
            >
              <ExternalLinkIcon className="tiptap-button-icon" />
            </Button>
          </ButtonGroup>
        </ButtonGroup>
      </CardBody>
    </Card>
  );
};

export const YoutubePopover = forwardRef<
  HTMLButtonElement,
  YoutubePopoverProps
>(
  (
    {
      editor: providedEditor,
      modal = true,
      text,
      hideWhenUnavailable = false,
      onSetYoutube,
      onOpenChange,
      autoOpenOnYoutubeActive = true,
      onClick,
      children,
      ...buttonProps
    },
    ref
  ) => {
    const { editor } = useTiptapEditor(providedEditor);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const {
      isVisible,
      canSet,
      isActive,
      youtubeState,
      setYoutubeState,
      setYoutube,
      openYoutube,
      label,
      Icon,
    } = useYoutube({
      editor,
      hideWhenUnavailable,
      onSetYoutube,
    });

    const shouldAutoOpen =
      autoOpenOnYoutubeActive && !!editor?.isFocused && isActive;

    const handleOnOpenChange = useCallback(
      (nextIsOpen: boolean) => {
        setIsOpen(nextIsOpen);
        onOpenChange?.(nextIsOpen);
      },
      [onOpenChange]
    );

    const handleSetYoutube = useCallback(() => {
      setYoutube();
      setIsOpen(false);
    }, [setYoutube]);

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
          <YoutubeButton
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
              </>
            )}
          </YoutubeButton>
        </PopoverTrigger>

        <PopoverContent collisionPadding={10}>
          <YoutubeMain
            youtubeState={youtubeState}
            setYoutubeState={setYoutubeState}
            setYoutube={handleSetYoutube}
            openYoutube={openYoutube}
            isActive={isActive}
          />
        </PopoverContent>
      </Popover>
    );
  }
);

YoutubePopover.displayName = 'YoutubePopover';

export default YoutubePopover;
