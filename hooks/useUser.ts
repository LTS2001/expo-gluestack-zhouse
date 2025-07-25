import { IUpdateBaseUserInfo, IUserVerify } from '@/global';
import { getUser, updateUser } from '@/request/api/user';
import authStore from '@/stores/auth';
import chatStore from '@/stores/chat';
import houseStore from '@/stores/house';
import leaseStore from '@/stores/lease';
import repairStore from '@/stores/repair';
import userStore from '@/stores/user';
export default function useUser() {
  const { setLoginState, setToken, identity } = authStore;
  const { clearLeaseHouse } = leaseStore;
  const { clearUser, clearLeasedTenant, setUser } = userStore;
  // const {websocketInstance, clearWebsocketInstance} = socketStore;
  const { clearCurrentChatSession, clearChatSessionList } = chatStore;
  const { clearTenantReportForRepairList, clearLandlordRepairList } =
    repairStore;
  const { clearLandlordHouseList } = houseStore;
  /**
   * get user info
   */
  const getUserInfo = async () => {
    if (!identity) return;
    const user = await getUser();
    user && setUser(user);
  };

  /**
   * user(tenant/landlord) logout
   */
  const userLogout = async () => {
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
  const updateUserInfo = async (info: IUpdateBaseUserInfo | IUserVerify) => {
    const user = await updateUser(info);
    user && setUser(user);
  };
  return {
    getUserInfo,
    userLogout,
    updateUserInfo,
  };
}
