import { withNodeAppendedToLastParagraph } from '@/common/libs/withNodeAppendedToLastParagraph';
import { Coordinates } from '@/common/type';
import { AnimationTextAdvance } from '@/features/animation/components/AnimationTextAdvance';
import { AnimationTextTypeWriter } from '@/features/animation/components/AnimationTextTypeWriter';
import { isValidElement, ReactNode, useEffect, useState } from 'react';
import { useContentSize } from '../../../common/hooks/useContentSize';
import { SIDE_ASSISTANT_SPEECH_ANIMATION_ID } from '../constants';
import './Speech.scss';
import { SpeechBubble } from './SpeechBubble';

/**
 * 台詞
 *
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
  const [sepeechContent, setSpeechContent] = useState<ReactNode>();
  useEffect(() => {
    setSpeechContent(
      <AnimationTextTypeWriter
        id={SIDE_ASSISTANT_SPEECH_ANIMATION_ID}
        onComplete={() => {
          setSpeechContent(
            withNodeAppendedToLastParagraph({
              target: children,
              appendNode: <AnimationTextAdvance />,
            })
          );
        }}
      >
        {children}
      </AnimationTextTypeWriter>
    );
  }, [children]);

  return (
    <div className="speech" ref={parentContentRef}>
      {isValidElement(children) && (
        <SpeechBubble
          contentSize={contentSize}
          tailPosition={correctedTailPosition}
        />
      )}
      <div className="speech__content" ref={contentRef}>
        {sepeechContent}
      </div>
    </div>
  );
};
