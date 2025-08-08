import { getUserInfo, userLogout } from '@/business';
import { authStore } from '@/stores';
import { autorun } from 'mobx';
import { useEffect } from 'react';
import useSocket from './useSocket';

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
