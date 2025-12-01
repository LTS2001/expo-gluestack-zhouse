import {
  getUserInfo,
  initializeChat,
  landlordInitialApi,
  tenantInitialApi,
} from '@/business';
import { LANDLORD, TENANT } from '@/constants';
import { authStore, networkStore, userStore } from '@/stores';
import { reaction } from 'mobx';
import { useEffect } from 'react';
import useCurrentPage from './useCurrentPage';
import useSocket from './useSocket';

export default function useInitialization() {
  // initialize websocket
  const { disconnect } = useSocket();
  const { isIdentityPage } = useCurrentPage();

  useEffect(() => {
    const disposer = reaction(
      () => {
        const { isConnected, networkType } = networkStore;
        return { isConnected, networkType };
      },
      () => {
        getUserInfo();
      },
      { fireImmediately: true }
    );

    return () => {
      disposer();
    };
  }, []);

  useEffect(() => {
    const disposer = reaction(
      () => {
        const { user } = userStore;
        return { user };
      },
      () => {
        const { user } = userStore;
        /**
         * the following situations will trigger the `disconnect` api
         * 1. when you logout
         * 2. when you change the identity to other identity === logout
         */
        if (!user || isIdentityPage) disconnect();

        /**
         * The following methods all require login
         */
        if (!user) return;
        const { identity } = authStore;
        if (identity === LANDLORD) {
          landlordInitialApi(user?.id);
        }
        if (identity === TENANT) {
          tenantInitialApi(user?.id);
        }
        initializeChat();
      },
      {
        fireImmediately: true,
      }
    );

    return () => {
      disposer();
    };
  }, [disconnect, isIdentityPage]);
}
