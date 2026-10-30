import { BanIcon } from '@/features/tiptap/components/icons/BanIcon';
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
import {
  Popover,
  PopoverTrigger,
} from '@/features/tiptap/components/ui-primitive/Popover';
import { Separator } from '@/features/tiptap/components/ui-primitive/Separator';
import {
  Color,
  ColorButton,
  pickColorByValue,
} from '@/features/tiptap/components/ui/ColorButton';
import {
  HighlightColor,
  pickHighlightColorsByValue,
  useColorHighlight,
  UseColorHighlightConfig,
} from '@/features/tiptap/components/ui/ColorHighlightButton';
import { ColorHighlightPopoverContent } from '@/features/tiptap/components/ui/ColorHighlightPopover';
import { useIsBreakpoint } from '@/features/tiptap/hooks/useIsBreakpoint';
import { useMenuNavigation } from '@/features/tiptap/hooks/useMenuNavigation';
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';
import { PopoverContent } from '@radix-ui/react-popover';
import { Editor } from '@tiptap/react';
import { forwardRef, useMemo, useRef, useState } from 'react';
import { BsPalette } from 'react-icons/bs';
import {
  FontColor,
  pickFontColorByValue,
  useFontColor,
  UseFontColorConfig,
} from '../FontColorButton/useFontColor';
import { FontColorPopoverContent } from '../FontColorPopover/FontColorPopover';

export interface ColorUnionsPopoverContentProps {
  editor: Editor | null;
  colors?: Color[];
  useColorValue?: boolean;
}

export interface ColorPopoverProps extends Omit<ButtonProps, 'type'> {
  editor: Editor;
  fontColor?: Pick<UseFontColorConfig, 'hideWhenUnavailable' | 'onApplied'> & {
    colors?: FontColor[];
    useColorValue?: boolean;
  };
  highlight?: Pick<
    UseColorHighlightConfig,
    'hideWhenUnavailable' | 'onApplied'
  > & { colors?: HighlightColor[]; useColorValue?: boolean };
  colorUnions?: Color[];
}

export const ColorPopoverButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => (
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
      {children ?? <BsPalette className="tiptap-button-icon" />}
    </Button>
  )
);

export const ColorUnionPopoverContent = ({
  editor,
  colors = pickColorByValue([]),
  useColorValue,
}: ColorUnionsPopoverContentProps) => {
  const { handleRemoveFontColor } = useFontColor({ editor });
  const { handleRemoveHighlight } = useColorHighlight({ editor });
  const isMobile = useIsBreakpoint();
  const containerRef = useRef<HTMLDivElement>(null);

  const menuItems = useMemo(
    () => [
      ...colors,
      {
        label: 'Remove highlight',
        font: { value: 'none' },
        highlight: { value: 'none' },
      },
    ],
    [colors]
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
      if (item.font.value === 'none' && item.highlight.value === 'none')
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
            {colors.map((color, index) => (
              <ButtonGroup key={`${color.font.value}:${color.highlight.value}`}>
                <ColorButton
                  editor={editor}
                  font={
                    useColorValue
                      ? {
                          color: color.font.colorValue,
                        }
                      : { color: color.font.value }
                  }
                  highlight={
                    useColorValue
                      ? {
                          color: color.highlight.colorValue,
                        }
                      : { color: color.highlight.value }
                  }
                  tooltip={color.label}
                  aria-label={`${color.font.value}:${color.highlight.value}`}
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
              tabIndex={selectedIndex === colors.length ? 0 : -1}
              type="button"
              role="menuitem"
              variant="ghost"
              data-highlighted={selectedIndex === colors.length}
            >
              <BanIcon className="tiptap-button-icon" />
            </Button>
          </ButtonGroup>
        </CardItemGroup>
      </CardBody>
    </Card>
  );
};

export const ColorPopover = ({
  editor: providedEditor,
  fontColor = {
    colors: pickFontColorByValue(['var(--tt-color-text-red)']),
    hideWhenUnavailable: false,
    useColorValue: false,
  },
  highlight = {
    colors: pickHighlightColorsByValue([
      'var(--tt-color-highlight-green)',
      'var(--tt-color-highlight-blue)',
      'var(--tt-color-highlight-red)',
      'var(--tt-color-highlight-purple)',
      'var(--tt-color-highlight-yellow)',
    ]),
    useColorValue: false,
    hideWhenUnavailable: false,
  },
  colorUnions = pickColorByValue([
    {
      fontColor: 'var(--tt-color-text-red)',
      highlightColor: 'var(--tt-color-highlight-yellow)',
    },
  ]),
  ...props
}: ColorPopoverProps) => {
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
        <ColorPopoverButton
          disabled={!canFontColor || !canColorHighlight}
          data-active-state={
            isColorHighlightActive || isFontColorActive ? 'on' : 'off'
          }
          data-disabled={!canFontColor || !canColorHighlight}
          aria-pressed={isColorHighlightActive || isFontColorActive}
          aria-label={`${colorHighlightLabel} & ${fontColorLabel}`}
          tooltip={`${colorHighlightLabel} & ${fontColorLabel}`}
          {...props}
        ></ColorPopoverButton>
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
          colors={colorUnions}
          useColorValue={fontColor.useColorValue && highlight.useColorValue}
        />
      </PopoverContent>
    </Popover>
  );
};
