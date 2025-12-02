import {
  HouseImageList,
  ShowCollectFees,
  ShowHouseMessages,
  Tag,
} from '@/components';
import { Icon, Image, Text, TouchableOpacity, View } from '@/components/ui';
import { HouseToStatusMap } from '@/constants';
import { IUser } from '@/global';
import { getTenantLeaseHouseApi } from '@/request';
import { houseStore } from '@/stores';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView } from 'react-native';

function LandlordLookHouse() {
  const navigation = useNavigation();
  const { currentHouse } = houseStore;
  // const { setChatReceiver } = chatStore;
  // const { useLeaveChatSession } = useChat();
  const [currentTenant, setCurrentTenant] = useState<IUser | null>();

  const isRelease = useMemo(
    () => currentHouse?.status === HouseToStatusMap.release,
    [currentHouse]
  );
  // waiting for rent (not lease not released or published)
  const forRent = [
    HouseToStatusMap.notLeaseNotReleased,
    HouseToStatusMap.notLeaseReleased,
  ].includes(Number(currentHouse?.status));
  // rented
  const rented = Number(currentHouse?.status) === HouseToStatusMap.release;

  useEffect(() => {
    if (!currentHouse?.houseId) return;
    const getCurrentTenant = async (houseId: number) => {
      const res = await getTenantLeaseHouseApi(houseId);
      setCurrentTenant(res);
    };
    getCurrentTenant(currentHouse.houseId);
    return () => {
      houseStore.clearCurrentHouse();
    };
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: currentHouse?.name,
    });
  }, [currentHouse, navigation]);

  const lookHouseComment = () => {
    router.push({
      pathname: '/house-all-comment',
      params: {
        houseName: currentHouse?.name,
        houseId: currentHouse?.houseId,
      },
    });
  };

  return (
    <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
      <HouseImageList imgList={JSON.parse(currentHouse?.houseImg || '[]')} />
      <View
        className='gap-6 bg-secondary-50 p-4 rounded-lg mx-4 mt-4'
        needShadow
      >
        {isRelease ? (
          <View className='flex-row justify-between'>
            <View className='flex-row items-center gap-4'>
              <Image
                src={currentTenant?.headImg}
                size='xs'
                className='border-[0.5px] rounded border-primary-0'
              />
              <Text className='text-lg'>{currentTenant?.name}</Text>
            </View>
            <View className='flex-row gap-8'>
              <Icon as='AntDesign' name='phone' />
              <Icon as='AntDesign' name='message1' />
            </View>
          </View>
        ) : null}
        <View className='flex-row items-center gap-2 justify-between'>
          <Tag
            content={forRent ? '待租' : rented ? '已租' : '删除'}
            bgColor={
              forRent
                ? 'bg-theme-tertiary'
                : rented
                ? 'bg-theme-primary'
                : 'bg-theme-secondary'
            }
            expand
          />
          <TouchableOpacity
            className='flex-row items-center self-end gap-1'
            onPress={lookHouseComment}
          >
            <Text>查看房屋评论</Text>
            <Icon as='AntDesign' name='right' size={16} />
          </TouchableOpacity>
        </View>
      </View>
      <View className='gap-6 pb-10 pt-6'>
        <ShowCollectFees houses={currentHouse} />
        <ShowHouseMessages houses={currentHouse} />
      </View>
    </ScrollView>
  );
}

export default observer(LandlordLookHouse);
