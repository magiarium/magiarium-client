import { useContext } from 'react';
import {
  AuthStep,
  AuthStepContext,
  AuthStepType,
} from '../contexts/AuthStepContext';

export const useAuthStep = <T extends AuthStepType = AuthStepType>() => {
  const context = useContext(AuthStepContext);

  if (!context) {
    throw new Error('SigninContextを初期化してください。');
  }

  const { authStep, setAuthStep } = context;

  /**
   * 初期表示(SELECT_USER_ACCOUNT)と完了(DONE)以外の場合、prevを自動で設定するWrapperを提供
   * @param authStep 認証ステップ
   */
  const setAuthStepWrapper = (nextAuthStep: AuthStep): void => {
    setAuthStep({
      ...nextAuthStep,
      prev: !['DONE', 'SELECT_USER_ACCOUNT'].includes(nextAuthStep.type)
        ? authStep
        : undefined,
    });
  };

  /**
   * authStepをprevで更新する処理 ※prevがなければ空打ち
   */
  const prevAuthStep = (): void => {
    if (!authStep.prev) {
      return;
    }
    setAuthStep(authStep.prev);
  };

  return {
    authStep: authStep as AuthStep<T>,
    setAuthStep: setAuthStepWrapper,
    prevAuthStep,
  };
};
