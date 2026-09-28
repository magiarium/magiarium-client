import { AuthSession } from 'aws-amplify/auth';
import {
  DEFAULT_USER_ACCOUNT_ICON,
  UserAccountInfo,
  UserAccountRole,
} from '../type';

/**
 * セッション情報から現在サインイン中のユーザーアカウント情報を抽出する処理
 * @param session セッション情報
 * @returns 現在のユーザーアカウント情報
 * @throws 認証エラー
 */
export const extractCurrentUserAccountFromSession = (
  session: AuthSession
): UserAccountInfo => {
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

  let role: UserAccountRole = cognitoGroups.includes('admin')
    ? 'ADMIN'
    : cognitoGroups.includes('demo')
      ? 'DEMO'
      : 'GUEST';
  return {
    id: sub,
    icon: DEFAULT_USER_ACCOUNT_ICON,
    name: String(username) ?? 'ゲストユーザー',
    role: role,
  };
};
