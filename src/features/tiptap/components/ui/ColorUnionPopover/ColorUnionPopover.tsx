import { PopoverContent } from '@radix-ui/react-popover';
import { type Editor } from '@tiptap/react';
import { forwardRef, useMemo, useRef, useState } from 'react';
import { BsPalette } from 'react-icons/bs';

// --- Hooks ---
import { useIsBreakpoint } from '@/features/tiptap/hooks/useIsBreakpoint';
import { useMenuNavigation } from '@/features/tiptap/hooks/useMenuNavigation';
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';

// --- Icons ---
import { BanIcon } from '@/features/tiptap/components/icons/BanIcon';
import { ChevronDownIcon } from '@/features/tiptap/components/icons/ChevronDownIcon';

// --- UI Primitives ---
import type { ButtonProps } from '@/features/tiptap/components/ui-primitive/Button';
import { Button } from '@/features/tiptap/components/ui-primitive/Button';
import { ButtonGroup } from '@/features/tiptap/components/ui-primitive/ButtonGroup';
import {
  Card,
  CardBody,
  CardItemGroup,
} from '@/features/tiptap/components/ui-primitive/Card';
import {
  Popover,
  PopoverTrigger,
} from '@/features/tiptap/components/ui-primitive/Popover';
import { Separator } from '@/features/tiptap/components/ui-primitive/Separator';

// --- Tiptap UI ---
import type {
  HighlightColor,
  UseColorHighlightConfig,
} from '@/features/tiptap/components/ui/ColorHighlightButton';
import {
  pickHighlightColorsByValue,
  useColorHighlight,
} from '@/features/tiptap/components/ui/ColorHighlightButton';
import { ColorHighlightPopoverContent } from '@/features/tiptap/components/ui/ColorHighlightPopover';
import {
  ColorUnion,
  ColorUnionButton,
  pickColorUnionByValue,
} from '@/features/tiptap/components/ui/ColorUnionButton';
import type {
  FontColor,
  UseFontColorConfig,
} from '@/features/tiptap/components/ui/FontColorButton';
import {
  pickFontColorByValue,
  useFontColor,
} from '@/features/tiptap/components/ui/FontColorButton';
import { FontColorPopoverContent } from '@/features/tiptap/components/ui/FontColorPopover';

export interface ColorUnionPopoverContentProps {
  /**
   * Tiptapエディターのインスタンス
   */
  editor: Editor | null;

  /**
   * ユニオンカラーポップオーバーで使用することのできるユニオンカラーの一覧
   * 指定しない場合はデフォルトのカラーセットが設定される。
   */
  colorUnions?: ColorUnion[];

  /**
   * true の場合、CSS変数（value）ではなく、実際の色の値（colorValue）を使用します。
   * @default false
   */
  useColorValue?: boolean;
}

export interface ColorUnionPopoverProps extends Omit<ButtonProps, 'type'> {
  /**
   * Tiptapエディターのインスタンス
   */
  editor: Editor;
  /**
   * フォントカラー
   */
  fontColor?: Pick<UseFontColorConfig, 'hideWhenUnavailable' | 'onApplied'> & {
    colors?: FontColor[];
    useColorValue?: boolean;
  };
  /**
   * ハイライトカラー
   */
  highlight?: Pick<
    UseColorHighlightConfig,
    'hideWhenUnavailable' | 'onApplied'
  > & { colors?: HighlightColor[]; useColorValue?: boolean };
  /**
   * カラーユニオンの一覧
   */
  colorUnions?: ColorUnion[];
}

/**
 * カラーユニオンポップオーバーボタン
 */
export const ColorUnionPopoverButton = forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({ className, children, ...props }, ref) => (
  <Button
    type="button"
    className={className}
    variant="ghost"
    data-appearance="default"
    role="button"
    tabIndex={-1}
    aria-label="FontColor"
    tooltip="FontColor"
    ref={ref}
    {...props}
  >
    {children ?? (
      <>
        <BsPalette className="tiptap-button-icon" />
        <ChevronDownIcon className="tiptap-button-dropdown-small" />
      </>
    )}
  </Button>
));

/**
 * カラーユニオンポップオーバーコンテンツ
 */
export const ColorUnionPopoverContent = ({
  editor,
  colorUnions = pickColorUnionByValue([
    {
      label: 'Important',
      fontColor: 'var(--tt-color-text-red)',
      highlightColor: 'var(--tt-color-highlight-red)',
    },
    {
      label: 'Warning',
      fontColor: 'var(--tt-color-text-orange)',
      highlightColor: 'var(--tt-color-highlight-orange)',
    },
    {
      label: 'Success',
      fontColor: 'var(--tt-color-text-green)',
      highlightColor: 'var(--tt-color-highlight-green)',
    },
    {
      label: 'Info',
      fontColor: 'var(--tt-color-text-blue)',
      highlightColor: 'var(--tt-color-highlight-blue)',
    },
    {
      label: 'Notice',
      fontColor: 'var(--tt-color-text-pink)',
      highlightColor: 'var(--tt-color-highlight-pink)',
    },
    {
      label: 'Highlight',
      fontColor: 'var(--tt-color-text-yellow)',
      highlightColor: 'var(--tt-color-highlight-yellow)',
    },
    {
      label: 'Note',
      fontColor: 'var(--tt-color-text-brown)',
      highlightColor: 'var(--tt-color-highlight-brown)',
    },
    {
      label: 'Secondary',
      fontColor: 'var(--tt-color-text-gray)',
      highlightColor: 'var(--tt-color-highlight-gray)',
    },
    {
      label: 'Special',
      fontColor: 'var(--tt-color-text-purple)',
      highlightColor: 'var(--tt-color-highlight-purple)',
    },
  ]),
  useColorValue,
}: ColorUnionPopoverContentProps) => {
  const { handleRemoveFontColor } = useFontColor({ editor });
  const { handleRemoveHighlight } = useColorHighlight({ editor });
  const isMobile = useIsBreakpoint();
  const containerRef = useRef<HTMLDivElement>(null);

  const menuItems = useMemo(
    () => [
      ...colorUnions,
      {
        label: 'Remove highlightColor & fontColor',
        fontColor: 'none',
        highlightColor: 'none',
      },
    ],
    [colorUnions]
  );

  const { selectedIndex } = useMenuNavigation({
    containerRef,
    items: menuItems,
    orientation: 'both',
    onSelect: (item) => {
      if (!containerRef.current) return false;
      const selectedColorElement = containerRef.current.querySelector(
        '[data-color="true",data-highlight-color="true"]'
      ) as HTMLElement;
      if (selectedColorElement) selectedColorElement.click();
      if (item.fontColor === 'none' && item.highlightColor === 'none')
        handleRemoveFontColor();
      return true;
    },
    autoSelectFirstItem: false,
  });

  return (
    <Card
      ref={containerRef}
      tabIndex={0}
      style={isMobile ? { boxShadow: 'none', border: 0 } : {}}
    >
      <CardBody style={isMobile ? { padding: 0 } : {}}>
        <CardItemGroup orientation="horizontal">
          <ButtonGroup>
            {colorUnions.map((colorUnion, index) => (
              <ButtonGroup
                key={`${colorUnion.fontColor}:${colorUnion.highlightColor}`}
              >
                <ColorUnionButton
                  editor={editor}
                  font={{ color: colorUnion.fontColor }}
                  highlight={{ color: colorUnion.highlightColor }}
                  tooltip={colorUnion.label}
                  aria-label={`${colorUnion.fontColor}:${colorUnion.highlightColor}`}
                  tabIndex={index === selectedIndex ? 0 : -1}
                  data-highlighted={selectedIndex === index}
                  useColorValue={useColorValue}
                />
              </ButtonGroup>
            ))}
          </ButtonGroup>
          <Separator />
          <ButtonGroup>
            <Button
              onClick={() => {
                handleRemoveFontColor();
                handleRemoveHighlight();
              }}
              aria-label="Remove color"
              tooltip="Remove color"
              tabIndex={selectedIndex === colorUnions.length ? 0 : -1}
              type="button"
              role="menuitem"
              variant="ghost"
              data-highlighted={selectedIndex === colorUnions.length}
            >
              <BanIcon className="tiptap-button-icon" />
            </Button>
          </ButtonGroup>
        </CardItemGroup>
      </CardBody>
    </Card>
  );
};

/**
 * カラーユニオンポップオーバー
 */
export const ColorUnionPopover = ({
  editor: providedEditor,
  fontColor = {
    colors: pickFontColorByValue([
      'var(--tt-color-text-red)',
      'var(--tt-color-text-orange)',
      'var(--tt-color-text-green)',
      'var(--tt-color-text-blue)',
      'var(--tt-color-text-pink)',
      'var(--tt-color-text-yellow)',
      'var(--tt-color-text-brown)',
      'var(--tt-color-text-gray)',
      'var(--tt-color-text-purple)',
    ]),
    hideWhenUnavailable: false,
    useColorValue: false,
  },
  highlight = {
    colors: pickHighlightColorsByValue([
      'var(--tt-color-highlight-red)',
      'var(--tt-color-highlight-orange)',
      'var(--tt-color-highlight-green)',
      'var(--tt-color-highlight-blue)',
      'var(--tt-color-highlight-pink)',
      'var(--tt-color-highlight-yellow)',
      'var(--tt-color-highlight-brown)',
      'var(--tt-color-highlight-gray)',
      'var(--tt-color-highlight-purple)',
    ]),
    useColorValue: false,
    hideWhenUnavailable: false,
  },
  colorUnions = pickColorUnionByValue([
    {
      label: 'Important',
      fontColor: 'var(--tt-color-text-red)',
      highlightColor: 'var(--tt-color-highlight-red)',
    },
    {
      label: 'Warning',
      fontColor: 'var(--tt-color-text-orange)',
      highlightColor: 'var(--tt-color-highlight-orange)',
    },
    {
      label: 'Success',
      fontColor: 'var(--tt-color-text-green)',
      highlightColor: 'var(--tt-color-highlight-green)',
    },
    {
      label: 'Info',
      fontColor: 'var(--tt-color-text-blue)',
      highlightColor: 'var(--tt-color-highlight-blue)',
    },
    {
      label: 'Notice',
      fontColor: 'var(--tt-color-text-pink)',
      highlightColor: 'var(--tt-color-highlight-pink)',
    },
    {
      label: 'Highlight',
      fontColor: 'var(--tt-color-text-yellow)',
      highlightColor: 'var(--tt-color-highlight-yellow)',
    },
    {
      label: 'Note',
      fontColor: 'var(--tt-color-text-brown)',
      highlightColor: 'var(--tt-color-highlight-brown)',
    },
    {
      label: 'Secondary',
      fontColor: 'var(--tt-color-text-gray)',
      highlightColor: 'var(--tt-color-highlight-gray)',
    },
    {
      label: 'Special',
      fontColor: 'var(--tt-color-text-purple)',
      highlightColor: 'var(--tt-color-highlight-purple)',
    },
  ]),
  ...props
}: ColorUnionPopoverProps) => {
  const { editor } = useTiptapEditor(providedEditor);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const {
    isActive: isFontColorActive,
    isVisible: isFontColorVisible,
    canFontColor,
    label: fontColorLabel,
  } = useFontColor({
    editor,
    hideWhenUnavailable: fontColor.hideWhenUnavailable,
    onApplied: fontColor.onApplied,
  });

  const {
    isVisible: isColorHighlightVisible,
    canColorHighlight,
    isActive: isColorHighlightActive,
    label: colorHighlightLabel,
  } = useColorHighlight({
    editor,
    hideWhenUnavailable: highlight.hideWhenUnavailable,
    onApplied: highlight.onApplied,
  });

  if (!isColorHighlightVisible && !isFontColorVisible) return null;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <ColorUnionPopoverButton
          disabled={!canFontColor || !canColorHighlight}
          data-active-state={
            isColorHighlightActive || isFontColorActive ? 'on' : 'off'
          }
          data-disabled={!canFontColor || !canColorHighlight}
          aria-pressed={isColorHighlightActive || isFontColorActive}
          aria-label={`${colorHighlightLabel} & ${fontColorLabel}`}
          tooltip={`${colorHighlightLabel} & ${fontColorLabel}`}
          {...props}
        />
      </PopoverTrigger>
      <PopoverContent aria-label={`${colorHighlightLabel} & ${fontColorLabel}`}>
        <FontColorPopoverContent
          editor={editor}
          colors={fontColor.colors}
          useColorValue={fontColor.useColorValue}
        />
        <ColorHighlightPopoverContent
          editor={editor}
          colors={highlight.colors}
          useColorValue={highlight.useColorValue}
        />
        <ColorUnionPopoverContent
          editor={editor}
          colorUnions={colorUnions}
          useColorValue={fontColor.useColorValue && highlight.useColorValue}
        />
      </PopoverContent>
    </Popover>
  );
};
