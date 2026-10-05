import { LoadingOverlay } from '@/common/components/LoadingOverlay';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { AnimatorId } from '../../libs/animator/type';
import { AnimationController } from '../../libs/controller/AnimationController';
import { createAnimationController } from '../../libs/factory/createAnimationController';
import { AnimationSkipOverlay } from '../AnimationSkipOverlay';
import './AnimationSystemBoot.scss';

/**
 * システム起動風のアニメーションを再生するコンポーネント
 * @param params.onComplete 完了アクション
 * @returns Reactコンポーネント
 */
export const AnimationSystemBoot = ({
  onComplete,
}: {
  onComplete: () => void;
}) => {
  const titleContainerRef = useRef<HTMLDivElement>(null);
  const [animationController, setAnimationController] =
    useState<AnimationController>();

  useEffect(() => {
    if (!titleContainerRef.current) {
      return;
    }
    const animationController = createAnimationController({
      controllerType: 'SIMPLE',
      element: titleContainerRef.current,
      playConfig: { type: 'ONCE' },
      animator: {
        id: 'title-animation' as AnimatorId,
        type: 'LOTTIE',
        src: './assets/animations/title_draw_animation.json',
      },
      completeAction: onComplete,
    });
    setAnimationController(animationController);
    animationController.start();
    return () => {
      animationController.destroy();
    };
  }, []);
  return (
    <>
      <div className="animation-system-boot">
        <div className="animation-system-boot__content">
          <Image
            className="animation-system-boot__logo"
            src={'/assets/images/title-logo.svg'}
            alt="タイトルロゴ"
            width={515}
            height={515}
            loading="eager"
          />
          <div
            className="animation-system-boot__title"
            ref={titleContainerRef}
          ></div>
          <div className="animation-system-boot__progress-bar">
            <div className="animation-system-boot__progress-frame">
              <div className={'animation-system-boot__progress-indicator'} />
            </div>
          </div>
        </div>
      </div>
      <AnimationSkipOverlay animationController={animationController} />
      <LoadingOverlay isLoading={!animationController} overlayColor="black" />
    </>
  );
};
