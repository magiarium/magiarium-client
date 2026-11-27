import { TEMPLATE_SERVICE_ICONS } from '@/common/constants';
import { ImageSelector } from '@/features/image/components/ImageSelector/ImageSelector';
import { Editor } from '@tiptap/react';
import {
  BsArrowUpRight,
  BsGearFill,
  BsPersonCircle,
  BsTrash,
} from 'react-icons/bs';
import { FaUnlink } from 'react-icons/fa';
import { Button } from '../../ui-primitive/Button';
import { ButtonGroup } from '../../ui-primitive/ButtonGroup';
import { Card, CardBody } from '../../ui-primitive/Card';
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
  const {
    inlineLinkState,
    openLink,
    setInlineLinkState,
    removeInlineLink,
    setInlineLink,
  } = useInlineLink({ editor });

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
      <Popover
        modal={true}
        onOpenChange={(open) => {
          if (open) {
            setInlineLink();
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button
            type="button"
            role="button"
            tooltip="破棄する"
            variant="ghost"
          >
            <BsPersonCircle />
            アイコン変更
          </Button>
        </PopoverTrigger>
        <PopoverContent side="bottom" align="start">
          <Card>
            <CardBody>
              <ImageSelector
                selectorIconSize="30px"
                className="tiptap-inline-link__icon-selector"
                templates={TEMPLATE_SERVICE_ICONS}
                currentImageMetadata={inlineLinkState.icon}
                onChange={(next) => {
                  const success = editor
                    .chain()
                    .focus()
                    .extendMarkRange('inlineLink')
                    .setInlineLink({
                      ...inlineLinkState,
                      icon: next,
                    })
                    .run();
                }}
                customInput={{
                  canCustom: true,
                  clipSize: { width: 32, height: 32 },
                }}
              />
              {inlineLinkState.icon && inlineLinkState.icon?.src !== '' && (
                <Button
                  onClick={() => {
                    editor
                      .chain()
                      .focus()
                      .extendMarkRange('inlineLink')
                      .setInlineLink({
                        ...inlineLinkState,
                        icon: null,
                      })
                      .run();
                    setInlineLinkState(null);
                  }}
                >
                  <BsTrash className="tiptap-button-icon" />
                </Button>
              )}
            </CardBody>
          </Card>
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
    </ButtonGroup>
  );
};
