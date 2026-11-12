import { useCallback, useState } from 'react';
import { Area, Point, Size } from 'react-easy-crop';
import { ImageInfo, loadImageInfo } from '../libs/loadImageInfo';

/**
 * 画像クリップコンポーネント用のフック
 */
export const useImageCliper = () => {
  // エラーメッセージ
  const [error, setError] = useState('');
  // 処理状態
  const [isProcessing, setIsProcessing] = useState(false);
  // クリップ設定
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<string>('');
  const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleConfirm = async ({
    imageUrl,
    clipSize,
    onChange,
  }: {
    imageUrl: string;
    clipSize: Size;
    onChange: (imageInfo: ImageInfo) => void;
  }) => {
    if (!croppedAreaPixels || isProcessing) {
      if (!croppedAreaPixels) {
        setError('トリミング範囲を取得できません。');
      }
      return;
    }

    setError('');
    setIsProcessing(true);

    try {
      // 表示に使用している URL を再利用する
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new window.Image();

        img.onload = () => resolve(img);
        img.onerror = () => {
          reject(new Error('元画像を読み込めませんでした。'));
        };

        img.src = imageUrl;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas を利用できません。');
      }

      // 出力サイズを固定する
      canvas.width = clipSize.width;
      canvas.height = clipSize.height;

      // Canvas は初期状態で透明。
      // 画像の外側は描画されないため、透明な余白になる。
      // 背景色が指定されている場合、その色で塗りつぶす
      if (backgroundColor !== '') {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        // 背景色が未指定の場合、透明にする
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      const { x, y, width, height } = croppedAreaPixels;

      if (width <= 0 || height <= 0) {
        throw new Error('トリミング範囲が不正です。');
      }

      // 元画像の座標から出力 Canvas の座標へ変換する
      const scaleX = clipSize.width / width;
      const scaleY = clipSize.height / height;

      // 画像全体を配置し、Canvas の外側にはみ出す部分を
      // Canvas 自体にクリップさせる。
      // x / y が負数でも、画像の外側を透明なまま保持できる。
      ctx.drawImage(
        image,
        -x * scaleX,
        -y * scaleY,
        image.naturalWidth * scaleX,
        image.naturalHeight * scaleY
      );

      // WebP に変換（透明部分も保持する）
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (result) => {
            if (result) {
              resolve(result);
            } else {
              reject(new Error('画像を変換できませんでした。'));
            }
          },
          'image/webp',
          0.9
        );
      });

      const croppedFile = new File([blob], 'cropped-image.webp', {
        type: 'image/webp',
        lastModified: Date.now(),
      });

      const imageInfo = await loadImageInfo(croppedFile);

      onChange(imageInfo);
    } catch (err) {
      setError('画像の加工に失敗しました。');
    } finally {
      setIsProcessing(false);
    }
  };

  return {
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
  };
};
