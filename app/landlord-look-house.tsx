import HouseImageList from '@/components/house-image-list';
import ShowCollectFees from '@/components/show-collect-fees';
import ShowHouseMessages from '@/components/show-house-messages';
import Tag from '@/components/tag';
import { Icon } from '@/components/ui/icon';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { HouseToStatusMap } from '@/constants/house';
import { IUser } from '@/global';
import { getLeaseByHouseId } from '@/request/api/house-lease';
import houseStore from '@/stores/house';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView } from 'react-native';

function LandlordLookHouse() {
  const navigation = useNavigation();
  const { currentHouse } = houseStore;
  // const { setChatReceiver } = chatStore;
  // const { useLeaveChatSession } = useChat();
  const [currentTenant, setCurrentTenant] = useState<IUser>();
  const getCurrentTenant = async (houseId: number) => {
    const res = await getLeaseByHouseId(houseId);
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
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: currentHouse?.name,
    });
  }, [currentHouse]);

  const lookHouseComment = () => {
    // navigateTo({
    //   url: `/pages/houseAllComment/index?houseName=${currentHouse?.name}&houseId=${currentHouse?.houseId}`,
    // });
  };

  const toChat = () => {
    // setChatReceiver(currentTenant);
    // navigateTo({
    //   url: `/pages/chatMessage/index`,
    // });
  };

  /**
   * 打电话
   */
  const phoneTenant = () => {
    // currentTenant?.phone &&
    //   makePhoneCall({
    //     phoneNumber: currentTenant.phone,
    //   });
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
          <View
            className='flex-row items-center self-end gap-1'
            onTouchEnd={lookHouseComment}
          >
            <Text>查看房屋评论</Text>
            <Icon as='AntDesign' name='right' size={16} />
          </View>
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
