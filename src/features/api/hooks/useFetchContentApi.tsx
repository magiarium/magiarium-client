import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ContentApiName,
  ContentApiRequest,
  ContentApiResult,
} from '../constants';
import { fetchContentApi } from '../libs/fetchContentApi';

/**
 * APIキャッシュ
 */
const apiCache = new Map<
  string,
  {
    result: ContentApiResult<any>;
  }
>();

/**
 * APIキャッシュキー作成処理
 *
 * @param target 対象API名
 * @param request リクエスト
 * @returns APIキャッシュキー
 */
const createApiCacheKey = <T extends ContentApiName>(
  target: T,
  request: ContentApiRequest<T>
): string => {
  return JSON.stringify([target, request]);
};

/**
 * コンテンツAPIフェッチ用hooks
 *
 * ※．不要なリクエスト回避のため、キャッシュ&任意リフレッシュ用の機能を提供する
 *
 * @param target 対象API
 * @param request リクエスト
 * @returns APIレスポンス
 */ export const useFetchContentApi = <
  T extends ContentApiName = ContentApiName,
>(
  target: T,
  request: ContentApiRequest<T>
) => {
  const cacheKey = createApiCacheKey(target, request);

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ContentApiResult<T> | undefined>(
    () => apiCache.get(cacheKey)?.result
  );

  const isFetchingRef = useRef(false); // 2重発火防止用

  const fetch = useCallback(async () => {
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    setIsLoading(true);

    try {
      const data = await fetchContentApi(target, request);

      apiCache.set(cacheKey, { result: data });
      setResult(data);
    } finally {
      isFetchingRef.current = false;
      setIsLoading(false);
    }
  }, [target, request, cacheKey]);

  useEffect(() => {
    const cached = apiCache.get(cacheKey);

    if (cached) {
      setResult(cached.result);
      return;
    }

    void fetch();
  }, [cacheKey, fetch]);

  return { result, refresh: fetch, isLoading };
};
