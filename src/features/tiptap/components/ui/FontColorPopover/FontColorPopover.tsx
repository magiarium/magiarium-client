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
  PopoverContent,
  PopoverTrigger,
} from '@/features/tiptap/components/ui-primitive/Popover';
import { Separator } from '@/features/tiptap/components/ui-primitive/Separator';
import {
  FontColor,
  FontColorButton,
  pickFontColorByValue,
  useFontColor,
  UseFontColorConfig,
} from '@/features/tiptap/components/ui/FontColorButton';
import { useIsBreakpoint } from '@/features/tiptap/hooks/useIsBreakpoint';
import { useMenuNavigation } from '@/features/tiptap/hooks/useMenuNavigation';
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';
import { Editor } from '@tiptap/react';
import { forwardRef, useMemo, useRef, useState } from 'react';
import { BsPalette } from 'react-icons/bs';

export interface FontColorPopoverContentProps {
  editor?: Editor | null;
  colors?: FontColor[];
  useColorValue?: boolean;
}

export interface FontColorPopoverProps
  extends
    Omit<ButtonProps, 'type'>,
    Pick<UseFontColorConfig, 'editor' | 'hideWhenUnavailable' | 'onApplied'> {
  colors?: FontColor[];
  useColorValue?: boolean;
}

export const FontColorPopoverButton = forwardRef<
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
    {children ?? <BsPalette className="tiptap-button-icon" />}
  </Button>
));

export const FontColorPopoverContent = ({
  editor,
  colors = pickFontColorByValue(['var(--tt-color-text-red)']),
  useColorValue = false,
}: FontColorPopoverContentProps) => {
  const { handleRemoveFontColor } = useFontColor({ editor });
  const isMobile = useIsBreakpoint();
  const containerRef = useRef<HTMLDivElement>(null);

  const menuItems = useMemo(
    () => [...colors, { label: 'Remove highlight', value: 'none' }],
    [colors]
  );

  const { selectedIndex } = useMenuNavigation({
    containerRef,
    items: menuItems,
    orientation: 'both',
    onSelect: (item) => {
      if (!containerRef.current) return false;
      const selectedColorElement = containerRef.current.querySelector(
        '[data-fontcolor="true"]'
      ) as HTMLElement;
      if (selectedColorElement) selectedColorElement.click();
      if (item.value === 'none') handleRemoveFontColor();
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
              <ButtonGroup key={color.value}>
                <FontColorButton
                  editor={editor}
                  fontColor={useColorValue ? color.colorValue : color.value}
                  tooltip={color.label}
                  aria-label={`${color.label} FontColor`}
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
              onClick={handleRemoveFontColor}
              aria-label="Remove FontColor"
              tooltip="Remove FontColor"
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

export const FontColorPopover = ({
  editor: providedEditor,
  colors = pickFontColorByValue(['var(--tt-color-text-red)']),
  hideWhenUnavailable = false,
  useColorValue = false,
  onApplied,
  ...props
}: FontColorPopoverProps) => {
  const { editor } = useTiptapEditor(providedEditor);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { isActive, isVisible, canFontColor, label, Icon } = useFontColor({
    editor,
    hideWhenUnavailable,
    onApplied,
  });

  if (!isVisible) return null;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <FontColorPopoverButton
          disabled={!canFontColor}
          data-active-state={isActive ? 'on' : 'off'}
          data-disabled={!canFontColor}
          aria-pressed={isActive}
          aria-label={label}
          tooltip={label}
          {...props}
        >
          <Icon className="tiptap-button-icon" />
        </FontColorPopoverButton>
      </PopoverTrigger>
      <PopoverContent aria-label="FontColor">
        <FontColorPopoverContent
          editor={editor}
          colors={colors}
          useColorValue={useColorValue}
        />
      </PopoverContent>
    </Popover>
  );
};

export default FontColorPopover;
