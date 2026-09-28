import {
  IDENTITY_POOL_ID,
  USER_POOL_CLIENT_ID,
  USER_POOL_ID,
} from '@/constants';

export const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: USER_POOL_ID,
      userPoolClientId: USER_POOL_CLIENT_ID,
      identityPoolId: IDENTITY_POOL_ID,
    },
  },
};
