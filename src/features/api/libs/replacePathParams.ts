/**
 * パスパラムを所定の値に置換する処理
 *
 * 例)
 * ・`blog/{itemId}` → `blog/00000001`
 *
 * @param params.path パス
 * @param params.params パラメータ
 * @returns 置換後パスパラメータ
 */
export const replacePathParams = ({
  path,
  params,
}: {
  path: string;
  params: Record<string, string>;
}) => {
  Object.entries(params).forEach(([key, value]) => {
    path = path.replace(`{${key}}`, encodeURIComponent(value));
  });

  return path;
};
