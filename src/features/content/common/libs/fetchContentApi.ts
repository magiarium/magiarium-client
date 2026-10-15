import { MAGIARIUM_API_URL } from '@/constants';
import { replacePathParams } from '@/features/content/common/libs/replacePathParams';
import { getAccessToken } from '../../../auth/libs/getAccessToken';
import {
  ContentApiName,
  ContentApiRequest,
  ContentApiResult,
  COTENT_API_DEFINES,
} from '../constants';

/**
 * コンテンツAPI用のfetch関数
 *
 * @param target 対象API名
 * @param request リクエスト
 * @returns APIレスポンス結果(body)
 */
export const fetchContentApi = async <
  T extends ContentApiName = ContentApiName,
>(
  target: T,
  request: ContentApiRequest<T>
): Promise<ContentApiResult<T>> => {
  const apiDefine = COTENT_API_DEFINES[target];
  try {
    const url =
      MAGIARIUM_API_URL +
      replacePathParams({
        path: apiDefine.path,
        params: request.params,
      });

    let headers = apiDefine.headers;
    if (apiDefine.isAuth) {
      const getAccessTokenResult = await getAccessToken();
      if (!getAccessTokenResult.success) {
        return getAccessTokenResult;
      }
      headers = {
        ...headers,
        Authorization: `Bearer ${getAccessTokenResult.results}`,
      };
    }

    const options = {
      method: apiDefine.method,
      headers,
      ...('body' in request && {
        body: JSON.stringify(request.body),
      }),
    };

    const response = await fetch(url, options);

    if (response.status === 401 || response.status === 403) {
      // 認証チェックはAPI Gatewayのレスポンスなので、この時点で加工する
      return {
        success: false,
        error: {
          message: `${apiDefine.label} エラー`,
          details: [
            {
              field: '認証エラー',
              errorType: 'AUTHORIZATION_ERROR',
              issue: 'ユーザー認証に失敗しました。',
            },
          ],
        },
      };
    }

    const responseJson = await response.json();

    if (!response.ok && 'success' in responseJson) {
      // 処理がLambdaまで到達しない(API Gateway側でエラーにした)場合、レスポンス形式が異なるため予期せぬエラー扱い
      throw new Error('予期せぬエラー');
    }

    return responseJson;
  } catch (error) {
    return {
      success: false,
      error: {
        message: `${apiDefine.label} エラー`,
        details: [
          {
            field: 'apiFetch',
            errorType: 'SYSTEM_ERROR',
            issue: '予期せぬエラー',
          },
        ],
      },
    };
  }
};
