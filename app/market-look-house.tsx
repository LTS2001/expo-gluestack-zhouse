import { sendMessage } from '@/business';
import {
  HouseImageList,
  ShowCollectFees,
  ShowHouseMessages,
} from '@/components';
import TenantLookHouseTool from '@/components/tenant-look-house-tool';
import {
  AlertDialogGroup,
  Button,
  ButtonText,
  DrawerGroup,
  FormControl,
  FormControlErrorText,
  Input,
  InputField,
  Text,
  View,
  showToast,
} from '@/components/ui';
import {
  ESocketMessageActionEnum,
  HouseToLeaseMap,
  LANDLORD,
  TENANT,
} from '@/constants';
import { getLeaseHouseTenantApi, postLeaseApi } from '@/request';
import { authStore, houseStore, userStore } from '@/stores';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView } from 'react-native';
import { z } from 'zod';

const MarketLookHouse = () => {
  const { currentHouse: houses } = houseStore;
  const { user, currentLandlord: landlord } = userStore;
  const { identity } = authStore;
  // lease popup visible
  const [leasePopupVisible, setLeasePopupVisible] = useState(false);
  // lease state
  const [leaseState, setLeaseState] = useState(0);
  // lease message popup visible
  const [leaseMsgVisible, setLeaseMsgVisible] = useState(false);
  const [leaseMonths, setLeaseMonths] = useState(0);
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
      title: houses?.name,
    });
    return () => {
      houseStore.clearCurrentHouse();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      sendMessage({
        toIdentity: LANDLORD,
        toId: landlord?.id!,
        active: ESocketMessageActionEnum.GetPendingLease,
      });
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

  return (
    <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
      <View className='gap-6 mb-8'>
        <HouseImageList imgList={JSON.parse(houses?.houseImg || '[]')} />
        <View className='bg-secondary-50 p-4 rounded-lg mx-4 gap-4' needShadow>
          <TenantLookHouseTool
            landlord={landlord}
            houseId={houses?.houseId}
            houseName={houses?.name}
          />
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
