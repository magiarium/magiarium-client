import { ImageMetadata } from '@magiarium/structure';
import Image from 'next/image';
import { ChangeEvent } from 'react';
import { BsPlus } from 'react-icons/bs';
import './ImageSelector.scss';

export const ImageSelector = ({
  templates,
  onSelect,
  onInput,
}: {
  templates: ImageMetadata[];
  onSelect: (next: ImageMetadata) => void;
  onInput?: (event: ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className="image-selector">
      {templates.map((targetImage, index) => {
        return (
          <button
            key={`template-image-${index}`}
            className="image-selector__swatch"
            onClick={() => {
              onSelect(targetImage);
            }}
          >
            <Image
              src={targetImage.path}
              alt={targetImage.alt}
              width={targetImage.attributes.width}
              height={targetImage.attributes.height}
            />
          </button>
        );
      })}
      {onInput && (
        <label title="新規画像追加" className="image-selector__custom">
          <BsPlus />
          <input type="file" accept="image/*" onChange={onInput} />
        </label>
      )}
    </div>
  );
};
