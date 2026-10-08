import { LoadingOverlay } from '@/common/components/LoadingOverlay';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { useAnimationController } from '../../hooks/useAnimationController';
import { AnimatorId } from '../../libs/animator/type';
import { AnimationControllerId } from '../../libs/controller/type';
import { createAnimationController } from '../../libs/factory/createAnimationController';
import { AnimationSkipOverlay } from '../AnimationSkipOverlay';
import './AnimationSystemBoot.scss';

const CONTROLLER_ID = 'system-boot-animation' as AnimationControllerId;

/**
 * システム起動風のアニメーションを再生するコンポーネント
 *
 * @param params.onComplete 完了アクション
 * @returns Reactコンポーネント
 */
export const AnimationSystemBoot = ({
  onComplete,
}: {
  onComplete: () => void;
}) => {
  const titleContainerRef = useRef<HTMLDivElement>(null);

  const {
    registerAnimationController,
    deleteAnimationController,
    getAnimationController,
  } = useAnimationController();

  useEffect(() => {
    if (!titleContainerRef.current) {
      return;
    }
    const animationController = createAnimationController({
      id: CONTROLLER_ID,
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
    registerAnimationController(animationController);
    animationController.start();
    return () => {
      deleteAnimationController(animationController.getId());
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
      <AnimationSkipOverlay
        animationController={getAnimationController(CONTROLLER_ID)}
      />
      <LoadingOverlay
        isLoading={!getAnimationController(CONTROLLER_ID)}
        overlayColor="black"
      />
    </>
  );
};
