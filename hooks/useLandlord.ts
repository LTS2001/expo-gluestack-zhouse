// import HouseLeaseBusiness from '@/business/HouseLeaseBusiness';
import leaseStore from '@/stores/lease';
// import LandlordBusiness from '@/business/LandlordBusiness';
import userStore from '@/stores/user';
// import { removeStorageSync } from '@tarojs/taro';
// import AuthConstant from '@/constants/auth';
import authStore from '@/stores/auth';
import houseStore from '@/stores/house';
// import socketStore from '@/stores/socket';
// import { eventCenter } from '@tarojs/runtime';
import chatStore from '@/stores/chat';
import reportStore from '@/stores/report';

export default function useLandlord() {
  const { setLoginState, setToken } = authStore;
  const { clearUser, leasedTenant, clearLeasedTenant } = userStore;
  const { clearLandlordHouseList } = houseStore;
  const { setPendingLeaseList } = leaseStore;
  // const {websocketInstance, clearWebsocketInstance} = socketStore;
  const { clearCurrentChatSession, clearChatSessionList } = chatStore;
  const { clearLandlordReportList } = reportStore;

  /**
   * landlord logout
   */
  const landlordLogout = () => {
    setLoginState(false);
    setToken('');
    clearUser();
    clearLandlordHouseList();
    // disconnect websocket
    // websocketInstance?.close();
    // clear websocket instance
    // clearWebsocketInstance();
    // cancel all event subscriptions
    // eventCenter.off();
    clearCurrentChatSession();
    clearChatSessionList();
    // clear landlord report list
    clearLandlordReportList();
    clearLeasedTenant();
  };

  /**
   * get pending lease
   */
  const getPendingLease = async () => {
    // const pendingLeaseList: any = await HouseLeaseBusiness.getTenantLeasePendingTodoByLandlordId();
    // setPendingLeaseList(pendingLeaseList);
  };

  /**
   * get tenants by landlord id
   */
  const getTenantsByLandlordId = async () => {
    // const tenantList: any = await LandlordBusiness.getTenantsByLandlordId();
    // setReleaseTenant(tenantList);
  };

  return {
    landlordLogout,
    getPendingLease,
    getTenantsByLandlordId,
  };
}
