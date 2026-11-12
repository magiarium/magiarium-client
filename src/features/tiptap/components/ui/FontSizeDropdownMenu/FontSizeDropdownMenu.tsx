import { ChevronDownIcon } from '@/features/tiptap/components/icons/ChevronDownIcon';
import {
  Button,
  ButtonProps,
} from '@/features/tiptap/components/ui-primitive/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/features/tiptap/components/ui-primitive/DropdownMenu';
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';
import { forwardRef, useState } from 'react';
import { FiType } from 'react-icons/fi';
import {
  FONT_SIZES,
  FontSize,
  FontSizeButton,
  useFontSize,
  UseFontSizeConfig,
} from '../FontSizeButton';

export interface FontSizeDropdownMenuProps
  extends
    Omit<ButtonProps, 'type'>,
    Pick<UseFontSizeConfig, 'editor' | 'hideWhenUnavailable' | 'onApplied'> {
  /**
   * フォントサイズ設定一覧
   */
  fontSizes?: FontSize[];
}

/**
 * フォントサイズドロップダウンボタンコンポーネント
 */
export const FontSizeDropdownMenuButton = forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({ className, children, ...props }, ref) => {
  return (
    <Button
      type="button"
      className={className}
      variant="ghost"
      data-appearance="default"
      role="button"
      tabIndex={-1}
      aria-label="FontSize text"
      tooltip="FontSize"
      ref={ref}
      {...props}
    >
      {children ?? (
        <>
          <FiType />
          <ChevronDownIcon className="tiptap-button-dropdown-small" />
        </>
      )}
    </Button>
  );
});
FontSizeDropdownMenuButton.displayName = 'FontSizeDropdownMenuButton';

/**
 * Tiptapエディター内のフォントサイズを切り替えるためのドロップダウンメニューコンポーネント
 *
 * カスタムボタンを実装する場合は、代わりに `useFontSize` フックを使用してください。
 */
export const FontSizeDropdownMenu = ({
  editor: providedEditor,
  fontSizes = FONT_SIZES,
  hideWhenUnavailable = false,
  onApplied,
  ...props
}: FontSizeDropdownMenuProps) => {
  const { editor } = useTiptapEditor(providedEditor);
  const [isOpen, setIsOpen] = useState(false);
  const { isVisible, isActive, canFontSize, label, Icon } = useFontSize({
    editor,
    hideWhenUnavailable,
    onApplied,
  });

  if (!isVisible) return null;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <FontSizeDropdownMenuButton
          disabled={!canFontSize}
          data-active-state={isActive ? 'on' : 'off'}
          data-disabled={!canFontSize}
          aria-pressed={isActive}
          aria-label={label}
          tooltip={label}
          {...props}
        >
          <Icon className="tiptap-button-icon" />
        </FontSizeDropdownMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom">
        {fontSizes.map((fontSize) => {
          return (
            <DropdownMenuItem asChild>
              <FontSizeButton
                editor={editor}
                fontSize={fontSize.value}
                text={fontSize.label}
                tooltip={fontSize.label}
                aria-label={`${fontSize.label} fontSize`}
              />
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

FontSizeDropdownMenu.displayName = 'FontSizeDropdownMenu';
