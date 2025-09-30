import { Empty, RepairCard } from '@/components';
import { View } from '@/components/ui';
import { IBaseHouse, IRepair } from '@/global';
import { getHouseListByHouseIdsApi } from '@/request';
import { repairStore } from '@/stores';
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';

export default function TenantRepair() {
  const { tenantReportForRepairList } = repairStore;
  const [houseList, setHouseList] = useState<IBaseHouse[]>([]);

  useEffect(() => {
    if (tenantReportForRepairList?.length) {
      const houseIdArr = tenantReportForRepairList?.map((t) => t.houseId);
      getHouseListByHouseIdsApi([...new Set(houseIdArr)].join(',')).then(
        (houseList) => {
          setHouseList(houseList);
        }
      );
    }
  }, [tenantReportForRepairList]);

  return (
    <ScrollView
      contentContainerClassName='flex-grow'
      showsVerticalScrollIndicator={false}
    >
      {tenantReportForRepairList?.length ? (
        <View className='gap-6 pb-8 pt-4'>
          {tenantReportForRepairList?.map((repair: IRepair, idx: number) => {
            const houseName = houseList?.find(
              (h) => h.id === repair.houseId
            )?.name;
            return (
              <RepairCard
                key={idx}
                houseName={houseName!}
                status={repair.status}
                reason={repair.reason}
                createdAt={repair.createdAt}
                updatedAt={repair.updatedAt}
                images={JSON.parse(repair.image)}
                video={JSON.parse(repair.video)}
              />
            );
          })}
        </View>
      ) : (
        <Empty text='暂无报修记录' />
      )}
    </ScrollView>
  );
}
