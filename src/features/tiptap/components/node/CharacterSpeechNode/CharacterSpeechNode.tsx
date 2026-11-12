'use client';
import { Speech } from '@/common/components/SpeechBubble';
import { CHARACTER_SPEECH_ICONS } from '@/features/content/common/constants';
import { ImageSelector } from '@/features/image/components/ImageSelector';
import { useImageUploader } from '@/features/image/hooks/useImageUploader';
import { focusNodeViewContent } from '@/features/tiptap/lib/focusNodeViewContent';
import { NodeViewContent, NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import classNames from 'classnames';
import Image from 'next/image';
import { ReactNode, useEffect, useState } from 'react';
import { CharacterSpeechAttributes } from '../../extension/CharacterSpeech';
import { Card, CardBody, CardItemGroup } from '../../ui-primitive/Card';
import { ColorSelector } from '../../ui-primitive/ColorSelector/ColorSelector';
import { Input } from '../../ui-primitive/Input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../ui-primitive/Popover';
import { useCharacterSpeech } from '../../ui/CharacterSpeechButton';
import './CharacterSpeechNode.scss';

/**
 * キャラクタースピーチノードメイン
 */
export const CharacterSpeechNode = (props: NodeViewProps): ReactNode => {
  const { editor } = props;
  if (editor.isEditable) {
    return EditableCharacterSpeechNode(props);
  }

  const { characterIcon, characterName, characterPosition, frameColor } =
    props.node.attrs;

  return (
    <NodeViewWrapper>
      <CharacterSpeech
        characterIcon={characterIcon}
        characterName={characterName}
        characterPosition={characterPosition}
        frameColor={frameColor}
      />
    </NodeViewWrapper>
  );
};

/**
 * キャラクタースピーチノード(編集用)
 */
export const EditableCharacterSpeechNode = (
  props: NodeViewProps
): ReactNode => {
  const { editor, selected } = props;

  const [isEdit, setIsEdit] = useState<boolean>(false);

  const { characterSpeechState, setCharacterSpeechState, setCharacterSpeech } =
    useCharacterSpeech({
      editor: editor,
    });

  useEffect(() => {
    setIsEdit(true);
  }, [selected]);

  return (
    <NodeViewWrapper>
      <div className={classNames('tiptap-character-speech')}>
        <div
          className={classNames(
            'tiptap-character-speech__character-container',
            (isEdit
              ? characterSpeechState?.characterPosition
              : props.node.attrs.characterPosition) === 'right'
              ? 'tiptap-character-speech__character-container--right'
              : 'tiptap-character-speech__character-container--left'
          )}
        >
          <CharacterSpeechPopover
            props={props}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            characterSpeechState={characterSpeechState}
            setCharacterSpeechState={setCharacterSpeechState}
            setCharacterSpeech={setCharacterSpeech}
          >
            <Image
              style={
                (
                  isEdit
                    ? characterSpeechState?.frameColor
                    : props.node.attrs.frameColor
                )
                  ? ({
                      '--select-color': isEdit
                        ? characterSpeechState?.frameColor
                        : props.node.attrs.frameColor,
                    } as React.CSSProperties)
                  : undefined
              }
              className={classNames('tiptap-character-speech__character-icon')}
              src={
                (isEdit
                  ? characterSpeechState?.characterIcon
                  : props.node.attrs.characterIcon) ??
                '/user/icons/unknown.webp'
              }
              alt={'キャラクターアイコン'}
              width={515}
              height={515}
            />
          </CharacterSpeechPopover>
          <span className="tiptap-character-speech__character-name">
            {(isEdit
              ? characterSpeechState?.characterName
              : props.node.attrs.characterName) ?? ''}
          </span>
        </div>
        <Speech
          width={500}
          tailPosition={
            (isEdit
              ? characterSpeechState?.characterPosition
              : props.node.attrs.characterPosition) === 'right'
              ? { x: 510, y: 50 }
              : { x: -10, y: 50 }
          }
          heightRange={{ min: 100 }}
          tailRootWidth={10}
          stroke={'#8f8f8f'}
        >
          <NodeViewContent className="tiptap-character-speech__content" />
        </Speech>
      </div>
    </NodeViewWrapper>
  );
};

/**
 * キャラクタースピーチAttributes編集用ポップオーバー
 *
 * @param params.children ポップアップトリガー
 * @param params.props NodeViewProps
 * @param params.isEdit 編集状態
 * @param params.setIsEdit 編集状態更新用
 */
const CharacterSpeechPopover = ({
  children,
  characterSpeechState,
  setCharacterSpeechState,
  setCharacterSpeech,
  props,
  isEdit,
  setIsEdit,
}: {
  children: ReactNode;
  characterSpeechState: CharacterSpeechAttributes | null;
  setCharacterSpeechState: React.Dispatch<
    React.SetStateAction<CharacterSpeechAttributes | null>
  >;
  setCharacterSpeech: () => boolean;
  props: NodeViewProps;
  isEdit: boolean;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  asChild?: boolean;
}) => {
  const { handleImageInput } = useImageUploader({
    onChange: (next) => {
      setCharacterSpeechState((prev) => {
        return {
          ...prev,
          characterIcon: next.path,
        };
      });
    },
    clipSize: { width: 515, height: 515 },
  });

  return (
    <Popover
      modal={true}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setCharacterSpeech();
          setIsEdit(false);
        } else {
          // 対象の NodeViewContent に選択位置を移動
          focusNodeViewContent(props);
          setIsEdit(true);
        }
      }}
    >
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent>
        <Card>
          <CardBody>
            <CardItemGroup className="tiptap-character-speech__card-item-group">
              <ImageSelector
                iconSize="2rem"
                templates={CHARACTER_SPEECH_ICONS}
                isActive={(current) => {
                  return characterSpeechState?.characterIcon === current.path;
                }}
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
                currentColor={
                  (isEdit
                    ? characterSpeechState?.frameColor
                    : props.node.attrs.frameColor) || null
                }
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
              <label className="tiptap-character-speech__input-name">
                キャラクター名（任意）：
                <Input
                  aria-label="キャラクター名（任意）"
                  type="text"
                  className="tiptap-character-speech__character-name"
                  placeholder="名前"
                  value={
                    (isEdit
                      ? characterSpeechState?.characterName
                      : props.node.attrs.characterName) ?? ''
                  }
                  onChange={(event) => {
                    setCharacterSpeechState((prev) => {
                      return {
                        ...prev,
                        characterName: event.target.value,
                      };
                    });
                  }}
                />
              </label>
            </CardItemGroup>
            <CardItemGroup className="tiptap-character-speech__card-item-group">
              <label>
                キャラ配置:
                <select
                  className="tiptap-character-speech__select-character-side"
                  value={
                    (isEdit
                      ? characterSpeechState?.characterPosition
                      : props.node.attrs.characterPosition) ?? 'left'
                  }
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
      </PopoverContent>
    </Popover>
  );
};

/**
 * キャラクタースピーチ（閲覧用）
 */
const CharacterSpeech = ({
  characterIcon,
  characterName,
  characterPosition,
  frameColor,
}: CharacterSpeechAttributes) => {
  return (
    <div className={classNames('tiptap-character-speech')}>
      <div
        className={classNames(
          'tiptap-character-speech__character-container',
          characterPosition === 'right'
            ? 'tiptap-character-speech__character-container--right'
            : 'tiptap-character-speech__character-container--left'
        )}
      >
        <Image
          style={
            frameColor
              ? ({
                  '--select-color': frameColor,
                } as React.CSSProperties)
              : undefined
          }
          className={classNames('tiptap-character-speech__character-icon')}
          src={characterIcon ?? '/user/icons/unknown.webp'}
          alt={'キャラクターアイコン'}
          width={515}
          height={515}
        />
        <span className="tiptap-character-speech__character-name">
          {characterName}
        </span>
      </div>
      <Speech
        width={500}
        tailPosition={
          characterPosition === 'right' ? { x: 510, y: 50 } : { x: -10, y: 50 }
        }
        heightRange={{ min: 100 }}
        tailRootWidth={10}
        stroke={'#8f8f8f'}
      >
        <NodeViewContent className="tiptap-character-speech__content" />
      </Speech>
    </div>
  );
};
