// import HouseLeaseBusiness from '@/business/HouseLeaseBusiness';
// import leaseStore from '@/stores/LeaseStore';
// import LandlordBusiness from '@/business/LandlordBusiness';
// import userStore from '@/stores/UserStore';
// import { removeStorageSync } from '@tarojs/taro';
// import AuthConstant from '@/constant/AuthConstant';
// import authStore from '@/stores/AuthStore';
// import houseStore from '@/stores/HouseStore';
// import socketStore from '@/stores/SocketStore';
// import { eventCenter } from '@tarojs/runtime';
// import chatStore from '@/stores/ChatStore';
// import reportStore from '@/stores/ReportStore';

export default function useLandlord() {
  // const {setLoginState, setToken} = authStore;
  // const {clearUser, setReleaseTenant, clearReleaseTenant} = userStore;
  // const {clearLandlordHouseList} = houseStore;
  // const {setPendingLeaseList} = leaseStore;
  // const {websocketInstance, clearWebsocketInstance} = socketStore;
  // const {clearCurrentChatSession, clearChatSessionList} = chatStore;
  // const {clearLandlordReportList} = reportStore;

  /**
   * 房东退出登录
   */
  const landlordLogout = () => {
    // setLoginState(false);
    // setToken('');
    // removeStorageSync(AuthConstant.TOKEN);
    // clearUser();
    // clearLandlordHouseList();
    // // 断开 websocket
    // websocketInstance?.close();
    // // 清除 websocket 实例
    // clearWebsocketInstance();
    // // 取消所有事件的订阅
    // eventCenter.off();
    // clearCurrentChatSession();
    // clearChatSessionList();
    // // 清除房屋维修
    // clearLandlordReportList();
    // clearReleaseTenant();
  };

  /**
   * 获取待处理的租赁申请
   */
  const getPendingLease = async () => {
    // const pendingLeaseList: any = await HouseLeaseBusiness.getTenantLeasePendingTodoByLandlordId();
    // setPendingLeaseList(pendingLeaseList);
  };

  /**
   * 通过房东id获取自己租客信息
   */
  const getTenantsByLandlordId = async () => {
    // const tenantList: any = await LandlordBusiness.getTenantsByLandlordId();
    // setReleaseTenant(tenantList);
  };


  return {
    landlordLogout,
    getPendingLease,
    getTenantsByLandlordId
  };
}