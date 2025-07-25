import { useEffect } from 'react';

import authStore from '@/stores/auth';
import useSocket from './useSocket';
import useUser from './useUser';

export default function useInitialization() {
  // initialize websocket
  useSocket();

  // initialize user info
  const { isLogin } = authStore;
  const { getUserInfo, userLogout } = useUser();
  useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);
  useEffect(() => {
    if (!isLogin) userLogout();
  }, [isLogin, userLogout]);
}
