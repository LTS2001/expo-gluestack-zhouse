import { showToast } from '@tarojs/taro';
import { useState } from 'react';
import { Button } from '@tarojs/components';
import AlterComp from '@/components/Alter';
import useTenant from '@/hooks/useTenant';
import authStore from '@/stores/AuthStore';
import AuthConstant from '@/constant/AuthConstant';
import useLandlord from '@/hooks/useLandlord';
interface IProps {
  isLogin: boolean;
}
const Logout = (props: IProps) => {
  const { isLogin } = props;
  const [logoutPopupVisible, setLogoutPopupVisible] = useState(false);
  const { tenantLogout } = useTenant();
  const { landlordLogout } = useLandlord();
  const { identity } = authStore;
  const { TENANT, LANDLORD } = AuthConstant;
  /**
   * 确认退出登录
   */
  const confirmLogout = () => {
    if (identity === LANDLORD) {
      landlordLogout();
    } else if (identity === TENANT) {
      tenantLogout();
    }
    setLogoutPopupVisible(false);
    showToast({
      title: '已退出登录！',
    });
  };
  return (
    <>
      {isLogin && (
        <Button
          className='logout-btn'
          onClick={() => setLogoutPopupVisible(true)}
        >
          退出登录
        </Button>
      )}
      <AlterComp
        visible={logoutPopupVisible}
        onClose={() => setLogoutPopupVisible(false)}
        onConfirm={confirmLogout}
        content='您确定要退出登录吗？'
      />
    </>
  );
};

export default Logout;
