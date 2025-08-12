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
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView } from 'react-native';

function LandlordLookHouse() {
  const navigation = useNavigation();
  const { currentHouse } = houseStore;
  // const { setChatReceiver } = chatStore;
  // const { useLeaveChatSession } = useChat();
  const [currentTenant, setCurrentTenant] = useState<IUser | null>();
  const getCurrentTenant = async (houseId: number) => {
    const res = await getTenantLeaseHouseApi(houseId);
    setCurrentTenant(res);
  };

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

  // useLeaveChatSession();

  useEffect(() => {
    if (currentHouse?.houseId) {
      getCurrentTenant(currentHouse.houseId);
    }
    return () => {
      houseStore.clearCurrentHouse();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: currentHouse?.name,
    });
  }, [currentHouse, navigation]);

  const lookHouseComment = () => {
    // navigateTo({
    //   url: `/pages/houseAllComment/index?houseName=${currentHouse?.name}&houseId=${currentHouse?.houseId}`,
    // });
  };

  return (
    <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
      <HouseImageList imgList={JSON.parse(currentHouse?.houseImg || '[]')} />
      <View
        className='gap-6 bg-secondary-50 p-4 rounded-lg mx-4 mt-4'
        needShadow
      >
        {isRelease ? (
          <View className='tenant-info'>
            <View className='flex items-center'>
              <Image src={currentTenant?.headImg} className='tenant-head-img' />
              <Text className='tenant-text'>{currentTenant?.name}</Text>
            </View>
            <View>
              <Icon as='AntDesign' name='phone' size={16} />
              <Icon as='AntDesign' name='message1' size={16} />
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
