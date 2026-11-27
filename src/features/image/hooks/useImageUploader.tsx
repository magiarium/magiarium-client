import { ImageMetadata } from '@magiarium/structure';
import { ChangeEvent, useState } from 'react';
import { loadImageMetadata } from '../libs/loadImageMetadata';

export const useImageUploader = ({
  onChange,
}: {
  onChange: (next: ImageMetadata) => void;
}) => {
  const [error, setError] = useState('');

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

    onChange(imageMetadata);

    setError('');
  };

  return { error, handleImageInput };
};
