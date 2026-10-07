'use client';
import { useLayoutEffect, useRef, useState } from 'react';

export const useContentSize = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentSize, setContentSize] = useState({
    width: 0,
    height: 0,
  });
  useLayoutEffect(() => {
    const element = contentRef.current;

    if (!element) {
      return;
    }

    const updateSize = () => {
      const { width, height } = element.getBoundingClientRect();
      setContentSize({
        width,
        height,
      });
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [contentRef]);

  return [contentRef, contentSize] as const;
};
