export type ImageInfo = {
  // ファイル名
  fileName: string;
  size: {
    // 横幅
    width: number;
    // 縦幅
    height: number;
  };
  // URL
  blobUrl: string;
  // mimeType
  mimeType: string;
};

/**
 * 画像情報読み込み処理
 */
export const loadImageInfo = (file: File): Promise<ImageInfo> => {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      resolve({
        fileName: file.name,
        size: {
          width: img.width,
          height: img.height,
        },
        blobUrl: img.src,
        mimeType: file.type,
      });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};
