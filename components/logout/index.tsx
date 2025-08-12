import { userLogout } from '@/business';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { AlertDialogGroup } from '../ui/alert-dialog';
import { Button, ButtonText } from '../ui/button';
import { showToast } from '../ui/toast';
interface IProps {
  isLogin: boolean;
}
const Logout = (props: IProps) => {
  const { isLogin } = props;
  const [logoutPopupVisible, setLogoutPopupVisible] = useState(false);
  /**
   * 确认退出登录
   */
  const confirmLogout = () => {
    userLogout();
    setLogoutPopupVisible(false);
    showToast({
      title: '已退出登录！',
      icon: 'success',
    });
  };
  return (
    <>
      {isLogin && (
        <Button
          className='mx-6'
          size='lg'
          onPress={() => setLogoutPopupVisible(true)}
        >
          <ButtonText>退出登录</ButtonText>
        </Button>
      )}
      <AlertDialogGroup
        visible={logoutPopupVisible}
        onClose={() => setLogoutPopupVisible(false)}
        onConfirm={confirmLogout}
        content='您确定要退出登录吗？'
      />
    </>
  );
};

export default observer(Logout);
