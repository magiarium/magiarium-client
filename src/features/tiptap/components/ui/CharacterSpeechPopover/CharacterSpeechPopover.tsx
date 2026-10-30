import { ImageSelector } from '@/features/image/components/ImageSelector';
import { CharacterSpeechAttributes } from '@/features/tiptap/components/extension/CharacterSpeech';
import { CornerDownLeftIcon } from '@/features/tiptap/components/icons/CornerDownLeftIcon';
import { TrashIcon } from '@/features/tiptap/components/icons/TrashIcon';
import {
  Button,
  ButtonProps,
} from '@/features/tiptap/components/ui-primitive/Button';
import { ButtonGroup } from '@/features/tiptap/components/ui-primitive/ButtonGroup';
import {
  Card,
  CardItemGroup,
} from '@/features/tiptap/components/ui-primitive/Card';
import { Input } from '@/features/tiptap/components/ui-primitive/Input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/features/tiptap/components/ui-primitive/Popover';
import { useIsBreakpoint } from '@/features/tiptap/hooks/useIsBreakpoint';
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';
import { ImageMetadata } from '@magiarium/structure';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import { BsChatFill } from 'react-icons/bs';
import { ChevronDownIcon } from '../../icons/ChevronDownIcon';
import {
  useCharacterSpeech,
  UseCharacterSpeechConfig,
} from './useCharacterSpeech';

export interface CharacterSpeechPopoverProps
  extends Omit<ButtonProps, 'type'>, UseCharacterSpeechConfig {
  text?: string;
  onOpenChange?: (isOpen: boolean) => void;
  autoOpenOnCharacterSpeechActive?: boolean;
  modal?: boolean;
}

export const CharacterSpeechButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Button
        type="button"
        className={className}
        variant="ghost"
        role="button"
        tabIndex={-1}
        aria-label="CharacterSpeech"
        tooltip="CharacterSpeech"
        ref={ref}
        {...props}
      >
        {children || <BsChatFill className="tiptap-button-icon" />}
      </Button>
    );
  }
);

CharacterSpeechButton.displayName = 'CharacterSpeechButton';

export interface CharacterSpeechProps {
  characterSpeechState: CharacterSpeechAttributes;

  setCharacterSpeechState: React.Dispatch<
    React.SetStateAction<CharacterSpeechAttributes | null>
  >;

  setCharacterSpeech: () => void;

  insertCharacterSpeech: () => void;

  removeCharacterSpeech: () => void;

  isActive: boolean;
}

export const CharacterSpeechPopoverContent = ({
  characterSpeechState,
  setCharacterSpeechState,
  setCharacterSpeech,
  insertCharacterSpeech,
  removeCharacterSpeech,
  isActive,
}: CharacterSpeechProps) => {
  const isMobile = useIsBreakpoint();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setCharacterSpeech();
    }
  };

  return (
    <Card
      style={{
        ...(isMobile ? { boxShadow: 'none', border: 0 } : {}),
      }}
    >
      <CardItemGroup>
        <Input
          type="text"
          placeholder="キャラクターの台詞を入力してください。"
          value={characterSpeechState.text}
          onChange={(e) =>
            setCharacterSpeechState((prev) => {
              return {
                image: prev?.image || '',
                text: e.target.value,
                position: prev?.position || 'left',
              };
            })
          }
          onKeyDown={handleKeyDown}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          className="tiptap-character-speech-text-input"
        />
      </CardItemGroup>
      <CardItemGroup>
        <ImageSelector
          templates={[]}
          onSelect={(next: ImageMetadata) => {
            setCharacterSpeechState((prev) => {
              return {
                image: next.path,
                text: prev?.text || '',
                position: prev?.position || 'left',
              };
            });
          }}
        />
        <fieldset>
          キャラクター配置
          <label>
            右側
            <Input
              type="radio"
              name="character-speech-position"
              id="character-speech-position-right"
              value="right"
              checked={characterSpeechState.position === 'right'}
              onChange={(e) =>
                setCharacterSpeechState((prev) => {
                  return {
                    image: prev?.image || '',
                    text: prev?.text || '',
                    position: e.target.value === 'right' ? 'right' : 'left',
                  };
                })
              }
            />
          </label>
          <label>
            左側
            <Input
              type="radio"
              name="character-speech-position"
              id="character-speech-position-left"
              value="left"
              checked={characterSpeechState.position === 'left'}
              onChange={(e) =>
                setCharacterSpeechState((prev) => {
                  return {
                    image: prev?.image || '',
                    text: prev?.text || '',
                    position: e.target.value === 'right' ? 'right' : 'left',
                  };
                })
              }
            />
          </label>
        </fieldset>
      </CardItemGroup>
      <ButtonGroup>
        <ButtonGroup>
          <Button
            type="button"
            onClick={() => {
              if (characterSpeechState) {
                setCharacterSpeech();
              } else {
                insertCharacterSpeech();
              }
            }}
            title="Add CharacterSpeech"
            disabled={!isActive}
            variant="ghost"
          >
            <CornerDownLeftIcon className="tiptap-button-icon" />
          </Button>
        </ButtonGroup>

        <ButtonGroup>
          <Button
            type="button"
            onClick={removeCharacterSpeech}
            title="Remove CharacterSpeech"
            disabled={!characterSpeechState && !isActive}
            variant="ghost"
          >
            <TrashIcon className="tiptap-button-icon" />
          </Button>
        </ButtonGroup>
      </ButtonGroup>
    </Card>
  );
};

export const CharacterSpeechPopover = forwardRef<
  HTMLButtonElement,
  CharacterSpeechPopoverProps
>(
  (
    {
      editor: providedEditor,
      text,
      modal = true,
      hideWhenUnavailable = false,
      onSetCharacterSpeech,
      onOpenChange,
      autoOpenOnCharacterSpeechActive = true,
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
      label,
      Icon,
      characterSpeechState,
      setCharacterSpeechState,
      setCharacterSpeech,
      insertCharacterSpeech,
      removeCharacterSpeech,
    } = useCharacterSpeech({
      editor,
      hideWhenUnavailable,
      onSetCharacterSpeech,
    });

    const shouldAutoOpen =
      autoOpenOnCharacterSpeechActive && !!editor?.isFocused && isActive;

    const handleOnOpenChange = useCallback(
      (nextIsOpen: boolean) => {
        setIsOpen(nextIsOpen);
        onOpenChange?.(nextIsOpen);
      },
      [onOpenChange]
    );
    const handleSetCharacterSpeech = useCallback(() => {
      setCharacterSpeech();
      setIsOpen(false);
    }, [setCharacterSpeech]);

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

        <PopoverContent side="right" align="start">
          <CharacterSpeechPopoverContent
            characterSpeechState={characterSpeechState}
            setCharacterSpeechState={setCharacterSpeechState}
            setCharacterSpeech={handleSetCharacterSpeech}
            insertCharacterSpeech={insertCharacterSpeech}
            removeCharacterSpeech={removeCharacterSpeech}
            isActive={isActive}
          />
        </PopoverContent>
      </Popover>
    );
  }
);
