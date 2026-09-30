import { AuthSession } from 'aws-amplify/auth';
import type { AccountInfo, AccountRole } from '../type';

/**
 * セッション情報からカレントアカウント情報を抽出する処理
 *
 * @param session セッション情報
 * @returns 現在のアカウント情報
 * @throws 認証エラー
 */
export const extractCurrentAccountFromSession = (
  session: AuthSession
): AccountInfo => {
  const payload = session.tokens?.idToken?.payload;
  if (!payload) {
    throw new Error('認証エラー');
  }

  const sub = payload?.sub;
  if (typeof sub !== 'string' || !sub) {
    // 認証切れ
    throw new Error('認証エラー');
  }
  const username = payload?.['cognito:username'];

  const cognitoGroups = Array.isArray(payload['cognito:groups'])
    ? payload['cognito:groups']
    : [];

  let role: AccountRole = cognitoGroups.includes('admin')
    ? 'ADMIN'
    : cognitoGroups.includes('demo')
      ? 'DEMO'
      : 'GUEST';
  return {
    id: sub,
    name: String(username) ?? 'ゲストユーザー',
    role: role,
  };
};
