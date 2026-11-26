import { createServerRunner } from '@aws-amplify/adapter-nextjs';
import { amplifyConfig } from '../../../common/libs/amplifyConfig';

export const { runWithAmplifyServerContext } = createServerRunner({
  config: amplifyConfig,
});
