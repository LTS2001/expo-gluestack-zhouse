import {
  CHAT_SIGN_LANDLORD,
  CHAT_SIGN_TENANT,
  LANDLORD,
  TENANT,
} from '@/constants';
import { IChatSessionUser, IUpdateBaseUserInfo, IUserVerify } from '@/global';
import {
  getLandlordListByIdListApi,
  getTenantLeasedHouseListApi,
  getTenantLeasedListLandlordApi,
  getTenantListByIdListApi,
  getUserApi,
  putUserApi,
} from '@/request';
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
  const { clearTenantLeasedHouseList, clearLandlordPendingLeaseList } =
    leaseStore;
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
  clearTenantLeasedHouseList();
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
  // clear landlord pending lease list
  clearLandlordPendingLeaseList();
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

/**
 * get the landlord's tenant lease information list
 */
export const getTenantLeasedListLandlord = async () => {
  const tenantList = (await getTenantLeasedListLandlordApi()) || [];
  userStore.setLeasedTenant(tenantList);
  userStore.setLandlordTenantCount(
    [...new Set(tenantList?.map((i) => i?.tenantId))].length
  );
};

/**
 * get tenant leased house list
 * @param tenantId tenant id
 */
export const getTenantLeasedHouseList = async (tenantId?: number) => {
  if (!tenantId) return;
  const res = await getTenantLeasedHouseListApi(tenantId);
  leaseStore.setTenantLeasedHouseList(res);
};

/**
 * get receiver info list by id list
 */
export const getReceiverInfoListByIdList = async (
  params: { id: number; identity: string }[]
) => {
  const landlordId: number[] = [];
  const tenantId: number[] = [];
  // category the id of the landlord and the tenant
  params.forEach((item) => {
    if (item.identity === TENANT) {
      tenantId.push(item.id);
    } else if (item.identity === LANDLORD) {
      landlordId.push(item.id);
    }
  });

  const [tenantList, landlordList] = await Promise.all([
    tenantId.length
      ? getTenantListByIdListApi(tenantId.join(','))
      : Promise.resolve([]),
    landlordId.length
      ? getLandlordListByIdListApi(landlordId.join(','))
      : Promise.resolve([]),
  ]);
  const userInfoList: IChatSessionUser[] = [];
  tenantList.forEach((tenant) => {
    userInfoList.push({
      ...tenant,
      receiverId: `${CHAT_SIGN_TENANT},${tenant.id}`,
    });
  });
  landlordList.forEach((landlord) => {
    userInfoList.push({
      ...landlord,
      receiverId: `${CHAT_SIGN_LANDLORD},${landlord.id}`,
    });
  });
  return userInfoList;
};
