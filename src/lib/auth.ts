import { Amplify } from '@aws-amplify/core';
import { APP_CLIENT_ID, USER_POOL_ID, REGION } from './aws-constants';

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: REGION,
    userPoolId: USER_POOL_ID,
    userPoolWebClientId: APP_CLIENT_ID,
  },
});
export type ConnectedUser = {
  username: string;
  attributes: { sub: string };
};
