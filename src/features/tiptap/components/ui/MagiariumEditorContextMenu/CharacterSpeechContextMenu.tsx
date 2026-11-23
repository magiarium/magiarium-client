import { PopoverContent } from '@radix-ui/react-popover';
import { Editor } from '@tiptap/react';
import { BsChatFill, BsTrash } from 'react-icons/bs';
import { Button } from '../../ui-primitive/Button';
import { ButtonGroup } from '../../ui-primitive/ButtonGroup';
import { Card, CardBody } from '../../ui-primitive/Card';
import { Popover, PopoverTrigger } from '../../ui-primitive/Popover';
import { Separator } from '../../ui-primitive/Separator';
import { CharacterSpeechPopover } from '../CharacterSpeechPopover';
import { ColorUnionPopover } from '../ColorUnionPopover';
import { FontSizeDropdownMenu } from '../FontSizeDropdownMenu';
import { InlineLinkPopover } from '../InlineLinkPopover';
import { InlineQuoteButton } from '../InlineQuoteButton';
import { KbdButton } from '../KbdButton';
import { MarkButton } from '../MarkButton';
import { RubyTextPopover } from '../RubyTextPopover';
import { TextAlignDropdownMenu } from '../TextAlignDropdownMenu';

/**
 * キャラクタースピーチコンテキストメニュー
 *
 * @param params.editor Tiptapエディターのインスタンス
 */
export const CharacterSpeechContextMenu = ({ editor }: { editor: Editor }) => {
  return (
    <>
      <Popover modal={true}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            role="button"
            tooltip="アイコン設定"
            data-active-state={'on'}
            variant="ghost"
          >
            <BsChatFill className="tiptap-button-icon" />
            キャラクタースピーチ設定
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Card>
            <CardBody>
              <ButtonGroup orientation={'vertical'}>
                <CharacterSpeechPopover editor={editor} text={'アイコン設定'} />
                <Button
                  type="button"
                  role="button"
                  tooltip="キャラクタースピーチ削除"
                  variant="ghost"
                  onClick={() => {
                    editor.chain().focus().removeCharacterSpeech().run();
                  }}
                >
                  <BsTrash className="tiptap-button-icon" />
                  キャラクタースピーチ削除
                </Button>
              </ButtonGroup>
            </CardBody>
          </Card>
        </PopoverContent>
      </Popover>
      <Separator />
      {/** Mark修正系 */}
      <MarkButton editor={editor} type="bold" />
      <MarkButton editor={editor} type="italic" />
      <MarkButton editor={editor} type="strike" />
      <MarkButton editor={editor} type="underline" />
      <Separator />
      <ColorUnionPopover editor={editor} />
      <FontSizeDropdownMenu editor={editor} />
      <TextAlignDropdownMenu editor={editor} />
      <Separator />
      <InlineLinkPopover editor={editor} autoOpenOnLinkActive={false} />
      <MarkButton editor={editor} type="code" />
      <InlineQuoteButton editor={editor} />
      <RubyTextPopover editor={editor} />
      <KbdButton editor={editor} />
    </>
  );
};
