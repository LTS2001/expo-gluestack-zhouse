import {
  HouseImageList,
  ShowCollectFees,
  ShowHouseMessages,
  Tag,
} from '@/components';
import TenantLookHouseTool from '@/components/tenant-look-house-tool';
import { Button, ButtonText, Text, View } from '@/components/ui';
import { leaseStore, userStore } from '@/stores';
import { formatUtcTime, getDayNum } from '@/utils';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo } from 'react';
import { ScrollView } from 'react-native';

const TenantLookLeaseHouse = () => {
  const { currentLeaseHouse: houses } = leaseStore;
  const { currentLandlord: landlord } = userStore;
  // const { setChatReceiver } = chatStore;
  // const { currentLandlord } = userStore;
  // const { changeCollectStatus, getHouseCollectStatus } = useCollect();
  // const { useLeaveChatSession } = useChat();
  const { repairStatus: _repairStatus } = useLocalSearchParams();

  // false: pending repair, true: repaired
  const repairStatus = useMemo(
    () => (_repairStatus === 'false' ? false : true),
    [_repairStatus]
  );

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({ title: houses?.houseName });
  }, [navigation, houses]);

  /**
   * 房屋报修
   */
  const toReportHouse = () => {
    // 房屋已处于维修状态
    // if (!reportStatus) return;
    // navigateTo({
    //   url: `/pages/report/index?houseId=${currentLeaseHouse.houseId}&landlordId=${currentLeaseHouse.landlordId}`,
    // });
  };

  /**
   * 获取当前房屋的收藏状态
   */
  const getCurrentHouseCollectStatus = async () => {
    // if (currentLeaseHouse?.houseId) {
    //   const status: number | null = await getHouseCollectStatus(
    //     currentLeaseHouse.houseId
    //   );
    //   status && setCollected(Boolean(status));
    // }
  };

  // useLeaveChatSession();
  useEffect(() => {
    getCurrentHouseCollectStatus();
  }, []);

  return (
    <ScrollView>
      <View className='gap-6 mb-8'>
        <HouseImageList imgList={JSON.parse(houses?.houseImg || '[]')} />
        <View className='bg-secondary-50 p-4 rounded-lg mx-4 gap-4' needShadow>
          <TenantLookHouseTool
            landlord={landlord}
            houseId={houses?.houseId}
            houseName={houses?.houseName}
          />
          <View className='gap-2'>
            <View className='flex-row items-center justify-between'>
              <Text>入住时间</Text>
              <Text>{formatUtcTime(houses?.createdAt, 'day')}</Text>
            </View>
            <View className='flex-row items-center justify-between'>
              <Text>已入住</Text>
              <View className='flex-row items-center gap-2'>
                <Tag content={getDayNum(houses?.createdAt)} expand />
                <Text>天</Text>
              </View>
            </View>
          </View>
          <Button
            action='secondary'
            onPress={toReportHouse}
            disabled={!repairStatus}
          >
            <ButtonText>{repairStatus ? '房间报修' : '已报修'}</ButtonText>
          </Button>
        </View>
        <ShowCollectFees houses={houses} />
        <ShowHouseMessages houses={houses} />
      </View>
    </ScrollView>
  );
};

export default observer(TenantLookLeaseHouse);
