import { Size } from '@/common/type';
import { ImageSelector } from '@/features/image/components/ImageSelector';
import { ImageMetadata } from '@magiarium/structure';
import { useImageUploader } from '../hooks/useImageUploader';
import { ImagePreview } from './ImagePreview';
import './ImageUploader.scss';

export const ImageUploader = ({
  currentImage,
  onChange,
  clipSize,
  templates,
}: {
  currentImage: ImageMetadata;
  onChange: (next: ImageMetadata) => void;
  clipSize?: Size;
  templates?: ImageMetadata[];
}) => {
  const { error, handleImageInput } = useImageUploader({ clipSize, onChange });

  if (currentImage.path) {
    // 既に選択済みであればプレビュー
    return (
      <div className="image-uploader__input-field">
        <ImagePreview currentImageMetadata={currentImage} onChange={onChange} />
      </div>
    );
  }

  if (templates && templates.length > 1) {
    return (
      <div className="image-uploader__input-field">
        <ImageSelector
          templates={templates}
          onSelect={onChange}
          onInput={handleImageInput}
        />
        {error && <div className="image-uploader__error">{error}</div>}
      </div>
    );
  }

  return (
    <div className="image-uploader__input-field">
      <label title={'画像を選択'}>
        <input
          type="file"
          accept="image/*"
          value={currentImage.path}
          onChange={handleImageInput}
        />
      </label>
      {error && <div className="image-uploader__error">{error}</div>}
    </div>
  );
};
