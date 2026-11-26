import { getNowDateTimeString } from '@/common/libs/getNowDatetimeString';
import { ImageMetadata } from '@magiarium/structure';

/**
 * 画像情報読み込み処理
 */
export const loadImageMetadata = (file: File): Promise<ImageMetadata> => {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      resolve({
        src: img.src,
        alt: file.name,
        originalWidth: img.width,
        originalHeight: img.height,
        uploadedAt: getNowDateTimeString(),
      });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};
