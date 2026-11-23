import { Button as MagiariumButton } from '@/common/components/Button';
import { LINK_CARD_THUMBNAIL_TEMPLATES } from '@/features/content/common/constants';
import { ImageSelector } from '@/features/image/components/ImageSelector';
import { useImageUploader } from '@/features/image/hooks/useImageUploader';
import { Editor } from '@tiptap/react';
import Image from 'next/image';
import { useRef } from 'react';
import {
  BsArrowUpRight,
  BsEraser,
  BsGearFill,
  BsTrash,
  BsXLg,
} from 'react-icons/bs';
import { Button } from '../../ui-primitive/Button';
import { ButtonGroup } from '../../ui-primitive/ButtonGroup';
import { Card, CardBody } from '../../ui-primitive/Card';
import { Input } from '../../ui-primitive/Input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../ui-primitive/Popover';
import { useLinkCard } from '../LinkCardButton';

/**
 * リンクカードコンテキストメニュー
 *
 * @param params.editor Tiptapエディターのインスタンス
 */
export const LinkCardContextMenu = ({ editor }: { editor: Editor }) => {
  const {
    setLinkCard,
    setLinkCardState,
    linkCardState,
    openLink,
    resetLinkCard,
    removeLinkCard,
  } = useLinkCard({
    editor,
  });
  const { handleImageInput } = useImageUploader({
    onChange: (next) => {
      setLinkCardState((prev) => {
        return {
          ...prev,
          href: prev?.href || '',
          thumbnailUrl: next.path,
        };
      });
    },
    clipSize: { width: 1200, height: 800 },
  });

  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <ButtonGroup orientation={'vertical'}>
      <Button
        type="button"
        role="button"
        tooltip="破棄する"
        variant="ghost"
        onClick={() => {
          openLink('_blank');
        }}
        disabled={!linkCardState.href}
      >
        <BsArrowUpRight className="tiptap-button-icon" />
        リンクを開く
      </Button>
      <Popover modal={true}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            role="button"
            tooltip="破棄する"
            variant="ghost"
          >
            <BsGearFill className="tiptap-button-icon" />
            表示内容を編集する
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Card>
            <CardBody>
              {linkCardState.thumbnailUrl ? (
                <div className="tiptap-link-card__image">
                  <Image
                    className="tiptap-link-card__image"
                    src={linkCardState.thumbnailUrl}
                    alt="リンクカード画像"
                    width={1200}
                    height={800}
                    onClick={() => inputRef.current?.click()}
                  />
                  <Button
                    className="tiptap-link-card__image-reset-button"
                    onClick={() => {
                      setLinkCardState((prev) => {
                        return {
                          ...prev,
                          href: prev?.href || '',
                          thumbnailUrl: '',
                        };
                      });
                    }}
                  >
                    <BsXLg className="tiptap-button-icon" />
                  </Button>
                </div>
              ) : (
                <ImageSelector
                  iconSize="30px"
                  templates={LINK_CARD_THUMBNAIL_TEMPLATES}
                  onSelect={(next) => {
                    setLinkCardState((prev) => {
                      return {
                        ...prev,
                        href: prev?.href || '',
                        thumbnailUrl: next.path,
                      };
                    });
                  }}
                  onInput={handleImageInput}
                />
              )}
              <Input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageInput}
              />
              <Input
                type="text"
                placeholder="リンクを設定してください。"
                value={linkCardState.href || ''}
                onChange={(event) => {
                  setLinkCardState((prev) => {
                    return {
                      ...prev,
                      href: event.target.value,
                    };
                  });
                }}
              />
              <Input
                type="text"
                placeholder="リンク先タイトルを設定してください。"
                value={linkCardState.title || ''}
                onChange={(event) => {
                  setLinkCardState((prev) => {
                    return {
                      ...prev,
                      href: prev?.href || '',
                      title: event.target.value,
                    };
                  });
                }}
              />
              <Input
                type="text"
                placeholder="リンク先概要を設定してください。"
                value={linkCardState.description || ''}
                onChange={(event) => {
                  setLinkCardState((prev) => {
                    return {
                      ...prev,
                      href: prev?.href || '',
                      description: event.target.value,
                    };
                  });
                }}
              />
              <label>
                target:
                <select
                  value={linkCardState.target ?? '_blank'}
                  onChange={(event) => {
                    setLinkCardState((prev) => {
                      return {
                        ...prev,
                        href: prev?.href ?? '',
                        target: event.target.value,
                      };
                    });
                  }}
                >
                  <option value="_blank">別タブ</option>
                  <option value="_self">同タブ</option>
                </select>
              </label>
              <MagiariumButton
                onClick={() => {
                  setLinkCard();
                }}
              >
                反映
              </MagiariumButton>
            </CardBody>
          </Card>
        </PopoverContent>
      </Popover>
      <Button
        type="button"
        role="button"
        tooltip="破棄する"
        variant="ghost"
        onClick={() => {
          resetLinkCard();
        }}
      >
        <BsEraser className="tiptap-button-icon" />
        リセット
      </Button>
      <Button
        type="button"
        role="button"
        tooltip="破棄する"
        variant="ghost"
        onClick={() => {
          removeLinkCard();
        }}
      >
        <BsTrash className="tiptap-button-icon" />
        破棄する
      </Button>
    </ButtonGroup>
  );
};
