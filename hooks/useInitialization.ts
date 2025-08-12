import {
  getLeasePendingListByLandlord,
  getRepairListTenant,
  getTenantLeasedHouseList,
  getTenantLeasedListLandlord,
  getUserInfo,
} from '@/business';
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
      const { identity, isLogin } = authStore;
      const { user } = userStore;
      if (autorunDebounceTimer.current) {
        clearTimeout(autorunDebounceTimer.current);
      }
      autorunDebounceTimer.current = setTimeout(() => {
        /**
         * the following situations will trigger the `get lease pending list` api
         * 1. get lease pending list when you first enter the app (if you are landlord and login)
         * 2. get lease pending list when you login (if you are landlord)
         * 3. get lease pending list when you change the landlord identity
         */
        if (identity === LANDLORD && isLogin) {
          getLeasePendingListByLandlord();
          getTenantLeasedListLandlord();
        }
        if (identity === TENANT && isLogin && user?.id) {
          getTenantLeasedHouseList(user.id);
          getRepairListTenant(user.id);
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
