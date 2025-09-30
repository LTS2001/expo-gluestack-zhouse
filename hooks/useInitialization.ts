import { getUserInfo, landlordInitialApi, tenantInitialApi } from '@/business';
import { LANDLORD, TENANT } from '@/constants';
import { authStore, userStore } from '@/stores';
import { autorun } from 'mobx';
import { useEffect, useRef } from 'react';
import useCurrentPage from './useCurrentPage';
import useSocket from './useSocket';

export default function useInitialization() {
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  const autorunDebounceTimer = useRef<
    ReturnType<typeof setTimeout> | undefined
  >(undefined);
  // initialize websocket
  const { disconnect } = useSocket();
  const { isIdentityPage } = useCurrentPage();

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      /**
       * first enter the app, need get below info
       * 1. user info
       */
      getUserInfo();
    }, 100);
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    const disposer = autorun(() => {
      /**
       * xxxStore must be placed in autorun to remain responsive,
       * and if it is placed in setTimeout, it will lose its responsiveness.
       */
      const { identity, isLogin } = authStore;
      const { user } = userStore;
      if (autorunDebounceTimer.current) {
        clearTimeout(autorunDebounceTimer.current);
      }
      autorunDebounceTimer.current = setTimeout(() => {
        if (identity === LANDLORD && isLogin) {
          landlordInitialApi(user?.id);
        }
        if (identity === TENANT && isLogin) {
          tenantInitialApi(user?.id);
        }
        /**
         * the following situations will trigger the `disconnect` api
         * 1. when you logout
         * 2. when you change the identity to other identity === logout
         */
        if (!isLogin || isIdentityPage) disconnect();
      }, 100);
    });

    return () => {
      if (autorunDebounceTimer.current) {
        clearTimeout(autorunDebounceTimer.current);
      }
      disposer();
    };
  }, [disconnect, isIdentityPage]);
}
