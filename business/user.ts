import { IUpdateBaseUserInfo, IUserVerify } from '@/global';
import { getLeasePendingListApi, getUserApi, putUserApi } from '@/request';
import {
  authStore,
  chatStore,
  houseStore,
  leaseStore,
  repairStore,
  userStore,
} from '@/stores';
import { router } from 'expo-router';

/**
 * user(tenant/landlord) logout
 */
export const userLogout = async () => {
  const { setLoginState, setToken } = authStore;
  const { clearLeaseHouse } = leaseStore;
  const { clearUser, clearLeasedTenant } = userStore;
  // const {websocketInstance, clearWebsocketInstance} = socketStore;
  const { clearCurrentChatSession, clearChatSessionList } = chatStore;
  const { clearTenantReportForRepairList, clearLandlordRepairList } =
    repairStore;
  const { clearLandlordHouseList } = houseStore;
  await setLoginState(false);
  setToken('');
  clearUser();
  // clear the house rented by the tenant
  clearLeaseHouse();
  // close websocket
  // websocketInstance?.close();
  // clear websocket instance
  // clearWebsocketInstance();
  // off all events
  // eventCenter.off();
  clearCurrentChatSession();
  clearChatSessionList();
  // clear tenant report for repair list
  clearTenantReportForRepairList();
  // clear all the house info of the landlord
  clearLandlordHouseList();
  // clear landlord's house repair (tenant's application for repair)
  clearLandlordRepairList();
  // clear the tenant information that has rented the landlord's house
  clearLeasedTenant();
};

/**
 * update user(tenant/landlord) info
 * @param info
 */
export const updateUserInfo = async (
  info: IUpdateBaseUserInfo | IUserVerify
) => {
  const res = await putUserApi(info);
  res?.id && userStore.setUser(res);
};

/**
 * get user info
 */
export const getUserInfo = async () => {
  if (!authStore.identity) return;
  const user = await getUserApi();
  user && userStore.setUser(user);
};

/**
 * get the lease request that needs to be processed by the landlord
 */
export const getLeasePendingListByLandlord = async () => {
  const res = await getLeasePendingListApi();
  leaseStore.setLandlordPendingLeaseList(res);
};

/**
 * switch identity (switch tenant/landlord)
 */
export const switchIdentity = async (e: any) => {
  e.stopPropagation();
  const { identity, setPreIdentityState, clearIdentityState } = authStore;
  // switch identity before saving the current identity as the previous identity
  setPreIdentityState(identity!);
  await clearIdentityState();
  router.replace('/identity');
};
