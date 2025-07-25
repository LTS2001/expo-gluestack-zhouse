// import TenantBusiness from '@/business/TenantBussiness';
import leaseStore from '@/stores/lease';
// import { removeStorageSync } from '@tarojs/taro';
// import AuthConstant from '@/constant/AuthConstant';
import authStore from '@/stores/auth';
import userStore from '@/stores/user';
// import socketStore from '@/stores/SocketStore';
// import { eventCenter } from '@tarojs/runtime';
import chatStore from '@/stores/chat';
import reportStore from '@/stores/repair';

export default function useTenant() {
  const { setLoginState, setToken } = authStore;
  const { clearLeaseHouse, setLeaseHouse } = leaseStore;
  const { clearUser } = userStore;
  // const {websocketInstance, clearWebsocketInstance} = socketStore;
  const { clearCurrentChatSession, clearChatSessionList } = chatStore;
  const { clearTenantReportList } = reportStore;

  /**
   * 租客退出登录
   */
  const tenantLogout = () => {
    setLoginState(false);
    setToken('');
    clearUser();
    clearLeaseHouse();
    // disconnect websocket
    // websocketInstance?.close();
    // clear websocket instance
    // clearWebsocketInstance();
    clearCurrentChatSession();
    clearChatSessionList();
    // clear tenant report list
    clearTenantReportList();
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
