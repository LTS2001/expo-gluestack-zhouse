import Domain from '@/components/domain';
import { Icon } from '@/components/ui/icon';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import authStore from '@/stores/auth';
import { observer } from 'mobx-react-lite';
import React, { useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
function LandlordUserComp() {
  // const { user, releaseTenant } = userStore;
  const { isLogin } = authStore;
  // const { switchIdentity } = useIdentity();
  // const { leasePendingNoticeNum } = useLease();
  // const { landlordReportPendingNoticeNum } = useReport();
  // const { getTenantsByLandlordId } = useLandlord();
  // const { getWebSocketMessage } = useSocket();
  const insets = useSafeAreaInsets()
  // 功能区列表
  const domainList = useMemo(
    () => [
      {
        icon: <Icon as='AntDesign' name='setting' />,
        text: '个人设置',
        name: 'personalSettings',
        to: '/pages/selfInfo/index',
        notice: 0,
      },
      {
        icon: <Icon as='MaterialIcons' name="auto-fix-high" />,
        text: '房屋维修',
        name: 'houseRepair',
        to: '/pages/landlordReport/index',
        notice: 0,
      },
      {
        icon: <Icon as='MaterialCommunityIcons' name="application-edit-outline" />,
        text: '租赁申请',
        name: 'leaseApplication',
        to: '/pages/leaseNotice/index',
        notice: 0,
      },
      {
        icon: <Icon as='AntDesign' name="edit" />,
        text: '投诉建议',
        name: 'complaint',
        to: '/pages/complaintList/index',
        notice: 0,
      },
    ],
    // [leasePendingNoticeNum, landlordReportPendingNoticeNum]
    []
  );

  // useEffect(() => {
  //   // 获取该房东已经租赁房屋的租客信息列表
  //   getTenantsByLandlordId();
  //   getWebSocketMessage();
  // }, [user?.id]);

  return (
    <>
      <View
        className='h-80 bg-theme-primary'
      >
        <View style={{ paddingTop: insets.top + 16 }} className='ml-6'>
          <Icon as='FontAwesome6' name="user-pen" color='#eee' />
        </View>
        <View className='items-center -mt-2'>
          <Image source={require('@/assets/images/tenant.png')} alt='' className='bg-white rounded-full  shadow-xl shadow-white' size='xl' />
          <Text className='font-bold text-white text-xl mt-2'>
            {/* {isLogin ? user?.name : '请登录'} */}
            请登录
          </Text>
        </View>
      </View>
      <View className='flex-row justify-center gap-6 -mt-12'>
        <View className='w-2/5 h-28 border border-secondary-400 shadow-sm bg-secondary-0 rounded-lg items-center pt-3'>
          <Text className='font-bold text-theme-primary text-6xl'>{0}</Text>
          <Text>已有房屋</Text>
        </View>
        <View
          className='w-2/5 h-28 border border-secondary-400 shadow-sm bg-secondary-0 rounded-lg items-center pt-3'
        // onClick={() => {
        //   if (!releaseTenant?.length) {
        //     return;
        //   }
        //   navigateTo({ url: '/pages/existTenant/index' });
        // }}
        >
          <Text className='font-bold text-theme-primary text-6xl'>{0}</Text>
          <Text>已有租客</Text>
        </View>
      </View>
      <Domain domainList={domainList} isLogin={isLogin} />
      {/* <Logout isLogin={isLogin} /> */}
    </>
  );
}


function User() {
  return (
    <View className='bg-secondary-0 flex-1'>
      <LandlordUserComp />
    </View>
  )
}
export default observer(User)