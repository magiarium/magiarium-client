import {
  Button,
  ButtonProps,
} from '@/features/tiptap/components/ui-primitive/Button';
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';
import { forwardRef } from 'react';
import {
  useCharacterSpeech,
  UseCharacterSpeechConfig,
} from './useCharacterSpeech';

export interface CharacterSpeechButtonProps
  extends Omit<ButtonProps, 'type'>, UseCharacterSpeechConfig {
  /**
   * アイコンの横に表示する補足テキスト(任意)
   */
  text?: string;
}

/**
 * Tiptapエディター内にキャラクタースピーチを追加するためのボタンコンポーネント
 *
 * カスタムボタンを実装する場合は、代わりに `useCharacterSpeech` フックを使用してください。
 */
export const CharacterSpeechButton = forwardRef<
  HTMLButtonElement,
  CharacterSpeechButtonProps
>(
  (
    {
      editor: providedEditor,
      text,
      hideWhenUnavailable = false,
      onSetCharacterSpeech,
      onClick,
      children,
      ...buttonProps
    },
    ref
  ) => {
    const { editor } = useTiptapEditor(providedEditor);

    const { isVisible, canSet, isActive, label, Icon, insertCharacterSpeech } =
      useCharacterSpeech({
        editor,
        hideWhenUnavailable,
        onSetCharacterSpeech,
      });

    if (!isVisible) {
      return null;
    }

    return (
      <Button
        type="button"
        variant="ghost"
        role="button"
        tabIndex={-1}
        tooltip="CharacterSpeech"
        disabled={!canSet}
        data-active-state={isActive ? 'on' : 'off'}
        data-disabled={!canSet}
        aria-label={label}
        aria-pressed={isActive}
        onClick={insertCharacterSpeech}
        {...buttonProps}
        ref={ref}
      >
        {children ?? (
          <>
            <Icon className="tiptap-button-icon" />
            {text && <span className="tiptap-button-text">{text}</span>}
          </>
        )}
      </Button>
    );
  }
);

CharacterSpeechButton.displayName = 'CharacterSpeechButton';
