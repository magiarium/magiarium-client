import { Editor } from '@tiptap/react';
import { BsArrowRepeat, BsTrash } from 'react-icons/bs';
import { Button } from '../../ui-primitive/Button';
import { ButtonGroup } from '../../ui-primitive/ButtonGroup';
import { toggleImage } from '../ImageUploadButton';

/**
 * ImageFigureコンテキストメニュー
 *
 * @param params.editor Tiptapエディターのインスタンス
 */
export const ImageFigureContextMenu = ({ editor }: { editor: Editor }) => {
  return (
    <>
      <ButtonGroup orientation={'vertical'}>
        <Button
          type="button"
          role="button"
          tooltip="画像削除"
          variant="ghost"
          onClick={() => {
            editor.chain().focus().deleteImageFigure().run();
          }}
        >
          <BsTrash className="tiptap-button-icon" />
          画像削除
        </Button>
        <Button
          type="button"
          role="button"
          tooltip="画像差し替え"
          variant="ghost"
          onClick={() => {
            toggleImage(editor);
          }}
        >
          <BsArrowRepeat className="tiptap-button-icon" />
          画像差し替え
        </Button>
      </ButtonGroup>
    </>
  );
};
