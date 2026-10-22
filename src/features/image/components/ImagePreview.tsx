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
            id: `preview_image_${currentImageMetadata.title}` as WindowControllerId,
            title: `"${currentImageMetadata.title}"プレビュー`,
            children: (
              <Image
                src={currentImageMetadata.path}
                alt="サムネイルプレビュー"
                width={currentImageMetadata.attributes.width}
                height={currentImageMetadata.attributes.height}
              />
            ),
          });
        }}
      >
        <Image
          className="image-preview__image"
          src={currentImageMetadata.path}
          alt="サムネイルプレビュー"
          width={currentImageMetadata.attributes.width}
          height={currentImageMetadata.attributes.height}
        />
      </button>
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
      <div className="image-preview__input-field">
        <label title="ファイル名">
          ファイル名
          <input
            type="text"
            value={currentImageMetadata.alt}
            onChange={(event) => {
              onChange({
                ...currentImageMetadata,
                title: event.target.value,
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
