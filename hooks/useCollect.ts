import {
  changeCollectStatus,
  getCollectStatus,
} from '@/request/api/house-collect';
import authStore from '@/stores/auth';
import userStore from '@/stores/user';
import { router } from 'expo-router';

export default function useCollect() {
  /**
   * change house collect status
   * @param houseId house id
   * @param landlordId landlord id
   * @param status 0: not collect, 1: collect
   */
  const changeHouseCollectStatus = async (
    houseId: number,
    landlordId: number,
    status: number
  ) => {
    // if not login, ship to the login page
    if (!authStore.isLogin) {
      router.push('/login');
      return Promise.reject();
    }
    return await changeCollectStatus({
      houseId,
      landlordId,
      tenantId: userStore.user?.id!,
      status,
    });
  };

  /**
   * get house collect status
   * @param houseId house id
   */
  const getHouseCollectStatus = async (houseId: number) => {
    if (!authStore.isLogin) return;
    if (houseId && userStore.user?.id) {
      const res = await getCollectStatus(houseId, userStore.user.id);
      if (res?.status) return res.status;
    }
  };

  return {
    changeHouseCollectStatus,
    getHouseCollectStatus,
  };
}
