import { useEffect } from 'react';

import authStore from '@/stores/auth';
import useInitializationSocket from './useSocket';
import useUser from './useUser';

export default function useInitialization() {
  // initialize websocket
  useInitializationSocket();

  // initialize user info
  const { isLogin } = authStore;
  const { getUserInfo, userLogout } = useUser();
  useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);
  useEffect(() => {
    if (!isLogin) userLogout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogin]);
}
