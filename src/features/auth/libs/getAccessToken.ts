import { ApiResultBase } from '@magiarium/structure';
import { fetchAuthSession } from 'aws-amplify/auth';
import { runWithAmplifyServerContext } from './runWithAmplifyServerContext';

type GetAccessTokenResult = ApiResultBase<string>;

/**
 * アクセストークン取得処理
 *
 * @return アクセストークン取得処理結果
 */
export const getAccessToken = async (): Promise<GetAccessTokenResult> => {
  try {
    let authSession;
    if (typeof window === 'undefined') {
      const { cookies } = await import('next/headers'); // Server-only APIのため、dynamic import

      authSession = await runWithAmplifyServerContext({
        nextServerContext: {
          cookies,
        },
        operation: (contextSpec) => fetchAuthSession(contextSpec),
      });
    } else {
      authSession = await fetchAuthSession();
    }

    if (!authSession?.tokens?.accessToken) {
      return {
        success: false,
        error: {
          message: '認証エラー',
          details: [
            {
              field: 'getAccessToken',
              errorType: 'AUTHORIZATION_ERROR',
              issue: 'アクセストークンの取得に失敗しました。',
            },
          ],
        },
      };
    }
    const accessToken = authSession.tokens.accessToken.toString();
    return {
      success: true,
      results: accessToken,
    };
  } catch {
    return {
      success: false,
      error: {
        message: '認証エラー',
        details: [
          {
            field: 'getAccessToken',
            errorType: 'SYSTEM_ERROR',
            issue: '予期せぬエラー',
          },
        ],
      },
    };
  }
};
