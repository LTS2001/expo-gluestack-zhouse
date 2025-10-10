import {
  getCommentListByTenantIdApi,
  getLeasePendingListApi,
  getTenantRefundHistoryListApi,
} from '@/request';
import { commentStore, leaseStore, userStore } from '@/stores';

/**
 * get the lease request that needs to be processed by the landlord
 */
export const getLeasePendingListByLandlord = async () => {
  const res = await getLeasePendingListApi();
  leaseStore.setLandlordPendingLeaseList(res);
};

/**
 * get the tenant lease refund list
 */
export const getTenantLeaseRefundList = async () => {
  const { user } = userStore;
  if (!user?.id) return Promise.reject('user id is required');
  const [leaseRefundList, houseComment] = await Promise.all([
    getTenantRefundHistoryListApi(user.id),
    getCommentListByTenantIdApi(user.id),
  ]);
  leaseStore.setTenantLeaseRefundList(leaseRefundList);
  commentStore.setTenantCommentList(houseComment);
};
