import { Dialog } from '@/common/components/Dialog';
import { Image } from '@/common/components/Image';
import { Size } from '@/common/type';
import { ImageMetadata } from '@magiarium/structure';
import classNames from 'classnames';
import { useState } from 'react';
import { BsPlus } from 'react-icons/bs';
import { useImageUploader } from '../../hooks/useImageUploader';
import { ImageCliper } from '../ImageCliper/ImageCliper';
import './ImageSelector.scss';

type CustomInput =
  | {
      canCustom: true;
      clipSize?: Size;
    }
  | { canCustom: false };

export const ImageSelector = ({
  currentImageMetadata,
  templates,
  onChange,
  className,
  selectorIconSize = '100px',
  customInput = { canCustom: false },
}: {
  currentImageMetadata?: ImageMetadata | null;
  templates: ImageMetadata[];
  onChange: (next: ImageMetadata) => void;
  className?: string;
  selectorIconSize?: string;
  customInput?: CustomInput;
}) => {
  const [clipImage, setClipImage] = useState<ImageMetadata | null>(null);
  const { error, handleImageInput } = useImageUploader({
    onChange: (next) => {
      if (customInput.canCustom && next.src) {
        setClipImage(next);
      } else {
        onChange(next);
      }
    },
  });
  return (
    <div
      className={classNames('image-selector', className)}
      style={
        {
          '--image-selector-icon-size': selectorIconSize,
        } as React.CSSProperties
      }
    >
      {templates.map((targetImage, index) => {
        return (
          <button
            type="button"
            key={`template-image-${index}`}
            className={classNames(
              'image-selector__swatch',
              currentImageMetadata?.src === targetImage.src &&
                'image-selector__swatch--active'
            )}
            onClick={() => {
              onChange(targetImage);
            }}
          >
            <Image
              src={targetImage.src}
              alt={targetImage.alt ?? ''}
              title={targetImage.title ?? ''}
              width={targetImage.originalWidth}
              height={targetImage.originalHeight}
            />
          </button>
        );
      })}
      {customInput.canCustom && (
        <>
          <label title="新規画像追加" className="image-selector__custom">
            <BsPlus />
            <input type="file" accept="image/*" onChange={handleImageInput} />
          </label>
          {error && (
            <span className="image-selector__error-message">{error}</span>
          )}

          {customInput.clipSize && (
            <Dialog
              isOpen={!!clipImage}
              onOpenChange={(open) => {
                if (!open) {
                  setClipImage(null);
                }
              }}
            >
              {clipImage && (
                <ImageCliper
                  imageUrl={clipImage.src}
                  clipSize={customInput.clipSize}
                  onChange={(editImageMetadata: ImageMetadata) => {
                    onChange(editImageMetadata);
                    setClipImage(null);
                  }}
                  onCancel={() => {
                    setClipImage(null);
                  }}
                />
              )}
            </Dialog>
          )}
        </>
      )}
    </div>
  );
};
