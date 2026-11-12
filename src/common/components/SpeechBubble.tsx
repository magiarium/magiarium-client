'use client';

import { ReactNode, useMemo } from 'react';
import { useContentSize } from '../hooks/useContentSize';
import { Coordinates } from '../type';
import './SpeechBubble.scss';

/**
 * コンテンツに吹き出しを追加するコンポーネント
 * ※最低限childrenのみで吹き出しを利用可能
 *
 * @param params.children 吹き出しに表示する内容
 * @param params.tailPosition 吹き出しのしっぽ座標（単位: px）
 * @param params.width 吹き出し横幅（単位: px） ※未指定の場合は子要素に応じて自動的に調整
 * @param params.height 吹き出し高さ（単位: px） ※未指定の場合は子要素に応じて自動的に調整
 * @param params.widthRange 吹き出し横幅の範囲
 * @param params.heightRange 吹き出し縦幅の範囲
 * @param params.radius 吹き出しの角の丸み（単位: px）
 * @param params.tailRootWidth 吹き出し尻尾の付け根の大きさ（単位: px）
 * @param params.stroke 吹き出し線の色（カラーコード）
 * @param params.strokeWidth 吹き出し線の太さ（単位: px）
 *
 */
export const Speech = ({
  children,
  tailPosition = { x: 0, y: 0 },
  width,
  height,
  widthRange,
  heightRange,
  radius = 5,
  tailRootWidth = 15,
  stroke = 'black',
  strokeWidth = 2.5,
}: {
  children: ReactNode;
  width?: number;
  height?: number;
  widthRange?: { min?: number; max?: number };
  heightRange?: { min?: number; max?: number };
  tailPosition?: Coordinates;
  radius?: number;
  tailRootWidth?: number;
  stroke?: string;
  strokeWidth?: number;
}) => {
  const [contentRef, flexContentSize] = useContentSize();

  const bubbleConfig = createBubbleConfig({
    contentSize: {
      width: clamp(width ?? flexContentSize.width, widthRange),
      height: clamp(height ?? flexContentSize.height, heightRange),
    },
    tailPosition,
    radius,
    tailRootWidth,
    stroke,
    strokeWidth,
  });

  const style = useMemo(() => {
    switch (bubbleConfig.tailSide) {
      case 'bottom':
        return {
          marginBottom: bubbleConfig.paddingY,
        };
      case 'left':
        return {
          marginLeft: -bubbleConfig.paddingX,
        };
      case 'right':
        return {
          marginRight: bubbleConfig.paddingX,
        };
      case 'top':
        return {
          marginTop: bubbleConfig.paddingX,
        };
    }
  }, [bubbleConfig]);

  return (
    <div className="speech">
      <SpeechBubble bubbleConfig={bubbleConfig} />
      <div className="speech__content" ref={contentRef} style={style}>
        {children}
      </div>
    </div>
  );
};

/**
 * 吹き出し描画コンポーネント
 *
 * @param params.bubbleConfig 吹き出し設定
 */
export const SpeechBubble = ({
  bubbleConfig,
}: {
  bubbleConfig: BubbleConfig;
}) => {
  const speechBubblePath = createSpeechBubblePath(bubbleConfig);

  return (
    <svg
      className="speech__bubble"
      viewBox={`
      ${bubbleConfig.tailSide === 'left' ? bubbleConfig.paddingX : -bubbleConfig.strokeWidth}
      ${bubbleConfig.tailSide === 'top' ? bubbleConfig.paddingY : bubbleConfig.strokeWidth} 
      ${bubbleConfig.width + bubbleConfig.strokeWidth * 2 + Math.abs(bubbleConfig.paddingX)} 
      ${bubbleConfig.height + bubbleConfig.strokeWidth * 2 + Math.abs(bubbleConfig.paddingY)}
       `}
      style={{
        width:
          bubbleConfig.width +
          Math.abs(bubbleConfig.paddingX) +
          bubbleConfig.strokeWidth * 2,
        height:
          bubbleConfig.height +
          Math.abs(bubbleConfig.paddingY) +
          bubbleConfig.strokeWidth * 2,
      }}
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={speechBubblePath}
        fill="white"
        stroke={bubbleConfig.stroke}
        strokeWidth={bubbleConfig.strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
};

/**
 * 設定をもとに、吹き出し描画用のパスを作成する処理
 *
 * @param bubbleConfig 吹き出し描画用の設定
 * @returns SVG描画用のパス
 */
export const createSpeechBubblePath = (bubbleConfig: BubbleConfig) => {
  const {
    width,
    height,
    tailX,
    tailY,
    tailSide,
    paddingX,
    paddingY,
    radius,
    tailRootWidth,
  } = bubbleConfig;

  const clamp = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(max, value));

  const tx = clamp(
    tailX,
    radius + tailRootWidth / 2,
    width - radius - tailRootWidth / 2
  );
  const ty = clamp(
    tailY,
    radius + tailRootWidth / 2,
    height - radius - tailRootWidth / 2
  );

  switch (tailSide) {
    case 'bottom':
      return `
        M 5 5
        H ${width - 5}
        Q ${width} 5 ${width} 10
        V ${height - 5}
        Q ${width} ${height} ${width - 5} ${height}
        
        H ${tx + tailRootWidth / 2}
        L ${tx} ${height + paddingY}
        L ${tx - tailRootWidth / 2} ${height}

        H 5
        Q 0 ${height} 0 ${height - 5}
        V 10
        Q 0 5 5 5
        Z
      `;
    case 'top':
      return `
        M 5 5
        H ${tx - tailRootWidth / 2}
        L ${tx} ${paddingY}
        L ${tx + tailRootWidth / 2} 5

        H ${width - 5}
        Q ${width} 5 ${width} 10
        V ${height - 5}
        Q ${width} ${height} ${width - 5} ${height}

        H 5
        Q 0 ${height} 0 ${height - 5}
        V 10
        Q 0 5 5 5
        Z
      `;
    case 'left':
      return `
        M 5 5
        H ${width - 5}
        Q ${width} 5 ${width} 10
        V ${height - 10}
        Q ${width} ${height} ${width - 5} ${height}
        H 5
        Q 0 ${height} 0 ${height - 5}
        V ${ty + tailRootWidth / 2}
        L ${paddingX} ${ty}
        L 0 ${ty - tailRootWidth / 2}
        V ${ty - tailRootWidth / 2 < 10 ? ty - tailRootWidth / 2 : 10}
        Q 0 5 5 5
        Z
      `;
    case 'right':
      return `
        M 5 5
        H ${width - 5}
        Q ${width} 5 ${width} 10
        V ${ty - tailRootWidth / 2}
        L ${width + paddingX} ${ty}
        L ${width} ${ty + tailRootWidth / 2}
        V ${height - 5}
        Q ${width} ${height} ${width - 5} ${height}
        H 5
        Q 0 ${height} 0 ${height - 5}
        V 10
        Q 0 5 5 5
        Z
      `;
    default:
      return `
        M 5 5
        H ${width - 5}
        Q ${width} 5 ${width} 10
        V ${height - 5}
        Q ${width} ${height} ${width - 5} ${height}
        H 5
        Q 0 ${height} 0 ${height - 5}
        V 10
        Q 0 5 5 5
        Z
      `;
  }
};

/**
 * 吹き出し機能用の設定
 */
type BubbleConfig = {
  /**
   * 横幅
   */
  width: number;
  /**
   * 高さ
   */
  height: number;
  /**
   * 吹き出しのしっぽ位置(X座標)
   */
  tailX: number;
  /**
   * 吹き出しのしっぽ位置(Y座標)
   */
  tailY: number;
  /**
   * 吹き出しのしっぽの方向(nullの場合はしっぽなし)
   */
  tailSide: 'top' | 'bottom' | 'right' | 'left' | null;
  /**
   * 親要素に対して、しっぽの分だけX座標の描画位置をずらすための値
   */
  paddingX: number;
  /**
   * 親要素に対して、しっぽの分だけY座標の描画位置をずらすための値
   */
  paddingY: number;
  /**
   * ふきだし角の丸み
   */
  radius: number;
  /**
   * しっぽの付け根の大きさ
   */
  tailRootWidth: number;
  /**
   * 吹き出し線の太さ
   */
  stroke: string;
  /**
   * 吹き出し線の色
   */
  strokeWidth: number;
};

/**
 * 吹き出しバブル設定の作成処理
 *
 * @param param0
 * @returns 吹き出しバブル用の設定
 */
const createBubbleConfig = ({
  contentSize,
  tailPosition,
  radius,
  tailRootWidth,
  stroke,
  strokeWidth,
}: {
  contentSize: { width: number; height: number };
  tailPosition: Coordinates;
  radius: number;
  tailRootWidth: number;
  stroke: string;
  strokeWidth: number;
}): BubbleConfig => {
  const { width, height } = contentSize;

  const config: BubbleConfig = {
    width,
    height,
    tailX: 0,
    tailY: 0,
    tailSide: null,
    paddingX: 0,
    paddingY: 0,
    radius,
    tailRootWidth,
    stroke,
    strokeWidth,
  };

  const { x, y } = tailPosition;

  if (x < 0) {
    config.tailX = 0;
    config.paddingX = x;
    config.tailSide = 'left';
  } else if (width < x) {
    config.tailX = width;
    config.paddingX = x - width;
    config.tailSide = 'right';
  } else {
    config.tailX = width * x;
  }

  if (y < 0) {
    config.tailY = 0;
    config.paddingY = y;
    config.tailSide = 'top';
  } else if (height < y) {
    config.tailY = height;
    config.paddingY = y - height;
    config.tailSide = 'bottom';
  } else {
    config.tailY = y;
  }

  return config;
};

/**
 * 値を範囲内に丸め込むための処理
 *
 * @param value 値
 * @param range 値の範囲
 * @returns 範囲内の値
 */
const clamp = (value: number, range?: { min?: number; max?: number }) => {
  return Math.max(
    range?.min ?? -Infinity,
    Math.min(value, range?.max ?? Infinity)
  );
};
