import { MAGIARIUM_RESOURCE_URL } from '@/constants';
import { getUrl } from '@aws-amplify/storage';

const isDev = process.env.NODE_ENV !== 'production';

/**
 * 引数をもとに、resourceURL配列を動的に生成する
 *
 * @param src リソースURL
 */
export const generateResourceURL = async (src: string): Promise<string[]> => {
  // 外部URL or BlobURL
  if (/^https?:\/\//.test(src) || src.startsWith('blob')) {
    return [src];
  }

  // public配下を優先
  const urls = [`/${src.replace(/^\/+/, '')}`];

  // DEV: Amplify Storage
  if (isDev) {
    const result = await getUrl({ path: src.replace(/^\/+/, '') });
    urls.push(result.url.toString());

    return urls;
  }

  // PROD: BASE_URL
  urls.push(new URL(src, MAGIARIUM_RESOURCE_URL).toString());

  return urls;
};
