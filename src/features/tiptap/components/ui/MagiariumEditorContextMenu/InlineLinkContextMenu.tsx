import { ImageSelector } from '@/features/image/components/ImageSelector';
import { useImageUploader } from '@/features/image/hooks/useImageUploader';
import { Editor } from '@tiptap/react';
import { BsArrowUpRight, BsGearFill, BsTrash } from 'react-icons/bs';
import { FaUnlink } from 'react-icons/fa';
import { Button } from '../../ui-primitive/Button';
import { ButtonGroup } from '../../ui-primitive/ButtonGroup';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../ui-primitive/Popover';
import { InlineLinkContent, useInlineLink } from '../InlineLinkPopover';

/**
 * インラインリンクコンテキストメニュー
 *
 * @param params.editor Tiptapエディターのインスタンス
 */
export const InlineLinkContextMenu = ({ editor }: { editor: Editor }) => {
  const { inlineLinkState, openLink, setInlineLinkState, removeInlineLink } =
    useInlineLink({ editor });

  const { handleImageInput } = useImageUploader({
    onChange: (next) => {
      setInlineLinkState((prev) => {
        return {
          ...prev,
          href: prev?.href || '',
          icon: next.path,
        };
      });
    },
    clipSize: { width: 32, height: 32 },
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
        disabled={!inlineLinkState.href}
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
          <InlineLinkContent editor={editor} />
        </PopoverContent>
      </Popover>
      <Popover modal={true}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            role="button"
            tooltip="破棄する"
            variant="ghost"
          >
            アイコン変更
          </Button>
        </PopoverTrigger>
        <PopoverContent side="bottom" align="start">
          <ImageSelector
            iconSize="30px"
            className="tiptap-inline-link__icon-selector"
            templates={[
              {
                path: '/assets/images/preset/x_icon.png',
                mimeType: 'image/png',
                alt: 'Xアイコン',
                fileName: 'x_icon.png',
                size: { width: 32, height: 32 },
                uploadedAt: '20261108122000',
              },
              {
                path: '/assets/images/preset/youtube_icon.png',
                mimeType: 'image/png',
                alt: 'Youtubeアイコン',
                fileName: 'youtube_icon.png',
                size: { width: 32, height: 32 },
                uploadedAt: '20261108122000',
              },
              {
                path: '/assets/images/preset/pixiv_icon.png',
                mimeType: 'image/png',
                alt: 'Xアイコン',
                fileName: 'pixiv_icon.png',
                size: { width: 32, height: 32 },
                uploadedAt: '20261108122000',
              },
              {
                path: '/assets/images/preset/magiarium_icon.png',
                mimeType: 'image/png',
                alt: 'まぎありうむブログアイコン',
                fileName: 'magiarium_icon.png',
                size: { width: 32, height: 32 },
                uploadedAt: '20261108122000',
              },
              {
                path: '/assets/images/preset/magiarium_blog_icon.png',
                mimeType: 'image/png',
                alt: 'まぎありうむアイコン',
                fileName: 'magiarium_blog_icon.png',
                size: { width: 32, height: 32 },
                uploadedAt: '20261108122000',
              },
            ]}
            isActive={(current) => {
              if (inlineLinkState.href === '') return false;
              return current.path === inlineLinkState.icon;
            }}
            onSelect={(imageInfo) => {
              setInlineLinkState((prev) => {
                return {
                  ...prev,
                  href: prev?.href || '',
                  icon: imageInfo.path,
                };
              });
            }}
            onInput={handleImageInput}
          />
          {inlineLinkState.icon && inlineLinkState.icon !== '' && (
            <Button
              onClick={() => {
                setInlineLinkState((prev) => {
                  return {
                    ...prev,
                    href: prev?.href || '',
                    icon: null,
                  };
                });
              }}
            >
              <BsTrash className="tiptap-button-icon" />
            </Button>
          )}
        </PopoverContent>
      </Popover>
      <Button
        type="button"
        role="button"
        tooltip="リンク解除"
        variant="ghost"
        onClick={() => {
          removeInlineLink();
        }}
      >
        <FaUnlink className="tiptap-button-icon" />
        リンク解除
      </Button>
      <Button
        type="button"
        role="button"
        tooltip="破棄する"
        variant="ghost"
        onClick={() => {
          editor.chain().focus().deleteSelection().run();
        }}
      >
        <BsTrash className="tiptap-button-icon" />
        破棄する
      </Button>
    </ButtonGroup>
  );
};
