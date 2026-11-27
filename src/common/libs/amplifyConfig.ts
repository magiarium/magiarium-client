import {
  AWS_REGION,
  IDENTITY_POOL_ID,
  MAGIARIUM_BUCKET_NAME,
  USER_POOL_CLIENT_ID,
  USER_POOL_ID,
} from '@/constants';
import { Amplify } from 'aws-amplify';

export const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: USER_POOL_ID,
      userPoolClientId: USER_POOL_CLIENT_ID,
      identityPoolId: IDENTITY_POOL_ID,
    },
  },
  Storage: {
    S3: {
      bucket: MAGIARIUM_BUCKET_NAME,
      region: AWS_REGION,
    },
  },
};

Amplify.configure(amplifyConfig, {
  ssr: true, // これを消すとセッションが切れたタイミングでサーバー側の認証だけ失敗するので消さないで
});
