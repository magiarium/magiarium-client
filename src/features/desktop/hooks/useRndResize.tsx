import { useEffect, useRef } from 'react';
import { Rnd } from 'react-rnd';

/**
 * Windowサイズに応じてRnd(Window)を自動でリサイズするためのhooks
 */
export const useRndResize = () => {
  const ref = useRef<Rnd>(null);

  useEffect(() => {
    const rnd = ref.current;

    if (!rnd) {
      return;
    }

    const element = rnd.getSelfElement();

    if (!element) {
      return;
    }

    const rect = element.getBoundingClientRect();

    let x = rect.left;
    let y = rect.top;
    let width = rect.width;
    let height = rect.height;

    // viewport より大きくなっていたらサイズを縮める
    width = Math.min(width, window.innerWidth);
    height = Math.min(height, window.innerHeight);

    // viewport 内に収まるように位置を補正
    x = Math.max(0, Math.min(x, window.innerWidth - width));
    y = Math.max(0, Math.min(y, window.innerHeight - height));

    rnd.updateSize({
      width,
      height,
    });

    rnd.updatePosition({
      x,
      y,
    });
  }, [window.innerWidth, window.innerHeight]);

  return { ref };
};
