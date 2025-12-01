import { EUserIdentityEnum } from '@/constants';
import { authStore, chatStore, leaseStore, repairStore } from '@/stores';
import { autorun } from 'mobx';
import { useEffect, useRef, useState } from 'react';

export default function useTabBarBadgeNum() {
  const [mineNum, setMineNum] = useState<number | undefined>();
  const [chatNum, setChatNum] = useState<number | undefined>();
  const autorunDebounceTimer = useRef<
    ReturnType<typeof setTimeout> | undefined
  >(undefined);
  useEffect(() => {
    if (autorunDebounceTimer.current) {
      clearTimeout(autorunDebounceTimer.current);
    }
    const disposer = autorun(() => {
      const { identity, isLogin } = authStore;
      const { landlordPendingLeaseList } = leaseStore;
      const { landlordPendingRepairList } = repairStore;
      const { chatUnreadNum } = chatStore;
      autorunDebounceTimer.current = setTimeout(() => {
        if (!isLogin) return;
        if (identity === EUserIdentityEnum.Landlord) {
          const _mineNum =
            (landlordPendingLeaseList?.length ?? 0) +
            (landlordPendingRepairList?.length ?? 0);
          setMineNum(_mineNum ? _mineNum : undefined);
        } else if (identity === EUserIdentityEnum.Tenant) {
        }

        setChatNum(chatUnreadNum);
      }, 100);
    });
    return () => {
      if (autorunDebounceTimer.current) {
        clearTimeout(autorunDebounceTimer.current);
      }
      disposer();
    };
  }, []);

  return {
    mineNum,
    chatNum,
  };
}
