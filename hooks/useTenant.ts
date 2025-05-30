// import TenantBusiness from '@/business/TenantBussiness';
// import leaseStore from '@/stores/LeaseStore';
// import { removeStorageSync } from '@tarojs/taro';
// import AuthConstant from '@/constant/AuthConstant';
// import authStore from '@/stores/AuthStore';
// import userStore from '@/stores/UserStore';
// import socketStore from '@/stores/SocketStore';
// import { eventCenter } from '@tarojs/runtime';
// import chatStore from '@/stores/ChatStore';
// import reportStore from '@/stores/ReportStore';

export default function useTenant() {
  // const {setLoginState, setToken} = authStore;
  // const {clearLeaseHouse, setLeaseHouse} = leaseStore;
  // const {clearUser, user} = userStore;
  // const {websocketInstance, clearWebsocketInstance} = socketStore;
  // const {clearCurrentChatSession, clearChatSessionList} = chatStore;
  // const {clearTenantReportList} = reportStore;

  /**
   * 租客退出登录
   */
  const tenantLogout = () => {
    // setLoginState(false);
    // setToken('');
    // removeStorageSync(AuthConstant.TOKEN);
    // clearUser();
    // clearLeaseHouse();
    // // 断开 websocket
    // websocketInstance?.close();
    // // 清除 websocket 实例
    // clearWebsocketInstance();
    // // 取消所有事件的订阅
    // eventCenter.off();
    // clearCurrentChatSession();
    // clearChatSessionList();
    // // 清除房屋维修记录
    // clearTenantReportList();
  };

  /**
   * 获取租客租赁的房屋
   */
  const getTenantLeaseHouse = async (tenantId: number) => {
    // const res: any = await TenantBusiness.getTenantLeaseHouse(tenantId);
    // setLeaseHouse(res);
  };

  return {
    tenantLogout,
    getTenantLeaseHouse,
  };
}