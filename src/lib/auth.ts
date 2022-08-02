import { Auth } from '@aws-amplify/auth';
import { Amplify } from '@aws-amplify/core';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
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
  attributes: { sub: string; email: string };
};

export const useAuthInit = () => {
  const [user, setUser] = useState<null | ConnectedUser>(null);
  const refreshUser = useCallback(
    () => Auth.currentUserInfo().then((e) => setUser(e)),
    [],
  );
  useEffect(() => {
    refreshUser();
  }, []);
  console.log({ user });
  return { user, refreshUser };
};

export const AuthContext = createContext<{
  user: null | ConnectedUser;
  refreshUser: () => Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
}>({ user: null, refreshUser: async () => {} });

export const useAuth = () => useContext(AuthContext);
