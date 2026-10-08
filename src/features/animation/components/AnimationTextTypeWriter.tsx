'use client';

import { splitTextToCharSpan } from '@/common/libs/splitTextToCharSpan';
import { ReactNode, useEffect, useRef } from 'react';
import { useAnimationController } from '../hooks/useAnimationController';
import { createTypeWriterAnimationController } from '../libs/factory/createTextTypeWriterAnimationController';

/**
 * テキストタイプライターアニメーション
 *
 * @param params.id コントローラーID
 * @param params.children テキストタイプライターアニメーションを適用する子要素
 * @param params.typeMode タイピングモード(`SEQUENTIAL`=上から順番に実行、`PARALLEL`=行内の文字は順列、行単位は並列)
 * @param params.speed 1文字あたりの表示時間
 * @param params.completeAction アニメーション完了アクション
 * @returns テキストタイプライターアニメーションコンポーネント
 */
export const AnimationTextTypeWriter = ({
  id,
  children,
  typeMode,
  speed,
  onComplete,
}: {
  id?: string;
  children: ReactNode;
  typeMode?: 'SEQUENTIAL' | 'PARALLEL';
  speed?: number;
  onComplete?: () => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { registerAnimationController, deleteAnimationController } =
    useAnimationController();
  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const animationController = createTypeWriterAnimationController({
      id,
      element: containerRef.current,
      typeMode,
      speed,
      onComplete,
    });
    registerAnimationController(animationController);
    animationController.start();

    return () => {
      deleteAnimationController(animationController.getId());
      animationController.destroy();
    };
  }, []);

  return (
    <div id={id} ref={containerRef}>
      {splitTextToCharSpan(children)}
    </div>
  );
};
