import { getCollectHouseTenantApi, putCollectHouseStatusApi } from '@/request';
import { authStore, userStore } from '@/stores';
import { router } from 'expo-router';
/**
 * update the status of collection houses
 * @param houseId house id
 * @param landlordId landlord id
 * @param status 0: not collect, 1: collect
 */
export const updateCollectHouseStatus = async (
  houseId: number,
  landlordId: number,
  status: number
) => {
  // if not login, ship to the login page
  if (!authStore.isLogin) {
    router.push('/login');
    return Promise.reject();
  }
  return await putCollectHouseStatusApi({
    houseId,
    landlordId,
    tenantId: userStore.user?.id!,
    status,
  });
};

/**
 * get the status of collection houses
 * @param houseId house id
 */
export const getCollectHouseStatus = async (houseId: number) => {
  if (!authStore.isLogin) return;
  if (houseId && userStore.user?.id) {
    const res = await getCollectHouseTenantApi(houseId, userStore.user.id);
    if (res?.status) return res.status;
  }
};
