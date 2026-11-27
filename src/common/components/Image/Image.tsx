import { LoadingCircle } from '@/common/components/LoadingCircle/LoadingCircle';
import { generateResourceURL } from '@/common/libs/generateResourceURL';
import NextImage from 'next/image';
import { ComponentProps, forwardRef, useEffect, useState } from 'react';
import { useImage } from 'react-image';
import './Image.scss';

type ImageProps = ComponentProps<typeof NextImage> & {
  strictImport?: boolean;
};

export const Image = forwardRef<HTMLImageElement, ImageProps>(
  ({ src, alt, strictImport = false, ...props }, ref) => {
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [systemError, setSystemError] = useState(false);

    useEffect(() => {
      let cancelled = false;

      const resolve = async () => {
        if (strictImport || typeof src !== 'string') return;

        try {
          const urls = await generateResourceURL(src);
          urls.push('/assets/images/not_found.webp');

          if (!cancelled) {
            setImageUrls(urls);
          }
        } catch {
          // リソースURLの生成に失敗した場合、システムエラー扱い
          if (!cancelled) {
            setSystemError(true);
            setImageUrls(['/assets/images/system_error.webp']);
          }
        }
      };

      setImageUrls([]);
      setSystemError(false);

      if (typeof src === 'string') {
        resolve();
      }

      return () => {
        cancelled = true;
      };
    }, [src]);

    const image = useImage({
      srcList: imageUrls,
      useSuspense: false,
    });

    // 即時読み込み
    if (typeof src !== 'string' || strictImport) {
      return <NextImage ref={ref} src={src} alt={alt} {...props} />;
    }

    if (image.isLoading || !image.src) {
      return (
        <div className="image-loading">
          <LoadingCircle />
        </div>
      );
    }

    if (systemError) {
      return (
        <NextImage
          ref={ref}
          src="/assets/images/system_error.webp"
          alt={alt}
          {...props}
          width={515}
          height={515}
        />
      );
    }

    if (image.error) {
      return (
        <NextImage
          ref={ref}
          src="/assets/images/not_found.webp"
          alt={alt}
          {...props}
          width={515}
          height={515}
        />
      );
    }

    return <NextImage ref={ref} src={image.src} alt={alt} {...props} />;
  }
);

Image.displayName = 'Image';
