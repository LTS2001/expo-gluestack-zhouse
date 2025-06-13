import { getUser } from '@/request/api/user';
import authStore from '@/stores/auth';
import chatStore from '@/stores/chat';
import houseStore from '@/stores/house';
import leaseStore from '@/stores/lease';
import reportStore from '@/stores/report';
import userStore from '@/stores/user';

const { setLoginState, setToken } = authStore;
const { clearLeaseHouse } = leaseStore;
const { clearUser, clearLeasedTenant, setUser } = userStore;
// const {websocketInstance, clearWebsocketInstance} = socketStore;
const { clearCurrentChatSession, clearChatSessionList } = chatStore;
const { clearTenantReportList, clearLandlordReportList } = reportStore;
const { clearLandlordHouseList } = houseStore;

/**
 * get user info
 */
export const getUserInfo = async () => {
  const user: any = await getUser();
  user && setUser(user);
};

/**
 * user(tenant/landlord) logout
 */
export const userLogout = async () => {
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
  // 清除房屋维修记录
  clearTenantReportList();
  // clear all the house info of the landlord
  clearLandlordHouseList();
  // clear landlord's house repair (tenant's application for repair)
  clearLandlordReportList();
  // clear the tenant information that has rented the landlord's house
  clearLeasedTenant();
};
