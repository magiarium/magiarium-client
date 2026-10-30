import { InputNumberWithSlider } from '@/common/components/InputNumberWithSlider';
import { Size } from '@/common/type';
import Cropper from 'react-easy-crop';
import {
  ColorCode,
  ColorPicker,
} from '../../../common/components/InputColorPicker';
import { useImageCliper } from '../hooks/useImageCliper';
import { ImageInfo } from '../libs/loadImageInfo';
import './ImageCliper.scss';

type ImageCliperProps = {
  imageUrl: string;
  clipSize: Size;
  onChange: (imageInfo: ImageInfo) => void;
  onCancel: () => void;
};

export const ImageCliper = ({
  imageUrl,
  clipSize,
  onChange,
  onCancel,
}: ImageCliperProps) => {
  const {
    crop,
    setCrop,
    zoom,
    setZoom,
    onCropComplete,
    backgroundColor,
    setBackgroundColor,
    isProcessing,
    error,
    handleConfirm,
  } = useImageCliper();

  return (
    <div className="image-uploader">
      <div className="image-uploader__cropper">
        <span>クリップ範囲を選択</span>
        <Cropper
          image={imageUrl}
          crop={crop}
          zoom={zoom}
          aspect={clipSize.width / clipSize.height}
          minZoom={0.1}
          maxZoom={3}
          restrictPosition={false}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          style={{
            containerStyle: {
              backgroundColor: backgroundColor || 'var(--surface-color)',
              backgroundImage: backgroundColor
                ? 'none'
                : 'var(--background-checkerboard)',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
            },
          }}
        />
      </div>
      <p className="image-uploader__cropper-adside">
        出力サイズ：{clipSize.width} × {clipSize.height} px
      </p>

      <ColorPicker
        label="背景色を選択"
        currentColor={backgroundColor}
        onChange={(colorCode: ColorCode) => {
          setBackgroundColor(colorCode);
        }}
      />

      <InputNumberWithSlider
        label="倍率を選択"
        currentNumber={zoom}
        changeNumber={(next: number) => setZoom(next)}
      />

      {error && (
        <p role="alert" className="image-uploader__error">
          {error}
        </p>
      )}

      <div className="image-uploader__footer">
        <button type="button" onClick={onCancel}>
          キャンセル
        </button>

        <button
          type="button"
          onClick={() => {
            handleConfirm({
              imageUrl,
              clipSize,
              onChange,
            });
          }}
          disabled={isProcessing}
        >
          {isProcessing ? '処理中...' : 'この範囲で確定'}
        </button>
      </div>
    </div>
  );
};
