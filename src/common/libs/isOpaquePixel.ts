/**
 * 画像に対して、不透明ピクセルに対してのみ当たり判定をチェックする処理
 *
 * @param params.img 画像エレメント
 * @param params.positionX x座標
 * @param params.positionY y座標
 * @returns
 */
export const isOpaquePixel = ({
  img,
  positionX,
  positionY,
}: {
  img: HTMLImageElement | null;
  positionX: number;
  positionY: number;
}): boolean => {
  if (!(img instanceof HTMLImageElement)) {
    return false;
  }
  const rect = img.getBoundingClientRect();

  const x = Math.floor(
    ((positionX - rect.left) / rect.width) * img.naturalWidth
  );

  const y = Math.floor(
    ((positionY - rect.top) / rect.height) * img.naturalHeight
  );

  // 画像の範囲外
  if (x < 0 || x >= img.naturalWidth || y < 0 || y >= img.naturalHeight) {
    return false;
  }

  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return false;
  }

  ctx.drawImage(img, 0, 0);

  const pixel = ctx.getImageData(x, y, 1, 1).data;

  return pixel[3] > 0;
};
