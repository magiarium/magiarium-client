import { useContentSize } from '@/common/hooks/useContentSize';
import { withNodeAppendedToLastParagraph } from '@/common/libs/withNodeAppendedToLastParagraph';
import { Coordinates } from '@/common/type';
import { AnimationTextAdvance } from '@/features/animation/components/AnimationTextAdvance';
import { AnimationTextTypeWriter } from '@/features/animation/components/AnimationTextTypeWriter';
import { SIDE_ASSISTANT_SPEECH_ANIMATION_ID } from '@/features/side-assistant/constants';
import { isValidElement, ReactNode, useEffect, useState } from 'react';
import './Speech.scss';

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

/**
 * ふきだしバブル
 * @param params.contentSize ふきだし内コンテンツのサイズ
 * @param params.tailPosition ふきだしのしっぽ座標
 * @returns ふきだしバブル
 */
const SpeechBubble = ({
  contentSize,
  tailPosition,
}: {
  contentSize: { width: number; height: number };
  tailPosition?: Coordinates;
}) => {
  const tailX = contentSize.width * ((tailPosition?.x ?? 50) / 100);

  const tailWidth = 10;
  const tailHeight = 15;

  const tailY = contentSize.height + tailHeight;

  const path = `
  M 5 5
  H ${contentSize.width - 5}
  Q ${contentSize.width} 5 ${contentSize.width} 10
  V ${contentSize.height - 5}
  Q ${contentSize.width} ${contentSize.height}
    ${contentSize.width - 5} ${contentSize.height}

  H ${tailX + tailWidth / 2}
  L ${tailX} ${tailY}
  L ${tailX - tailWidth / 2} ${contentSize.height}

  H 5
  Q 1 ${contentSize.height} 1 ${contentSize.height - 5}
  V 10
  Q 1 5 5 5
  Z
`;

  return (
    <svg
      className="speech__bubble"
      viewBox={`0 0 ${contentSize.width} ${contentSize.height + tailHeight}`}
      style={{ width: contentSize.width }}
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={path}
        fill="white"
        stroke="black"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  );
};
