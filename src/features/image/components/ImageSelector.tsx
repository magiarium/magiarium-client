import { ImageMetadata } from '@magiarium/structure';
import classNames from 'classnames';
import Image from 'next/image';
import { ChangeEvent } from 'react';
import { BsPlus } from 'react-icons/bs';
import './ImageSelector.scss';

export const ImageSelector = ({
  className,
  templates,
  isActive,
  onSelect,
  onInput,
  iconSize,
}: {
  className?: string;
  templates: ImageMetadata[];
  iconSize?: string;
  isActive?: (current: ImageMetadata) => boolean;
  onSelect: (next: ImageMetadata) => void;
  onInput?: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemove?: () => void;
}) => {
  return (
    <div
      className={classNames('image-selector', className)}
      style={
        iconSize
          ? ({
              '--image-selector-icon-size': iconSize,
            } as React.CSSProperties)
          : ({
              '--image-selector-icon-size': '100px',
            } as React.CSSProperties)
      }
    >
      {templates.map((targetImage, index) => {
        return (
          <button
            type="button"
            key={`template-image-${index}`}
            className={classNames(
              'image-selector__swatch',
              isActive?.(targetImage) && 'image-selector__swatch--active'
            )}
            onClick={() => {
              onSelect(targetImage);
            }}
          >
            <Image
              src={targetImage.path}
              alt={targetImage.alt}
              width={targetImage.size.width}
              height={targetImage.size.height}
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
