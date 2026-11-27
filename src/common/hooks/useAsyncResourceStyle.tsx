import { useEffect, useMemo, useState } from 'react';
import { generateResourceURL } from '../libs/generateResourceURL';

type AsyncStyleOptions = {
  property: `--${string}`;
  enabled?: boolean;
};

/**
 * リソースURLからimage-set用のＣＳＳを作成する処理
 *
 * @param resource リソースURL
 * @param options プロパティオプション
 * @returns CSS
 */
export const useAsyncResourceStyle = (
  resource: string | string[],
  options: AsyncStyleOptions
): React.CSSProperties => {
  const { property, enabled = true } = options;

  const [urls, setUrls] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const resources = Array.isArray(resource) ? resource : [resource];

        const results = await Promise.all(
          resources.map((item) => generateResourceURL(item))
        );

        if (!cancelled) {
          setUrls(results.flat());
        }
      } catch {
        if (!cancelled) {
          setUrls([]);
        }
      }
    };

    if (enabled) {
      load();
    } else {
      setUrls([]);
    }

    return () => {
      cancelled = true;
    };
  }, [resource, generateResourceURL, enabled]);

  return useMemo(
    () =>
      enabled && urls.length > 0
        ? ({
            [property]: `image-set(${urls
              .map((url) => `url("${url}")`)
              .join(', ')})`,
          } as React.CSSProperties)
        : {},
    [property, urls, enabled]
  );
};
