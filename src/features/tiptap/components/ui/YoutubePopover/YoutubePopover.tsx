import { Button as MagiariumButton } from '@/common/components/Button';
import { forwardRef, useCallback, useState } from 'react';

// --- Hooks ---
import { useIsBreakpoint } from '@/features/tiptap/hooks/useIsBreakpoint';
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';
// --- Icons ---
import { ChevronDownIcon } from '@/features/tiptap/components/icons/ChevronDownIcon';
import { ExternalLinkIcon } from '@/features/tiptap/components/icons/ExternalLinkIcon';
import { BsYoutube } from 'react-icons/bs';

// --- Tiptap UI ---
import {
  SetYoutubeVideoOptions,
  useYoutube,
  UseYoutubeConfig,
  YOUTUBE_DEFAULT_SIZE,
} from '@/features/tiptap/components/ui/YoutubePopover';

// --- UI Primitives ---
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

// --- Style
import './YoutubePopover.scss';

export interface YoutubePopoverProps
  extends Omit<ButtonProps, 'type'>, UseYoutubeConfig {
  /**
   * アイコンの横に表示する補足テキスト(任意)
   */
  text?: string;

  /**
   * ポップオーバー開閉時に呼び出されるコールバック関数
   * @param isOpen 開閉状態
   */
  onOpenChange?: (isOpen: boolean) => void;

  /**
   * ポップオーバーをモーダルにするか
   * @default false
   */
  modal?: boolean;
}

/**
 * Youtubeボタン
 */
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
  /**
   * youtubeNode設定
   */
  youtubeState: SetYoutubeVideoOptions;

  /**
   * youtubeNode設定更新用
   */
  setYoutubeState: React.Dispatch<
    React.SetStateAction<SetYoutubeVideoOptions | null>
  >;
  /**
   * エディター内にYoutubeを設定するための関数
   */
  setYoutube: () => void;
  /**
   * 設定したYoutubeリンクURLを実際に開く処理
   */
  openYoutube: () => void;
  /**
   * エディターのYoutubeが現在アクティブ状態か否か
   * @default false
   */
  isActive: boolean;
}
/**
 * Youtubeポップオーバーメインコンテンツ
 */
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
        className="tiptap-youtube-popover__content-container"
        style={{
          ...(isMobile ? { padding: 0 } : {}),
        }}
      >
        <CardItemGroup orientation="horizontal">
          <Input
            type="url"
            className="tiptap-youtube-popover__input"
            placeholder="URLリンクを貼ってください。"
            value={youtubeState.src ?? ''}
            onChange={(e) =>
              setYoutubeState((prev) => {
                return {
                  ...prev,
                  src: e.target.value,
                };
              })
            }
            onKeyDown={handleKeyDown}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
          <ButtonGroup>
            <Button
              type="button"
              onClick={openYoutube}
              title="別ウィンドウで動画を開く"
              disabled={!youtubeState.src && !isActive}
              variant="ghost"
            >
              <ExternalLinkIcon className="tiptap-button-icon" />
            </Button>
          </ButtonGroup>
        </CardItemGroup>

        <CardItemGroup
          orientation="horizontal"
          className="tiptap-youtube-popover__group"
        >
          <label>
            縦：
            <Input
              type="number"
              className="tiptap-youtube-popover__input"
              placeholder="動画縦幅"
              value={youtubeState.height ?? YOUTUBE_DEFAULT_SIZE.height}
              onChange={(e) =>
                setYoutubeState((prev) => {
                  return {
                    ...prev,
                    src: prev?.src ?? '',
                    height: Number(e.target.value),
                  };
                })
              }
              onKeyDown={handleKeyDown}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
            />
          </label>

          <label>
            横：
            <Input
              type="number"
              className="tiptap-youtube-popover__input"
              placeholder="動画横幅"
              value={youtubeState.width ?? YOUTUBE_DEFAULT_SIZE.width}
              onChange={(e) =>
                setYoutubeState((prev) => {
                  return {
                    ...prev,
                    src: prev?.src ?? '',
                    width: Number(e.target.value),
                  };
                })
              }
              onKeyDown={handleKeyDown}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
            />
          </label>
        </CardItemGroup>
        <ButtonGroup className="tiptap-youtube-popover__footer">
          <MagiariumButton type="button" onClick={setYoutube}>
            Youtube追加
          </MagiariumButton>
        </ButtonGroup>
      </CardBody>
    </Card>
  );
};

/**
 * TiptapエディターのYoutubeポップオーバーコンポーネント
 *
 * カスタムボタンを実装する場合は、代わりに `useYoutube` フックを使用してください。
 */
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
