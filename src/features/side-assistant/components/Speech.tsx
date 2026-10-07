import { Coordinates } from '@/common/type';
import { isValidElement, ReactNode } from 'react';
import { useContentSize } from '../../../common/hooks/useContentSize';
import './Speech.scss';
import { SpeechBubble } from './SpeechBubble';

/**
 * 台詞
 * @param params.children 台詞本体
 * @param params.tailPosition ふきだしのしっぽ座標
 */
export const Speech = ({
  children,
  tailPosition,
}: {
  children: ReactNode;
  tailPosition: Coordinates;
}): ReactNode => {
  const [contentRef, contentSize] = useContentSize();
  const [parentContentRef, parentSize] = useContentSize();
  const correctedTailPosition = {
    x:
      parentSize.width > 0
        ? tailPosition.x * (parentSize.width / contentSize.width)
        : tailPosition.x,
    y: tailPosition.y,
  };
  return (
    <div className="speech" ref={parentContentRef}>
      {isValidElement(children) && (
        <SpeechBubble
          contentSize={contentSize}
          tailPosition={correctedTailPosition}
        />
      )}
      <div className="speech__content" ref={contentRef}>
        {children}
      </div>
    </div>
  );
};
