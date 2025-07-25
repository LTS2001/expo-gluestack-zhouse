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
import { getLeasePendingByLandlordId } from '@/request/api/house-lease';
import chatStore from '@/stores/chat';
import repairStore from '@/stores/repair';

export default function useLandlord() {
  const { setLoginState, setToken } = authStore;
  const { clearUser, clearLeasedTenant } = userStore;
  const { clearLandlordHouseList } = houseStore;
  const { setLandlordPendingLeaseList } = leaseStore;
  // const {websocketInstance, clearWebsocketInstance} = socketStore;
  const { clearCurrentChatSession, clearChatSessionList } = chatStore;
  const { clearLandlordRepairList } = repairStore;

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
    clearLandlordRepairList();
    clearLeasedTenant();
  };

  /**
   * get the lease request that needs to be processed by the landlord
   */
  const getLeaseRequestNeedProcessedByLandlord = async () => {
    const leasePendingByLandlordId = await getLeasePendingByLandlordId();
    setLandlordPendingLeaseList(leasePendingByLandlordId);
  };

  /**
   * get the landlord's tenants by landlord id
   */
  const getTenantsByLandlordId = async () => {
    // const tenantList: any = await LandlordBusiness.getTenantsByLandlordId();
    // setReleaseTenant(tenantList);
  };

  return {
    landlordLogout,
    getLeaseRequestNeedProcessedByLandlord,
    getTenantsByLandlordId,
  };
}
