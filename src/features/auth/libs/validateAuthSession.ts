import { AuthSession } from 'aws-amplify/auth';
import type { AccountInfo } from '../type';

/**
 * カレントアカウントがセッション情報と一致しているかチェックする処理
 *
 * @param session セッション情報
 * @param currentAccount カレントアカウント情報
 * @returns true:問題なし、false:不正セッション
 */
export const validateAuthSession = ({
  session,
  currentAccount,
}: {
  session: AuthSession;
  currentAccount: AccountInfo;
}): boolean => {
  const payload = session.tokens?.idToken?.payload;

  if (!payload) {
    // 認証切れ
    return false;
  }
  const sub = payload?.sub;
  if (typeof sub !== 'string' || !sub) {
    // 認証切れ
    return false;
  }
  const username = payload?.['cognito:username'];

  const cognitoGroups = Array.isArray(payload['cognito:groups'])
    ? payload['cognito:groups']
    : [];

  if (
    currentAccount.id === sub &&
    currentAccount.name === username &&
    cognitoGroups.includes(currentAccount.role.toLocaleLowerCase())
  ) {
    return true;
  }
  return false;
};
