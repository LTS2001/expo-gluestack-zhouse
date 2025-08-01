import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';

import HouseImageList from '@/components/house-image-list';
import ShowCollectFees from '@/components/show-collect-fees';
import ShowHouseMessages from '@/components/show-house-messages';
import { AlertDialogGroup } from '@/components/ui/alert-dialog';
import { Button, ButtonText } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { showToast } from '@/components/ui/toast';
import { TENANT } from '@/constants/auth';
import { HouseToLeaseMap } from '@/constants/house';
import { IHouse, IUser } from '@/global';
import useCollect from '@/hooks/useCollect';
import { addLease, getLeaseStatus } from '@/request/api/house-lease';
import authStore from '@/stores/auth';
import houseStore from '@/stores/house';
import socketStore from '@/stores/socket';
import userStore from '@/stores/user';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';

const MarketLookHouse = () => {
  const { updateHouseCollectList, currentHouse } = houseStore;
  const { socketInstance } = socketStore;
  const { user, currentLandlord } = userStore;
  const { identity } = authStore;
  // const { setChatReceiver } = chatStore;
  const { changeCollectStatus, getHouseCollectStatus } = useCollect();
  // const { useLeaveChatSession } = useChat();

  const [houses, setHouses] = useState<IHouse>();
  const [landlord, setLandlord] = useState<IUser>();
  // collect status
  const [collected, setCollected] = useState(false);
  // lease popup visible
  const [leasePopupVisible, setLeasePopupVisible] = useState(false);
  // lease state
  const [leaseState, setLeaseState] = useState(0);
  // lease message popup visible
  const [leaseMsgVisible, setLeaseMsgVisible] = useState(false);
  const [leaseMonths, setLeaseMonths] = useState('');

  // useLeaveChatSession();

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: currentHouse?.name,
    });
    setHouses(currentHouse);
    setLandlord(currentLandlord);
    return () => {
      houseStore.clearCurrentHouse();
    };
  }, []);

  /**
   * 打电话
   */
  const phoneLandlord = () => {
    // landlord?.phone &&
    //   makePhoneCall({
    //     phoneNumber: landlord.phone,
    //   });
  };

  /**
   * 去改变房屋的收藏状态
   */
  const toChangeHouseCollectStatus = async () => {
    // const res: any = await changeCollectStatus(
    //   houses?.houseId!,
    //   landlord?.id!,
    //   Number(!collected)
    // );
    // setCollected(!collected);
    // updateHouseCollectList(res.houseId, res.status);
  };

  /**
   * 获取当前房屋的收藏状态
   */
  const getCurrentHouseCollectStatus = async () => {
    if (houses?.houseId) {
      const status: number | null = await getHouseCollectStatus(houses.houseId);
      status && setCollected(Boolean(status));
    }
  };

  /**
   * 获取当前房屋的租赁状态
   */
  const getCurrentHouseLeaseStatue = async () => {
    // 未登录
    if (!authStore.isLogin) return;
    if (houses?.houseId && user?.id) {
      const res: any = await getLeaseStatus(houses?.houseId, user?.id);
      res?.status && setLeaseState(res.status);
    }
  };

  // 租客未登录进来，点击收藏或者租赁
  useEffect(() => {
    getCurrentHouseCollectStatus();
    getCurrentHouseLeaseStatue();
  }, [houses?.houseId, user?.id]);

  /**
   * 去租赁
   */
  const toLease = async () => {
    if (houses?.houseId && user?.id) {
      const res: any = await addLease({
        houseId: houses?.houseId,
        landlordId: landlord?.id!,
        tenantId: user?.id,
        leaseMonths: Number(leaseMonths),
      });
      if (!res.status) return;
      setLeaseState(res.status);
      showToast({
        title: '申请发送成功，等待处理！',
      });
      setLeasePopupVisible(false);
      // websocketInstance &&
      //   websocketInstance.send({
      //     data: JSON.stringify({
      //       toIdentity: AuthConstant.LANDLORD,
      //       toId: landlord?.id!,
      //       active: BusinessConstant.SOCKET_GET_PENDING_LEASE,
      //     }),
      //   });
    }
  };

  /**
   * 处理点击租赁按钮事件
   */
  const handleClickLeaseBtn = () => {
    if (!authStore.isLogin) {
      // navigateTo({
      //   url: `/pages/login/index?execute=${BusinessConstant.EXECUTE_BACK}`,
      // });
      return;
    }
    setLeaseMsgVisible(true);
  };

  const lookHouseComment = () => {
    // navigateTo({
    //   url: `/pages/houseAllComment/index?houseName=${houses?.name}&houseId=${houses?.houseId}`,
    // });
  };

  const toChat = () => {
    // setChatReceiver(currentLandlord);
    // navigateTo({
    //   url: `/pages/chatMessage/index`,
    // });
  };

  return (
    <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
      <View className='gap-6 mb-8'>
        <HouseImageList imgList={JSON.parse(houses?.houseImg || '[]')} />
        <View className='bg-secondary-50 p-4 rounded-lg mx-4 gap-4' needShadow>
          <View className='flex-row items-center justify-between'>
            <View className='flex-row items-center'>
              <Image
                src={landlord?.headImg}
                size='2xs'
                className='rounded-full'
              />
              <Text className='ml-2'>{landlord?.name}</Text>
            </View>
            <View
              className='flex-row items-center gap-1 self-end'
              onTouchEnd={lookHouseComment}
            >
              <Text>查看房屋评论</Text>
              <Icon as='AntDesign' name='right' size={16} />
            </View>
          </View>
          {identity === TENANT && (
            <View className='flex-row items-center gap-8'>
              <View onTouchEnd={toChangeHouseCollectStatus}>
                {!collected ? (
                  <Icon
                    as='AntDesign'
                    name='star'
                    lightColor='#edb83b'
                    darkColor='#edb83b'
                  />
                ) : (
                  <Icon as='AntDesign' name='staro' />
                )}
              </View>
              <View onTouchEnd={phoneLandlord}>
                <Icon as='AntDesign' name='phone' />
              </View>
              <View onTouchEnd={toChat}>
                <Icon as='AntDesign' name='message1' size={22} />
              </View>
            </View>
          )}
          {identity === TENANT ? (
            leaseState === HouseToLeaseMap.rejected ||
            leaseState === HouseToLeaseMap.rented ? (
              <Button action='secondary' onPress={handleClickLeaseBtn}>
                <ButtonText>租赁</ButtonText>
              </Button>
            ) : (
              <View className='already-leased'>
                <View className='line'></View>
                <Text className='text'>已向房东发送租赁请求</Text>
                <View className='line'></View>
              </View>
            )
          ) : null}
        </View>
        <ShowCollectFees houses={houses} />
        <ShowHouseMessages houses={houses} />
        <AlertDialogGroup
          visible={leasePopupVisible}
          onClose={() => setLeasePopupVisible(false)}
          onConfirm={toLease}
          content='您的信息将会提供给房东，是否继续？'
        />
      </View>
      {/* <Popup
        title='请填写租赁信息'
        visible={leaseMsgVisible}
        onClose={() => setLeaseMsgVisible(false)}
        onConfirm={async () => {
          if (!leaseMonths) {
            showToast({ title: '请填写租赁月数', icon: 'none' });
            return;
          }
          if (isNaN(Number(leaseMonths))) {
            showToast({ title: '租赁月数只能填数字', icon: 'none' });
            return;
          }
          setLeaseMsgVisible(false);
          setLeasePopupVisible(true);
        }}
      >
        <View className='flex items-center'>
          <Text>租赁月数：</Text>
          <Input
            placeholder='您打算租多少个月'
            onChange={(value) => setLeaseMonths(value)}
            type='number'
          ></Input>
        </View>
      </Popup> */}
    </ScrollView>
  );
};

export default observer(MarketLookHouse);
