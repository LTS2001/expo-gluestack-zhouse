import { getUserInfo, userLogout } from '@/business';
import { useSocket } from '@/hooks';
import { authStore } from '@/stores';
import { autorun } from 'mobx';
import { useEffect } from 'react';

export default function useInitialization() {
  // initialize websocket
  useSocket();

  // initialize user info
  const { isLogin } = authStore;
  useEffect(() => {
    const disposer = autorun(() => {
      getUserInfo();
    });
    return () => disposer();
  }, []);
  useEffect(() => {
    if (!isLogin) userLogout();
  }, [isLogin]);
}
