import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AnimationPowerOnSafeTest } from './AnimationPowerOnSafeTest';
import { AnimationSystemBoot } from './AnimationSystemBoot';
import './Main.scss';

/**
 * オープニングアニメーション
 * @returns Reactコンポーネント
 */
export const AnimationOpening = () => {
  const [animationStep, setAnimationStep] = useState<'POST' | 'BOOT'>('POST');
  const router = useRouter();

  return (
    <div
      className="opening"
      aria-hidden="true" // 演出用なのでスクリーンリーダーに反応しないようにする
    >
      {animationStep === 'POST' && (
        <AnimationPowerOnSafeTest
          onComplete={() => {
            setTimeout(() => {
              setAnimationStep('BOOT');
            }, 500);
          }}
        />
      )}

      {animationStep === 'BOOT' && (
        <AnimationSystemBoot
          onComplete={() => {
            setTimeout(() => {
              router.push('/signin');
            }, 1000);
          }}
        />
      )}
    </div>
  );
};
