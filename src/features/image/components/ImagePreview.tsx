import { INITIAL_IMAGE_METADATA } from '@/common/constants';
import { useWindowController } from '@/features/desktop/hooks/useWindowController';
import { WindowControllerId } from '@/features/desktop/type';
import { ImageMetadata } from '@magiarium/structure';
import Image from 'next/image';
import './ImagePreview.scss';

export const ImagePreview = ({
  currentImageMetadata,
  onChange,
}: {
  currentImageMetadata: ImageMetadata;
  onChange: (next: ImageMetadata) => void;
}) => {
  const { createWindowController } = useWindowController();

  return (
    <div className="image-preview">
      <button
        type="button"
        onClick={() => {
          createWindowController({
            id: `preview_image_${currentImageMetadata.fileName}` as WindowControllerId,
            title: `"${currentImageMetadata.fileName}"プレビュー`,
            children: (
              <Image
                src={currentImageMetadata.path}
                alt="プレビュー"
                width={currentImageMetadata.size.width}
                height={currentImageMetadata.size.height}
              />
            ),
          });
        }}
      >
        <Image
          className="image-preview__image"
          src={currentImageMetadata.path}
          alt="プレビュー"
          width={currentImageMetadata.size.width}
          height={currentImageMetadata.size.height}
        />
      </button>
      <div className="image-preview__input-field">
        <label title="ファイル名">
          ファイル名
          <input type="text" value={currentImageMetadata.alt} disabled />
        </label>
      </div>

      <div className="image-preview__input-field">
        <label title="代替テキスト">
          代替テキスト
          <input
            type="text"
            value={currentImageMetadata.alt}
            onChange={(event) => {
              onChange({
                ...currentImageMetadata,
                alt: event.target.value,
              });
            }}
          />
        </label>
      </div>

      <button
        className="image-preview__delete-button"
        type="button"
        onClick={() => onChange(INITIAL_IMAGE_METADATA)}
      >
        画像を削除
      </button>
    </div>
  );
};
