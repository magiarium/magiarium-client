'use client';

import { Button as MagiariumButton } from '@/common/components/Button';
import { LINK_CARD_THUMBNAIL_TEMPLATES } from '@/features/content/common/constants';
import { ImageSelector } from '@/features/image/components/ImageSelector';
import { NodeViewProps } from '@tiptap/core';
import { NodeViewWrapper } from '@tiptap/react';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';

// --- Hooks ---
import { useImageUploader } from '@/features/image/hooks/useImageUploader';

// --- Icons ---
import { ExternalLinkIcon } from '@/features/tiptap/components/icons/ExternalLinkIcon';
import { BsEraser, BsGearFill, BsTrash, BsXLg } from 'react-icons/bs';

// --- UI Primitives ---
import { Button } from '@/features/tiptap/components/ui-primitive/Button';
import { Card, CardBody } from '@/features/tiptap/components/ui-primitive/Card';
import { Input } from '@/features/tiptap/components/ui-primitive/Input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/features/tiptap/components/ui-primitive/Popover';

// --- Tiptap UI ---
import { useLinkCard } from '@/features/tiptap/components/ui/LinkCardButton';

// --- Style ---
import './LinkCardNode.scss';

/**
 * リンクカードノード
 */
export const LinkCardNode = (props: NodeViewProps) => {
  const { editor } = props;
  if (editor.isEditable) {
    return EditableLinkCardNode(props);
  }
  const { href, thumbnailUrl, title, description, target } = props.node.attrs;

  return (
    <NodeViewWrapper className={classNames('tiptap-link-card')}>
      <Link href={href}>
        <LinkCard
          href={href}
          title={title}
          thumbnailUrl={thumbnailUrl}
          description={description}
          target={target}
        />
      </Link>
    </NodeViewWrapper>
  );
};

/**
 * 編集可能リンクカードノード
 */
export const EditableLinkCardNode = (props: NodeViewProps) => {
  const { editor, selected } = props;
  const {
    setLinkCard,
    setLinkCardState,
    linkCardState,
    openLink,
    removeLinkCard,
  } = useLinkCard({
    editor,
  });

  const [isEdit, setIsEdit] = useState<boolean>(false);
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

  if (isEdit) {
    return (
      <NodeViewWrapper
        className={classNames('tiptap-link-card', 'tiptap-link-card--editor')}
      >
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
              <BsXLg />
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
            setIsEdit(false);
          }}
        >
          反映
        </MagiariumButton>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className={classNames('tiptap-link-card')}>
      <Popover>
        <PopoverTrigger>
          <LinkCard
            href={selected ? linkCardState.href : props.node.attrs.href}
            title={selected ? linkCardState.title : props.node.attrs.title}
            description={
              selected
                ? linkCardState.description
                : props.node.attrs.description
            }
            thumbnailUrl={
              selected
                ? linkCardState.thumbnailUrl
                : props.node.attrs.thumbnailUrl
            }
            target={selected ? linkCardState.target : props.node.attrs.target}
          />
        </PopoverTrigger>
        <PopoverContent>
          <Card>
            <CardBody>
              <Button
                variant="ghost"
                onClick={() => {
                  openLink('_blank');
                }}
                disabled={!linkCardState.href}
              >
                <ExternalLinkIcon className="tiptap-button-icon" />
                リンクを開く
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setIsEdit(true);
                }}
              >
                <BsGearFill className="tiptap-button-icon" />
                表示内容を編集する
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  removeLinkCard();
                }}
              >
                <BsEraser className="tiptap-button-icon" />
                リセット
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  editor.chain().focus().deleteSelection().run();
                }}
              >
                <BsTrash className="tiptap-button-icon" />
                破棄する
              </Button>
            </CardBody>
          </Card>
        </PopoverContent>
      </Popover>
    </NodeViewWrapper>
  );
};

/**
 * リンクカード本体
 */
export const LinkCard = ({
  thumbnailUrl,
  href,
  title,
  description,
  target,
}: {
  thumbnailUrl: string;
  href: string;
  title?: string;
  description?: string;
  target?: string;
}) => {
  return (
    <>
      <div className="tiptap-link-card__capture">
        {thumbnailUrl ? (
          <Image
            className="tiptap-link-card__image"
            src={thumbnailUrl}
            alt="リンクカード画像"
            width={1200}
            height={800}
          />
        ) : (
          <span className="tiptap-link-card__image">
            画像が設定されていません。
          </span>
        )}
        <span className="tiptap-link-card__link">{href}</span>
      </div>
      <span className="tiptap-link-card__title">{title}</span>
      <span className="tiptap-link-card__description">{description}</span>
    </>
  );
};
