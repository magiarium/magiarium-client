import { LoadingOverlay } from '@/common/components/LoadingOverlay';
import { useEffect, useRef } from 'react';
import { useAnimationController } from '../../hooks/useAnimationController';
import { AnimationControllerId } from '../../libs/controller/type';
import { createToVisibleChainAnimationController } from '../../libs/factory/createToVisibleChainAnimationController';
import { AnimationSkipOverlay } from '../AnimationSkipOverlay';
import './AnimationPowerOnSafeTest.scss';

const CONTROLLER_ID = 'power-on-safe-test-animation' as AnimationControllerId;

/**
 * PowerOnSafeTest風のアニメーションを再生するコンポーネント
 *
 * @param params.onComplete 完了アクション
 * @returns Reactコンポーネント
 */
export const AnimationPowerOnSafeTest = ({
  onComplete,
}: {
  onComplete: () => void;
}) => {
  const postContainerRef = useRef<HTMLDivElement>(null);
  const {
    registerAnimationController,
    deleteAnimationController,
    getAnimationController,
  } = useAnimationController();

  useEffect(() => {
    if (!postContainerRef.current) {
      return;
    }
    const animationController = createToVisibleChainAnimationController({
      id: CONTROLLER_ID,
      element: postContainerRef.current,
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
      <div className="power-on-safe-test" ref={postContainerRef}>
        <div className="power-on-safe-test__ascii-logo">
          <pre data-animation-duration="0.01">{`   (JJJJJJJJJJJJJJJJJJJJJJ (+JJJ                   .+JJJ  JJJJJJJJJJJJJJJJJJJJJ+,   +JJJ                     J+JJ   .+JJ,                    .+++,  JJJJJJJJJJJJJJJJJJJJJJJ+. .+JJ,                JJJJ`}</pre>
          <pre data-animation-duration="0.01">{`   MMMMMMMMMMMMMMMMMMMMMM# ,MMMM.                  MMMMF  MMMMMMMMMMMMMMMMMMMMMM]   MMM#                     MMMN   ,MMM]                    (MMM)  MMMMMMMMMMMMMMMMMMMMMMMM; ,MMM]                MMMN`}</pre>
          <pre data-animation-duration="0.01">{`   MMMMMMMMMMMMMMMMMMMMMM#  MMMM]                 .MMMM   MMMMMMMMMMMMMMMMMMMMMM]   MMM#                     MMMN   ,MMM]                    (MMM)  MMMMMMMMMMMMMMMMMMMMMMMM; ,MMM]                MMMN`}</pre>
          <pre data-animation-duration="0.01">{`   MMMMMMMMMMMMMMMMMMMMMM#  dMMM#                 (MMM#   MMMMMMMMMMMMMMMMMMMMMM]   MMM#                     MMMN   ,MMM]                    (MMM)  MMMMMMMMMMMMMMMMMMMMMMMM; ,MMM]                MMMN`}</pre>
          <pre data-animation-duration="0.01">{`   MMMMMMMMMMMMMMMMMMMMMM#  ,MMMM,                MMMMF   MMMMMMMMMMMMMMMMMMMMMM]   MMM#                     MMMN   ,MMM]                    (MMM)  MMMMMMMMMMMMMMMMMMMMMMMM; ,MMM]                MMMN`}</pre>
          <pre data-animation-duration="0.01">{`   MMMMMMMMMMMMMMMMMMMMMM#   MMMM]               .MMMM>   MMMMMMMMMMMMMMMMMMMMMM]   MMM#                     MMMN   ,MMM]                    (MMM)  MMMMMMMMMMMMMMMMMMMMMMMM: ,MMM]                MMMN`}</pre>
          <pre data-animation-duration="0.01">{`   MMMM7?????????????????!   dMMMN               JMMM#    MMM#??????????????????!   MMM#                     MMMN   ,MMM]                    (MMM)  ??????????MMMM??????????  ,MMM]                MMMN`}</pre>
          <pre data-animation-duration="0.01">{`   MMMM                      ,MMMM<              MMMMF    MMM#                      MMM#                     MMMN   ,MMM]                    (MMM)            MMMN            ,MMM]                MMMN`}</pre>
          <pre data-animation-duration="0.01">{`   MMMM                       MMMMb             .MMMM!    MMM#                      MMM#                     MMMN   ,MMM]                    (MMM)            MMMN            ,MMM]                MMMN`}</pre>
          <pre data-animation-duration="0.01">{`   MMMM                       JMMMN             JMMM#     MMM#                      MMM#                     MMMN   ,MMM]                    (MMM)            MMMN            ,MMM]                MMMN`}</pre>
          <pre data-animation-duration="0.01">{`   MMMM                       ,MMMM;            MMMM]     MMM#                      MMM#                     MMMN   ,MMM]                    (MMM)            MMMN            ,MMM]                MMMN`}</pre>
          <pre data-animation-duration="0.01">{`   MMMM                        MMMMb           .MMMM      MMM#                      MMM#                     MMMN   ,MMM]                    (MMM)            MMMN            ,MMM]                MMMN`}</pre>
          <pre data-animation-duration="0.01">{`   MMMM                        JMMMN           dMMM#      MMM#                      MMM#                     MMMN   ,MMM]                    (MMM)            MMMN            ,MMM]                MMMN`}</pre>
          <pre data-animation-duration="0.01">{`   MMMM                        .MMMM|         .MMMM%      MMM#                      MMM#                     MMMN   ,MMM]                    (MMM)            MMMN            ,MMM]                MMMN`}</pre>
          <pre data-animation-duration="0.01">{`   MMMMMMMMMMMMMMMMMMMMN        MMMMb         .MMMM       MMMMMMMMMMMMMMMMMMMM@     MMM#                     MMMN   ,MMM]                    (MMM)            MMMN            ,MMMMMMMMMMMMMMMMMMMMMMMN`}</pre>
          <pre data-animation-duration="0.01">{`   MMMMMMMMMMMMMMMMMMMMN        -MMMN.        dMMMF       MMMMMMMMMMMMMMMMMMMM@     MMM#                     MMMN   ,MMM]                    (MMM)            MMMN            ,MMMMMMMMMMMMMMMMMMMMMMMN`}</pre>
          <pre data-animation-duration="0.01">{`   MMMMMMMMMMMMMMMMMMMMN        .MMMM[       .MMMM        MMMMMMMMMMMMMMMMMMMM@     MMM#                     MMMN   ,MMM]                    (MMM)            MMMN            ,MMMMMMMMMMMMMMMMMMMMMMMN`}</pre>
          <pre data-animation-duration="0.01">{`   MMMMMMMMMMMMMMMMMMMMN         dMMMb       .MMM#        MMMMMMMMMMMMMMMMMMMM@     MMM#                     MMMN   ,MMM]                    (MMM)            MMMN            ,MMMMMMMMMMMMMMMMMMMMMMMN`}</pre>
          <pre data-animation-duration="0.01">{`   MMMMMMMMMMMMMMMMMMMMN         ,MMMN.      dMMMF        MMMMMMMMMMMMMMMMMMMM@     MMM#                     MMMN   ,MMM]                    (MMM)            MMMN            ,MMMMMMMMMMMMMMMMMMMMMMMN`}</pre>
          <pre data-animation-duration="0.01">{`   MMMMMMMMMMMMMMMMMMMMN          MMMM[     .MMMM         MMMMMMMMMMMMMMMMMMMM@     MMM#                     MMMN   ,MMM]                    (MMM)            MMMN            ,MMMMMMMMMMMMMMMMMMMMMMMN`}</pre>
          <pre data-animation-duration="0.01">{`   MMMM                           dMMMb     .MMM#         MMM#                      MMM#                     MMMN   ,MMM]                    (MMM)            MMMN            ,MMM]                MMMN`}</pre>
          <pre data-animation-duration="0.01">{`   MMMM                           ,MMMM.    dMMMF         MMM#                      MMM#                     MMMN   ,MMM]                    (MMM)            MMMN            ,MMM]                MMMN`}</pre>
          <pre data-animation-duration="0.01">{`   MMMM                            MMMM[   .MMMM:         MMM#                      MMM#                     MMMN   ,MMM]                    (MMM)            MMMN            ,MMM]                MMMN`}</pre>
          <pre data-animation-duration="0.01">{`   MMMM                            dMMM@   .MMM#          MMM#                      MMM#                     MMMN   ,MMM]                    (MMM)            MMMN            ,MMM]                MMMN`}</pre>
          <pre data-animation-duration="0.01">{`   MMMM                            ,MMMN.  dMMMF          MMM#                      MMM#                     MMMN   ,MMM]                    (MMM)            MMMN            ,MMM]                MMMN`}</pre>
          <pre data-animation-duration="0.01">{`   MMMM                             MMMM] .MMMM!          MMM#                      MMM#                     MMMN   ,MMM]                    (MMM)            MMMN            ,MMM]                MMMN`}</pre>
          <pre data-animation-duration="0.01">{`   MMMM                             JMMMN -MMM#           MMM#                      MMM#                     MMMN   ,MMM]                    (MMM)            MMMN            ,MMM]                MMMN`}</pre>
          <pre data-animation-duration="0.01">{`   MMMM                             .MMMM_dMMM]           MMM#                      MMM#                     MMMN   ,MMM]                    (MMM)            MMMN            ,MMM]                MMMN`}</pre>
          <pre data-animation-duration="0.01">{`   MMMM-...................          MMMMRMMMM            MMMN...................   MMMN..................   MMMN   ,MMMb..................  (MMM)            MMMN            ,MMM]                MMMN`}</pre>
          <pre data-animation-duration="0.01">{`   MMMMMMMMMMMMMMMMMMMMMMM]          JMMMMMMMF            MMMMMMMMMMMMMMMMMMMMMMM   MMMMMMMMMMMMMMMMMMMMM#   MMMN   ,MMMMMMMMMMMMMMMMMMMMM]  (MMM)            MMMN            ,MMM]                MMMN`}</pre>
          <pre data-animation-duration="0.01">{`   MMMMMMMMMMMMMMMMMMMMMMM]          .MMMMMMM%            MMMMMMMMMMMMMMMMMMMMMMM   MMMMMMMMMMMMMMMMMMMMM#   MMMN   ,MMMMMMMMMMMMMMMMMMMMM]  (MMM)            MMMN            ,MMM]                MMMN`}</pre>
          <pre data-animation-duration="0.01">{`   MMMMMMMMMMMMMMMMMMMMMMM]           dMMMMMM             MMMMMMMMMMMMMMMMMMMMMMM   MMMMMMMMMMMMMMMMMMMMM#   MMMN   ,MMMMMMMMMMMMMMMMMMMMM]  (MMM)            MMMN            ,MMM]                MMMN`}</pre>
          <pre data-animation-duration="0.01">{`   MMMMMMMMMMMMMMMMMMMMMMM]           -MMMMMF             MMMMMMMMMMMMMMMMMMMMMMM   MMMMMMMMMMMMMMMMMMMMM#   MMMN   ,MMMMMMMMMMMMMMMMMMMMM]  (MMM)            MMMN            ,MMM]                MMMN      MMMMM`}</pre>
          <pre data-animation-duration="0.01">{`   MMMMMMMMMMMMMMMMMMMMMMM]           .MMMMM              MMMMMMMMMMMMMMMMMMMMMMM   MMMMMMMMMMMMMMMMMMMMM#   MMMN   ,MMMMMMMMMMMMMMMMMMMMM]  (MMM)            MMMN            ,MMM]                MMMN      MMMMM`}</pre>
          <pre data-animation-duration="0.01">{`   dMMMMMMMMMMMMMMMMMMMMMM]            7HHMB              MMMMMMMMMMMMMMMMMMMMMMM   MMMMMMMMMMMMMMMMMMMMME   TMMB   ,MMMMMMMMMMMMMMMMMMMMM]  (MMH)            THHB            ,MHH%                THMB      MMMMM`}</pre>{' '}
        </div>
        <p data-animation-duration="0.1">Copyright (C) EVELILITH Systems.</p>
        <p data-animation-duration="0.1">Release Date: 0000/01/01</p>
        <p data-animation-duration="0.1">Magic Version: 1.10.02.</p>

        <div className="power-on-safe-test__precall-code">
          <p data-animation-duration="0.1" data-animation-delay="0.5">
            Normalize Inner World.
          </p>
          <p data-animation-duration="0.1">Renormalize Outer World.</p>
          <p data-animation-duration="0.1" data-animation-delay="0.5">
            God's not in His Heaven.
          </p>
        </div>
        <div className="power-on-safe-test__call-code">
          <div className="power-on-safe-test__call-code-header">
            <p>
              <span data-animation-duration="0.1">Call CODE: Magiarium</span>
            </p>
          </div>
          <div className="power-on-safe-test__call-code-content">
            <p>
              <span data-animation-duration="0.1" data-animation-delay="0.5">
                Domain Determine
              </span>
              <span data-animation-duration="0.1">.</span>
              <span data-animation-duration="0.01">.</span>
              <span data-animation-duration="0.01">.</span>
              <span data-animation-duration="0.01">.</span>
              <span data-animation-duration="0.01">.</span>
              <span data-animation-duration="0.01">.</span>
              <span
                data-animation-duration="0.1"
                className="power-on-safe-test__decoration-text power-on-safe-test__decoration-text--green"
              >
                Complete
              </span>
            </p>
            <p>
              <span data-animation-duration="0.1">Memory Reading</span>
              <span data-animation-duration="0.01">.</span>
              <span data-animation-duration="0.01">.</span>
              <span data-animation-duration="0.01">.</span>
              <span data-animation-duration="0.01">.</span>
              <span data-animation-duration="0.01">.</span>
              <span data-animation-duration="0.01">.</span>
              <span data-animation-duration="0.01">.</span>
              <span data-animation-duration="0.01">.</span>
              <span
                data-animation-duration="0.1"
                className="power-on-safe-test__decoration-text power-on-safe-test__decoration-text--green"
              >
                Complete
              </span>
            </p>
            <p>
              <span data-animation-duration="0.1">Material Setup</span>
              <span data-animation-duration="0.01">.</span>
              <span data-animation-duration="0.01">.</span>
              <span data-animation-duration="0.01">.</span>
              <span data-animation-duration="0.01">.</span>
              <span data-animation-duration="0.01">.</span>
              <span data-animation-duration="0.01">.</span>
              <span data-animation-duration="0.01">.</span>
              <span data-animation-duration="0.01">.</span>
              <span
                data-animation-duration="0.1"
                className="power-on-safe-test__decoration-text power-on-safe-test__decoration-text--green"
              >
                Complete
              </span>
            </p>
            <p>
              <span data-animation-duration="0.1">Familiar Summon</span>
              <span data-animation-duration="0.01">.</span>
              <span data-animation-duration="0.01">.</span>
              <span data-animation-duration="0.01">.</span>
              <span data-animation-duration="0.01">.</span>
              <span data-animation-duration="0.025">.</span>
              <span data-animation-duration="0.025">.</span>
              <span data-animation-duration="0.025">.</span>
              <span
                data-animation-duration="0.1"
                className="power-on-safe-test__decoration-text power-on-safe-test__decoration-text--red"
              >
                Rejection
              </span>
            </p>
            <p>
              <span data-animation-duration="0.1" data-animation-delay="0.25">
                Familiar Summon
              </span>
              <span data-animation-duration="0.025">.</span>
              <span data-animation-duration="0.025">.</span>
              <span data-animation-duration="0.025">.</span>
              <span data-animation-duration="0.025">.</span>
              <span data-animation-duration="0.05">.</span>
              <span data-animation-duration="0.05">.</span>
              <span data-animation-duration="0.05">.</span>
              <span
                data-animation-duration="0.1"
                className="power-on-safe-test__decoration-text power-on-safe-test__decoration-text--red"
              >
                Rejection
              </span>
            </p>
            <p>
              <span data-animation-duration="0.1" data-animation-delay="0.25">
                Familiar Summon
              </span>
              <span data-animation-duration="0.05">.</span>
              <span data-animation-duration="0.05">.</span>
              <span data-animation-duration="0.05">.</span>
              <span data-animation-duration="0.05">.</span>
              <span data-animation-duration="0.05">.</span>
              <span data-animation-duration="0.05">.</span>
              <span data-animation-duration="0.05">.</span>
              <span
                data-animation-duration="0.1"
                data-animation-delay="0.25"
                className="power-on-safe-test__decoration-text power-on-safe-test__decoration-text--yellow"
              >
                Disapproval
              </span>
            </p>
            <p>
              <span data-animation-duration="0.1" data-animation-delay="0.25">
                Familiar Summon
              </span>
              <span data-animation-duration="0.05">.</span>
              <span data-animation-duration="0.05">.</span>
              <span data-animation-duration="0.05">.</span>
              <span data-animation-duration="0.075">.</span>
              <span data-animation-duration="0.075">.</span>
              <span data-animation-duration="0.1">.</span>
              <span data-animation-duration="0.1">.</span>
              <span
                data-animation-duration="0.1"
                data-animation-delay="0.5"
                className="power-on-safe-test__decoration-text power-on-safe-test__decoration-text--green"
              >
                Approvel
              </span>
            </p>
          </div>
        </div>
        <p
          data-animation-duration="0.1"
          data-animation-delay="0.5"
          className="power-on-safe-test__flicker-effect"
        >
          All's right with the world!
        </p>
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
