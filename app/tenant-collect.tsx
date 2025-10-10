import { Empty, HouseCard } from '@/components';
import { View } from '@/components/ui';
import { IHouseCollect } from '@/global';
import { getCollectedHouseListApi } from '@/request';
import { userStore } from '@/stores';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';

/**
 * TODO：后续需要优化，需要点击跳转到房屋详情页（需要区分已租赁和未租赁的房屋）
 */
function TenantCollect() {
  const { user } = userStore;
  const [collectHouseList, setCollectHouseList] = useState<IHouseCollect[]>();

  useEffect(() => {
    getCollectedHouseListApi(user?.id!).then((collectHouseList) => {
      setCollectHouseList(collectHouseList);
    });
  }, [user]);
  return (
    <ScrollView contentContainerClassName='flex-grow'>
      {collectHouseList?.length ? (
        <View className='gap-6 pb-8 pt-4'>
          {collectHouseList?.map((leaseRefund: IHouseCollect, idx: number) => {
            const {
              houseName,
              landlordImg,
              landlordName,
              houseImg,
              price,
              updatedAt,
              provinceName,
              cityName,
              areaName,
              addressInfo,
            } = leaseRefund;
            return (
              <HouseCard
                key={idx}
                houseName={houseName}
                landlordImg={landlordImg}
                landlordName={landlordName}
                houseImg={JSON.parse(houseImg)[0]}
                housePrice={price}
                date={updatedAt}
                dateText='收藏时间：'
                statusText='已收藏'
                address={`${provinceName}${cityName}${areaName}${addressInfo}`}
              />
            );
          })}
        </View>
      ) : (
        <Empty text='暂无收藏历史' />
      )}
    </ScrollView>
  );
}

export default observer(TenantCollect);
