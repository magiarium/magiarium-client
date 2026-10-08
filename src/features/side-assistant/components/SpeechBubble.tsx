import { Coordinates } from '@/common/type';
import './SpeechBubble.scss';

/**
 * ふきだしバブル
 * @param params.contentSize ふきだし内コンテンツのサイズ
 * @param params.tailPosition ふきだしのしっぽ座標
 * @returns ふきだしバブル
 */
export const SpeechBubble = ({
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
      className="speech-bubble"
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
