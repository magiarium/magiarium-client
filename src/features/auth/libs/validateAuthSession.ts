import { AuthSession } from 'aws-amplify/auth';
import { UserAccountInfo } from '../type';

/**
 * 現在のアカウントがセッション情報と一致しているかチェックする処理
 * @param session セッション情報
 * @param currentUserAccount 現在のアカウント情報
 * @returns true:問題なし、false:不正セッション
 */
export const validateAuthSession = async ({
  session,
  currentUserAccount,
}: {
  session: AuthSession;
  currentUserAccount: UserAccountInfo;
}): Promise<boolean> => {
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
    currentUserAccount.id === sub &&
    currentUserAccount.name === username &&
    cognitoGroups.includes(currentUserAccount.role)
  ) {
    return true;
  }
  return false;
};
