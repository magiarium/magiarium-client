import { CHARACTER_SPEECH_ICONS } from '@/features/content/common/constants';
import { ImageSelector } from '@/features/image/components/ImageSelector';
import { useImageUploader } from '@/features/image/hooks/useImageUploader';
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';
import { Editor } from '@tiptap/core';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import { BsChatFill } from 'react-icons/bs';
import { CharacterSpeechAttributes } from '../../extension/CharacterSpeech';
import { ChevronDownIcon } from '../../icons/ChevronDownIcon';
import { Button, ButtonProps } from '../../ui-primitive/Button';
import { Card, CardBody, CardItemGroup } from '../../ui-primitive/Card';
import { ColorSelector } from '../../ui-primitive/ColorSelector/ColorSelector';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../ui-primitive/Popover';
import {
  useCharacterSpeech,
  UseCharacterSpeechConfig,
} from '../CharacterSpeechButton';

interface CharacterSpeechMainProps {
  /**
   * Tiptapエディターのインスタンス
   */
  editor: Editor | null;
  /**
   * キャラクタースピーチの設定
   */
  characterSpeechState: CharacterSpeechAttributes | null;
  /**
   * キャラクタースピーチの設定を更新するための関数
   */
  setCharacterSpeechState: React.Dispatch<
    React.SetStateAction<CharacterSpeechAttributes | null>
  >;
  /**
   * エディター内にキャラクタースピーチの設定を反映する関数
   */
  setCharacterSpeech: () => boolean;

  /**
   * エディターに対して、現在キャラクタースピーチがアクティブ状態か否か
   * @default false
   */
  isActive: boolean;
}

interface CharacterSpeechPopoverProps
  extends Omit<ButtonProps, 'type'>, UseCharacterSpeechConfig {
  /**
   * アイコンの横に表示する補足テキスト(任意)
   */
  text?: string;

  /**
   * ポップオーバー開閉時のコールバック関数
   */
  onOpenChange?: (isOpen: boolean) => void;
}

/**
 * キャラクタースピーチポップオーバーのボタン
 */
export const CharacterSpeechButton = forwardRef<HTMLButtonElement, ButtonProps>(
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
        {children || <BsChatFill className="tiptap-button-icon" />}
      </Button>
    );
  }
);
CharacterSpeechButton.displayName = 'CharacterSpeechButton';

/**
 * キャラクタースピーチメイン
 */
export const CharacterSpeechMain = ({
  editor,
  characterSpeechState,
  setCharacterSpeechState,
  setCharacterSpeech,
}: CharacterSpeechMainProps) => {
  const { handleImageInput } = useImageUploader({
    onChange: (next) => {
      if (!editor) return;
      editor
        .chain()
        .focus()
        .setCharacterSpeech({
          ...characterSpeechState,
          characterIcon: next.path,
        })
        .run();
    },
    clipSize: { width: 515, height: 515 },
  });

  useEffect(() => {
    if (!characterSpeechState) return;

    setCharacterSpeech();
  }, [characterSpeechState, setCharacterSpeech]);

  return (
    <Card>
      <CardBody>
        <CardItemGroup className="tiptap-character-speech__card-item-group">
          <ImageSelector
            iconSize="2rem"
            templates={CHARACTER_SPEECH_ICONS}
            isActive={(current) =>
              characterSpeechState?.characterIcon === current.path
            }
            onSelect={(next) => {
              setCharacterSpeechState((prev) => {
                return {
                  ...prev,
                  characterIcon: next.path,
                };
              });
            }}
            onInput={handleImageInput}
          />
        </CardItemGroup>
        <CardItemGroup className="tiptap-character-speech__card-item-group">
          <ColorSelector
            currentColor={characterSpeechState?.frameColor ?? ''}
            colorSet={[
              { color: 'var(--main-color)', label: 'メインカラー' },
              { color: '#dddddd', label: 'デフォルトカラー' },
              { color: '#000000', label: 'メインカラー' },
            ]}
            onSelect={(nextColor) => {
              setCharacterSpeechState((prev) => {
                return {
                  ...prev,
                  frameColor: nextColor,
                };
              });
            }}
            canCustom={true}
          />
        </CardItemGroup>
        <CardItemGroup className="tiptap-character-speech__card-item-group">
          <label>
            キャラ配置:
            <select
              className="tiptap-character-speech__select-character-side"
              value={characterSpeechState?.characterPosition ?? 'left'}
              onChange={(event) => {
                setCharacterSpeechState((prev) => {
                  return {
                    ...prev,
                    characterPosition: event.target.value,
                  };
                });
              }}
            >
              <option value="left">左サイド</option>
              <option value="right">右サイド</option>
            </select>
          </label>
        </CardItemGroup>
      </CardBody>
    </Card>
  );
};

/**
 * キャラクタースピーチポップオーバー
 */
export const CharacterSpeechPopover = forwardRef<
  HTMLButtonElement,
  CharacterSpeechPopoverProps
>(
  (
    {
      editor: providedEditor,
      text,
      onOpenChange,
      hideWhenUnavailable = false,
      onSetCharacterSpeech,
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
      label,
      Icon,
      setCharacterSpeech,
      characterSpeechState,
      setCharacterSpeechState,
    } = useCharacterSpeech({
      editor,
      hideWhenUnavailable,
      onSetCharacterSpeech,
    });

    const handleOnOpenChange = useCallback(
      (nextIsOpen: boolean) => {
        setIsOpen(nextIsOpen);
        onOpenChange?.(nextIsOpen);
      },
      [onOpenChange]
    );

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
      <Popover modal={true} open={isOpen} onOpenChange={handleOnOpenChange}>
        <PopoverTrigger asChild>
          <CharacterSpeechButton
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
          </CharacterSpeechButton>
        </PopoverTrigger>

        <PopoverContent collisionPadding={10}>
          <CharacterSpeechMain
            editor={editor}
            characterSpeechState={characterSpeechState}
            setCharacterSpeechState={setCharacterSpeechState}
            setCharacterSpeech={setCharacterSpeech}
            isActive={isActive}
          />
        </PopoverContent>
      </Popover>
    );
  }
);
