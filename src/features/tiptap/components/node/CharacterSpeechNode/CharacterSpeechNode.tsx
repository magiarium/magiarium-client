'use client';
import { Image } from '@/common/components/Image';
import { Speech } from '@/common/components/SpeechBubble';
import { TEMPLATE_CHARACTER_ICONS } from '@/common/constants';
import { ImageSelector } from '@/features/image/components/ImageSelector/ImageSelector';
import { Node } from '@tiptap/pm/model';
import {
  Editor,
  NodeViewContent,
  NodeViewProps,
  NodeViewWrapper,
} from '@tiptap/react';
import classNames from 'classnames';
import { ReactNode, useState } from 'react';
import { Card, CardBody, CardItemGroup } from '../../ui-primitive/Card';
import { ColorSelector } from '../../ui-primitive/ColorSelector/ColorSelector';
import { Input } from '../../ui-primitive/Input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../ui-primitive/Popover';
import './CharacterSpeechNode.scss';
/**
 * キャラクタースピーチメイン
 */
export const CharacterSpeechNode = ({
  editor,
  node,
  updateAttributes,
}: NodeViewProps): ReactNode => {
  const { characterPosition } = node.attrs;

  return (
    <NodeViewWrapper>
      <div className={classNames('tiptap-character-speech')}>
        <div
          className={classNames(
            'tiptap-character-speech__character-container',
            characterPosition === 'right'
              ? 'tiptap-character-speech__character-container--right'
              : 'tiptap-character-speech__character-container--left'
          )}
        >
          <CharacterSpeechIcon
            editor={editor}
            node={node}
            updateAttributes={updateAttributes}
          />
          <CharacterSpeechName
            editor={editor}
            node={node}
            updateAttributes={updateAttributes}
          />
        </div>
        <Speech
          width={500}
          tailPosition={
            characterPosition === 'right'
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
 * キャラクタースピーチアイコン
 */
const CharacterSpeechIcon = ({
  editor,
  node,
  updateAttributes,
}: {
  editor: Editor;
  node: Node;
  updateAttributes: (attributes: Record<string, any>) => void;
}) => {
  if (!editor.isEditable) {
    return (
      <Image
        style={
          node.attrs.frameColor
            ? ({
                '--select-color': node.attrs.frameColor,
              } as React.CSSProperties)
            : undefined
        }
        className={classNames('tiptap-character-speech__character-icon')}
        src={node.attrs.characterIcon?.src ?? '/user/unknown/icon.webp'}
        alt={'キャラクターアイコン'}
        width={515}
        height={515}
      />
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Image
          style={
            node.attrs.frameColor
              ? ({
                  '--select-color': node.attrs.frameColor,
                } as React.CSSProperties)
              : undefined
          }
          className={classNames(
            'tiptap-character-speech__character-icon',
            'tiptap-character-speech__character-icon--editable'
          )}
          src={node.attrs.characterIcon?.src ?? '/user/unknown/icon.webp'}
          alt={'キャラクターアイコン'}
          width={515}
          height={515}
        />
      </PopoverTrigger>
      <PopoverContent>
        <Card>
          <CardBody>
            <CardItemGroup className="tiptap-character-speech__card-item-group">
              <ImageSelector
                selectorIconSize="2rem"
                templates={TEMPLATE_CHARACTER_ICONS}
                currentImageMetadata={node.attrs.characterIcon}
                onChange={(next) => {
                  updateAttributes({
                    characterIcon: {
                      ...next,
                      alt: 'キャラクターアイコン',
                    },
                  });
                }}
                customInput={{
                  canCustom: true,
                  clipSize: { width: 515, height: 515 },
                }}
              />
            </CardItemGroup>
            <CardItemGroup className="tiptap-character-speech__card-item-group">
              <ColorSelector
                currentColor={node.attrs.frameColor}
                colorSet={[
                  { color: 'var(--main-color)', label: 'メインカラー' },
                  { color: '#dddddd', label: 'デフォルトカラー' },
                  { color: '#000000', label: 'メインカラー' },
                ]}
                onSelect={(nextColor) => {
                  updateAttributes({
                    frameColor: nextColor,
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
                  value={node.attrs.characterPosition}
                  onChange={(event) => {
                    updateAttributes({
                      characterPosition: event.target.value,
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
 * キャラクタースピーチアイコン
 */
const CharacterSpeechName = ({
  editor,
  node,
  updateAttributes,
}: {
  editor: Editor;
  node: Node;
  updateAttributes: (attributes: Record<string, any>) => void;
}) => {
  if (!editor.isEditable) {
    <span className="tiptap-character-speech__character-name">
      {node.attrs.characterName}
    </span>;
  }
  const [characterName, setCharacterName] = useState<string>(
    node.attrs.characterName ?? ''
  );

  return (
    <Input
      className="tiptap-character-speech__character-name tiptap-character-speech__character-name--editable"
      onChange={(event) => {
        setCharacterName(event.target.value);
      }}
      onBlur={() => {
        updateAttributes({
          characterName: characterName,
        });
      }}
      value={characterName}
    />
  );
};
