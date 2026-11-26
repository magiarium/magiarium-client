import { Size } from '@/common/type';
import { useWindowController } from '@/features/desktop/hooks/useWindowController';
import { WindowControllerId } from '@/features/desktop/type';
import { ImageMetadata } from '@magiarium/structure';
import { ChangeEvent, useState } from 'react';
import { ImageCliper } from '../components/ImageCliper';
import { loadImageMetadata } from '../libs/loadImageMetadata';

export const useImageUploader = ({
  onChange,
  clipSize,
}: {
  onChange: (next: ImageMetadata) => void;
  clipSize?: Size;
}) => {
  const [error, setError] = useState('');
  const { createWindowController } = useWindowController();

  const handleImageInput = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 画像ファイル以外は受け付けない
    if (!file.type.startsWith('image/')) {
      setError(
        `画像ファイル以外が指定されました。fileName=[${file.name}], type=[${file.type}].`
      );
      return;
    }

    // アップロードファイルから画像情報取得
    const imageMetadata = await loadImageMetadata(file);

    // エディタ種別に応じて処理
    if (clipSize) {
      const controller = createWindowController(
        {
          id: 'image-editor' as WindowControllerId,
          title: '画像編集',
          children: (
            <ImageCliper
              imageUrl={imageMetadata.src}
              clipSize={clipSize}
              onChange={(editImageMetadata: ImageMetadata) => {
                onChange(editImageMetadata);
                controller.setWindowState('CLOSED');
                controller.delete();
              }}
              onCancel={() => {
                controller.setWindowState('CLOSED');
                controller.delete();
              }}
            />
          ),
        },
        { width: 1000, height: 600 }
      );
    } else {
      // エディター不要のため、アップロードされた画像データをそのまま設定
      onChange(imageMetadata);
    }

    setError('');
  };

  return { error, handleImageInput };
};
