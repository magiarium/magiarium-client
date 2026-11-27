import { Button as MagiariumButton } from '@/common/components/Button';
import { Image } from '@/common/components/Image';
import { TEMPLATE_OGPS, TEMPLATE_THUMBNAILS } from '@/common/constants';
import { ImageSelector } from '@/features/image/components/ImageSelector/ImageSelector';
import { useImageUploader } from '@/features/image/hooks/useImageUploader';
import { Editor } from '@tiptap/react';
import { useRef, useState } from 'react';
import {
  BsArrowUpRight,
  BsEraser,
  BsGearFill,
  BsTrash,
  BsXLg,
} from 'react-icons/bs';
import { LinkCardAttributes } from '../../extension/LinkCard';
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
import './LinkCardContextMenu.scss';

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
          <LinkCardSettingCard
            linkCardState={linkCardState}
            setLinkCardState={setLinkCardState}
            setLinkCard={setLinkCard}
          />
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

export const LinkCardSettingCard = ({
  linkCardState,
  setLinkCardState,
  setLinkCard,
}: {
  linkCardState: LinkCardAttributes;
  setLinkCardState: React.Dispatch<
    React.SetStateAction<LinkCardAttributes | null>
  >;
  setLinkCard: () => void;
}) => {
  const [isShowClipper, setIsShowClipper] = useState<boolean>(false);
  const { handleImageInput } = useImageUploader({
    onChange: (next) => {
      setLinkCardState((prev) => {
        return {
          ...prev,
          href: prev?.href || '',
          thumbnail: next,
        };
      });
      setIsShowClipper(true);
    },
  });

  const inputRef = useRef<HTMLInputElement | null>(null);
  return (
    <Card>
      <CardBody>
        {linkCardState.thumbnail?.src ? (
          <div className="tiptap-link-card-context-menu__image-container">
            <Image
              className="tiptap-link-card-context-menu__thumbnail"
              src={linkCardState.thumbnail.src}
              alt="リンクカード画像"
              width={1200}
              height={800}
              onClick={() => inputRef.current?.click()}
            />
            <Button
              className="tiptap-link-card-context-menu__image-reset-button"
              onClick={() => {
                setLinkCardState((prev) => {
                  return {
                    ...prev,
                    href: prev?.href || '',
                    thumbnail: null,
                  };
                });
              }}
            >
              <BsXLg className="tiptap-button-icon" />
            </Button>
          </div>
        ) : (
          <ImageSelector
            selectorIconSize="30px"
            currentImageMetadata={linkCardState.thumbnail}
            templates={[...TEMPLATE_THUMBNAILS, ...TEMPLATE_OGPS]}
            onChange={(next) => {
              setLinkCardState((prev) => {
                return {
                  ...prev,
                  href: prev?.href || '',
                  thumbnail: next,
                };
              });
            }}
            customInput={{
              canCustom: true,
              clipSize: { width: 1200, height: 800 },
            }}
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
  );
};
