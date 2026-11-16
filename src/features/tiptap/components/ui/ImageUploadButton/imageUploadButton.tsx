import { forwardRef, useCallback } from 'react';

// --- Lib ---
import { parseShortcutKeys } from '@/features/tiptap/lib/tiptapUtils';

// --- Hooks ---
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';

// --- Tiptap UI ---
import type { UseImageUploadConfig } from '@/features/tiptap/components/ui/ImageUploadButton';
import {
  IMAGE_UPLOAD_SHORTCUT_KEY,
  useImageUpload,
} from '@/features/tiptap/components/ui/ImageUploadButton';

// --- UI Primitives ---
import { Badge } from '@/features/tiptap/components/ui-primitive/Badge';
import type { ButtonProps } from '@/features/tiptap/components/ui-primitive/Button';
import { Button } from '@/features/tiptap/components/ui-primitive/Button';

type IconProps = React.SVGProps<SVGSVGElement>;
type IconComponent = ({ className, ...props }: IconProps) => React.ReactElement;

export interface ImageUploadButtonProps
  extends Omit<ButtonProps, 'type'>, UseImageUploadConfig {
  /**
   * アイコンの横に表示する補足テキスト(任意)
   */
  text?: string;

  /**
   * ボタン内にショートカットキーを表示するかどうか(任意)
   * @default false
   */
  showShortcut?: boolean;
  /**
   * デフォルトアイコンの代わりに描画するカスタムアイコン(任意)
   */
  icon?: React.MemoExoticComponent<IconComponent> | React.FC<IconProps>;
}

/**
 * 画像アップロードショートカットバッジ
 * @param params.shortcutKeys ショートカットキー
 */
export const ImageShortcutBadge = ({
  shortcutKeys = IMAGE_UPLOAD_SHORTCUT_KEY,
}: {
  shortcutKeys?: string;
}) => {
  return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
};

/**
 * Tiptapエディター内に画像アップロードエリアを追加するボタンコンポーネント
 *
 * カスタムボタンを実装する場合は、代わりに `useImageUpload` フックを使用してください。
 */
export const ImageUploadButton = forwardRef<
  HTMLButtonElement,
  ImageUploadButtonProps
>(
  (
    {
      editor: providedEditor,
      text,
      hideWhenUnavailable = false,
      onInserted,
      showShortcut = false,
      onClick,
      icon: CustomIcon,
      children,
      ...buttonProps
    },
    ref
  ) => {
    const { editor } = useTiptapEditor(providedEditor);
    const {
      isVisible,
      canInsert,
      handleImage,
      label,
      isActive,
      shortcutKeys,
      Icon,
    } = useImageUpload({
      editor,
      hideWhenUnavailable,
      onInserted,
    });

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        handleImage();
      },
      [handleImage, onClick]
    );

    if (!isVisible) {
      return null;
    }

    const RenderIcon = CustomIcon ?? Icon;

    return (
      <Button
        type="button"
        variant="ghost"
        data-active-state={isActive ? 'on' : 'off'}
        role="button"
        tabIndex={-1}
        disabled={!canInsert}
        data-disabled={!canInsert}
        aria-label={label}
        aria-pressed={isActive}
        tooltip={label}
        onClick={handleClick}
        {...buttonProps}
        ref={ref}
      >
        {children ?? (
          <>
            <RenderIcon className="tiptap-button-icon" />
            {text && <span className="tiptap-button-text">{text}</span>}
            {showShortcut && <ImageShortcutBadge shortcutKeys={shortcutKeys} />}
          </>
        )}
      </Button>
    );
  }
);

ImageUploadButton.displayName = 'ImageUploadButton';
