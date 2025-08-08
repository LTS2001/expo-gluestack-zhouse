import { getLeasePendingListApi } from '@/request';
import { leaseStore } from '@/stores';

/**
 * get the lease request that needs to be processed by the landlord
 */
export const getLeasePendingListByLandlord = async () => {
  const res = await getLeasePendingListApi();
  leaseStore.setLandlordPendingLeaseList(res);
};
