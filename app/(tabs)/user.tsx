import Domain from '@/components/domain';
import Logout from '@/components/Logout';
import { Icon } from '@/components/ui/icon';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import {
  COMPLAINT_LIST_HREF,
  COMPLAINT_LIST_TEXT,
  LANDLORD_REPORT_HREF,
  LANDLORD_REPORT_TEXT,
  LEASE_NOTICE_HREF,
  LEASE_NOTICE_TEXT,
  SELF_INFO_HREF,
  SELF_INFO_TEXT,
  TENANT_COLLECT_HREF,
  TENANT_HISTORY_HREF,
  TENANT_HISTORY_TEXT,
  TENANT_REPORT_HREF,
  TENANT_REPORT_TEXT,
} from '@/constants/domain';
import useIdentity from '@/hooks/useIdentity';
import { getUserInfo } from '@/services/user';
import authStore from '@/stores/auth';
import userStore from '@/stores/user';
import { router } from 'expo-router';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function SwitchIdentityIcon() {
  const insets = useSafeAreaInsets();
  const { switchIdentity } = useIdentity();
  return (
    <View style={{ paddingTop: insets.top + 16 }} className='ml-6'>
      <Icon
        as='FontAwesome6'
        name='user-pen'
        color='#eee'
        onTouchEnd={switchIdentity}
        className='self-start'
      />
    </View>
  );
}
const Landlord = observer(() => {
  const { user } = userStore;
  const { isLogin } = authStore;
  // const { leasePendingNoticeNum } = useLease();
  // const { landlordReportPendingNoticeNum } = useReport();
  // const { getTenantsByLandlordId } = useLandlord();
  // const { getWebSocketMessage } = useSocket();
  // 功能区列表
  const domainList = useMemo(
    () => [
      {
        icon: <Icon as='AntDesign' name='setting' />,
        text: SELF_INFO_TEXT,
        to: SELF_INFO_HREF,
        notice: 0,
      },
      {
        icon: <Icon as='MaterialIcons' name='auto-fix-high' />,
        text: LANDLORD_REPORT_TEXT,
        to: LANDLORD_REPORT_HREF,
        notice: 0,
      },
      {
        icon: (
          <Icon as='MaterialCommunityIcons' name='application-edit-outline' />
        ),
        text: LEASE_NOTICE_TEXT,
        to: LEASE_NOTICE_HREF,
        notice: 0,
      },
      {
        icon: <Icon as='AntDesign' name='edit' />,
        text: COMPLAINT_LIST_TEXT,
        to: COMPLAINT_LIST_HREF,
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
      <View className='h-80 bg-theme-primary'>
        <SwitchIdentityIcon />
        <View
          className='items-center -mt-2'
          onTouchEnd={() => router.push(isLogin ? '/self-info' : '/login')}
        >
          <Image
            source={require('@/assets/images/tenant.png')}
            alt=''
            className='bg-white rounded-full shadow-hard-1'
            size='xl'
            needShadow
          />
          <Text className='font-bold text-white text-2xl mt-2'>
            {isLogin ? user?.name : '请登录'}
          </Text>
        </View>
      </View>
      <View className='flex-row justify-center gap-6 -mt-12'>
        <View
          className='w-2/5 h-28 border border-secondary-400 shadow-hard-3 bg-secondary-0 rounded-lg items-center pt-3'
          needShadow
        >
          <Text className='font-bold text-theme-primary text-6xl'>{0}</Text>
          <Text>已有房屋</Text>
        </View>
        <View
          className='w-2/5 h-28 border border-secondary-400 shadow-hard-3 bg-secondary-0 rounded-lg items-center pt-3'
          needShadow
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
    </>
  );
});
const Tenant = observer(() => {
  const { user } = userStore;
  const { isLogin } = authStore;
  const domainList = useMemo(
    () => [
      {
        icon: <Icon as='AntDesign' name='setting' />,
        text: SELF_INFO_TEXT,
        to: SELF_INFO_HREF,
        notice: 0,
      },
      {
        icon: <Icon as='MaterialIcons' name='auto-fix-high' />,
        text: TENANT_REPORT_TEXT,
        to: TENANT_REPORT_HREF,
        notice: 0,
      },
      {
        icon: <Icon as='AntDesign' name='staro' />,
        text: TENANT_REPORT_TEXT,
        to: TENANT_COLLECT_HREF,
        notice: 0,
      },
      {
        icon: <Icon as='AntDesign' name='clockcircleo' size={22} />,
        text: TENANT_HISTORY_TEXT,
        to: TENANT_HISTORY_HREF,
        notice: 0,
      },
      {
        icon: <Icon as='AntDesign' name='edit' />,
        text: COMPLAINT_LIST_TEXT,
        to: COMPLAINT_LIST_HREF,
        notice: 0,
      },
    ],
    // [leasePendingNoticeNum, landlordReportPendingNoticeNum]
    []
  );
  return (
    <>
      <View className='h-80 bg-theme-primary'>
        <SwitchIdentityIcon />
      </View>
      <View className='-m-36 bg-background-0 mx-5 rounded-2xl pb-8' needShadow>
        <View
          onTouchEnd={() => router.push(isLogin ? '/self-info' : '/login')}
          className='items-center'
        >
          <View className='-mt-16'>
            <Image
              source={require('@/assets/images/tenant.png')}
              alt=''
              className='bg-white rounded-full'
              size='xl'
              needShadow
            />
          </View>
          <View>
            <Text className='font-bold text-theme-primary text-2xl mt-2'>
              {isLogin ? user?.name : '请登录'}
            </Text>
          </View>
        </View>
        <Domain domainList={domainList} isLogin={isLogin} />
      </View>
      <View className='mt-44'>
        <Logout isLogin={isLogin} />
      </View>
    </>
  );
});

function User() {
  const { identity } = authStore;
  useEffect(() => {
    getUserInfo();
  }, []);
  return (
    <View className='bg-secondary-0 flex-1'>
      {identity === 'landlord' ? (
        <Landlord />
      ) : identity === 'tenant' ? (
        <Tenant />
      ) : null}
    </View>
  );
}
export default observer(User);
