import { getCollectHouseStatus, updateCollectHouseStatus } from '@/business';
import {
  HouseImageList,
  ShowCollectFees,
  ShowHouseMessages,
} from '@/components';
import {
  AlertDialogGroup,
  Button,
  ButtonText,
  DrawerGroup,
  FormControl,
  FormControlErrorText,
  Icon,
  Image,
  Input,
  InputField,
  Text,
  View,
  showToast,
} from '@/components/ui';
import {
  HouseToLeaseMap,
  LANDLORD,
  SOCKET_GET_PENDING_LEASE,
  TENANT,
} from '@/constants';
import { IHouse, IUser } from '@/global';
import { getLeaseHouseTenantApi, postLeaseApi } from '@/request';
import {
  authStore,
  chatStore,
  houseStore,
  socketStore,
  userStore,
} from '@/stores';
import { makePhoneCall } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView } from 'react-native';
import { z } from 'zod';

const MarketLookHouse = () => {
  const { updateHouseCollectList, currentHouse } = houseStore;
  const { socketInstance } = socketStore;
  const { user, currentLandlord } = userStore;
  const { identity } = authStore;
  const { setChatReceiver } = chatStore;
  // const { setChatReceiver } = chatStore;
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
  const [leaseMonths, setLeaseMonths] = useState(0);

  // useLeaveChatSession();

  const navigation = useNavigation();

  const formSchema = z.object({
    leaseMonths: z.coerce
      .number({
        required_error: '请填写租赁月数',
        invalid_type_error: '只能输入数字',
      })
      .min(3, { message: '租赁月数至少为3个月' })
      .max(60, { message: '租赁月数最多为60个月' }),
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    navigation.setOptions({
      title: currentHouse?.name,
    });
    setHouses(currentHouse);
    setLandlord(currentLandlord);
    return () => {
      houseStore.clearCurrentHouse();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * make phone call to landlord
   */
  const phoneLandlord = async () => {
    if (landlord?.phone) {
      await makePhoneCall(landlord.phone);
    } else {
      showToast({
        title: '房东电话信息不可用',
        action: 'error',
      });
    }
  };

  /**
   * change house collect status
   */
  const toChangeHouseCollectStatus = async () => {
    const res = await updateCollectHouseStatus(
      houses?.houseId!,
      landlord?.id!,
      Number(!collected)
    );
    setCollected(!collected);
    updateHouseCollectList(res.houseId, res.status);
  };

  /**
   * get current house collect status
   */
  const getCurrentHouseCollectStatus = async () => {
    if (houses?.houseId) {
      const status = await getCollectHouseStatus(houses.houseId);
      status && setCollected(Boolean(status));
    }
  };

  /**
   * get current house lease status
   */
  const getCurrentHouseLeaseStatue = async () => {
    // not login
    if (!authStore.isLogin) return;
    if (houses?.houseId && user?.id) {
      const res = await getLeaseHouseTenantApi(houses?.houseId, user?.id);
      res?.status && setLeaseState(res.status);
    }
  };

  // tenant not login, click collect or lease
  useEffect(() => {
    getCurrentHouseCollectStatus();
    getCurrentHouseLeaseStatue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [houses, user]);

  /**
   * send lease request to landlord
   */
  const sendLeaseRequest = async () => {
    if (houses?.houseId && user?.id) {
      const res = await postLeaseApi({
        houseId: houses?.houseId,
        landlordId: landlord?.id!,
        tenantId: user?.id,
        leaseMonths,
      });
      if (!res.status) return;
      setLeaseState(res.status);
      showToast({
        title: '申请发送成功，请耐心等待房东处理',
      });
      setLeasePopupVisible(false);
      setLeaseMsgVisible(false);
      socketInstance?.send(
        JSON.stringify({
          toIdentity: LANDLORD,
          toId: landlord?.id!,
          active: SOCKET_GET_PENDING_LEASE,
        })
      );
    }
  };

  /**
   * handle click lease btn
   */
  const handleClickLeaseBtn = () => {
    if (!authStore.isLogin) {
      router.push('/login');
      return;
    }
    setLeaseMsgVisible(true);
  };

  /**
   * look house all comment
   */
  const lookHouseAllComment = () => {
    router.push({
      pathname: '/house-all-comment',
      params: {
        houseName: houses?.name,
        houseId: houses?.houseId,
      },
    });
  };

  /**
   * to chat
   */
  const toChat = () => {
    if (!currentLandlord) return;
    setChatReceiver(currentLandlord);
    router.push('/chat-message');
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
              onTouchEnd={lookHouseAllComment}
            >
              <Text>查看房屋评论</Text>
              <Icon as='AntDesign' name='right' size={16} />
            </View>
          </View>
          {identity === TENANT && (
            <View className='flex-row items-center gap-8'>
              <View onTouchEnd={toChangeHouseCollectStatus}>
                {collected ? (
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
              <View className='flex-row items-center gap-2 justify-center'>
                <View className='h-[1px] bg-primary-0 flex-1'></View>
                <Text className='text'>已向房东发送租赁请求</Text>
                <View className='h-[1px] bg-primary-0 flex-1'></View>
              </View>
            )
          ) : null}
        </View>
        <ShowCollectFees houses={houses} />
        <ShowHouseMessages houses={houses} />
        <AlertDialogGroup
          visible={leasePopupVisible}
          onClose={() => setLeasePopupVisible(false)}
          onConfirm={sendLeaseRequest}
          content='您的信息将会提供给房东，是否继续？'
        />
        <DrawerGroup
          visible={leaseMsgVisible}
          onClose={() => setLeaseMsgVisible(false)}
          onConfirm={handleSubmit((val) => {
            setLeaseMonths(val.leaseMonths);
            setLeasePopupVisible(true);
          })}
          title={<Text className='font-bold text-2xl'>请填写租赁信息</Text>}
          content={
            <FormControl className='flex-1 '>
              <View className='flex-row gap-2 items-center'>
                <Text className='text-lg'>租赁月数：</Text>
                <View className='flex-1'>
                  <Controller
                    name='leaseMonths'
                    control={control}
                    render={({ field: { onChange } }) => (
                      <Input variant='underlined'>
                        <InputField
                          placeholder='您打算租多少个月'
                          onChangeText={onChange}
                        />
                      </Input>
                    )}
                  />
                </View>
              </View>
              <FormControlErrorText className='mt-1'>
                {errors.leaseMonths?.message}
              </FormControlErrorText>
            </FormControl>
          }
        />
      </View>
    </ScrollView>
  );
};

export default observer(MarketLookHouse);
