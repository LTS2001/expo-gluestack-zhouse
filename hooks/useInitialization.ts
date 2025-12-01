import {
  getUserInfo,
  initializeChat,
  landlordInitialApi,
  tenantInitialApi,
} from '@/business';
import { EUserIdentityEnum } from '@/constants';
import { authStore, networkStore, userStore } from '@/stores';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { reaction } from 'mobx';
import { useCallback, useEffect, useRef } from 'react';
import useCurrentPage from './useCurrentPage';
import useSocket from './useSocket';

export default function useInitialization() {
  const networkChangeTimeoutTimer =
    useRef<ReturnType<typeof setTimeout>>(undefined);

  // initialize websocket
  const { disconnect, resetReconnectState } = useSocket();
  const { isIdentityPage } = useCurrentPage();

  /**
   * listen to app network status change
   */
  const handleAppNetworkChange = useCallback(
    (state: NetInfoState) => {
      const { isConnected, type } = state;
      if (networkChangeTimeoutTimer.current) {
        clearTimeout(networkChangeTimeoutTimer.current);
        networkChangeTimeoutTimer.current = undefined;
      }
      networkChangeTimeoutTimer.current = setTimeout(() => {
        if (!isConnected) return;
        const { setIsConnected, setNetworkType } = networkStore;
        setIsConnected(isConnected);
        setNetworkType(type);
        resetReconnectState();
      }, 1000);
    },
    [resetReconnectState]
  );

  useEffect(() => {
    NetInfo.addEventListener(handleAppNetworkChange);
    const disposer = reaction(
      () => {
        const { isConnected, networkType } = networkStore;
        return { isConnected, networkType };
      },
      (state) => {
        const { isConnected, networkType } = state;
        if (!isConnected || !networkType) return;
        getUserInfo();
      }
    );

    return () => {
      disposer();
    };
  }, [resetReconnectState, handleAppNetworkChange]);

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
        if (identity === EUserIdentityEnum.Landlord) {
          landlordInitialApi(user?.id);
        }
        if (identity === EUserIdentityEnum.Tenant) {
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
