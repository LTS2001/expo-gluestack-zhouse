import { getRepairListLandlord, sendMessage } from '@/business';
import { Empty, RepairCard } from '@/components';
import { AlertDialogGroup, Button, ButtonText, View } from '@/components/ui';
import {
  ESocketMessageActionEnum,
  EUserIdentityEnum,
  HouseToRepairMap,
} from '@/constants';
import { IBaseHouse, IRepair } from '@/global';
import { getHouseListByHouseIdsApi, putRepairStatusApi } from '@/request';
import { repairStore, userStore } from '@/stores';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';

function LandlordRepair() {
  const { landlordRepairList } = repairStore;
  const { user } = userStore;
  const [alertVisible, setAlertVisible] = useState(false);
  const [repairState, setRepairState] = useState({
    id: 0,
    status: HouseToRepairMap.REPAIR_PENDING,
    tenantId: 0,
  });
  const [houseList, setHouseList] = useState<IBaseHouse[]>();

  useEffect(() => {
    if (landlordRepairList?.length) {
      const houseIdArr = landlordRepairList?.map((t) => t.houseId);
      getHouseListByHouseIdsApi([...new Set(houseIdArr)].join(',')).then(
        (houseList) => {
          setHouseList(houseList);
        }
      );
    }
  }, [landlordRepairList]);

  /**
   * handle repair complete event
   */
  const handleRepairComplete = async () => {
    // update repair status
    await putRepairStatusApi(repairState.id, repairState.status);
    // get landlord repair list
    await getRepairListLandlord(user?.id);
    // send message to tenant
    sendMessage({
      toIdentity: EUserIdentityEnum.Tenant,
      toId: repairState.tenantId,
      active: ESocketMessageActionEnum.GetTenantRepair,
    });
    setAlertVisible(false);
  };

  return (
    <View className='flex-1'>
      <ScrollView
        contentContainerClassName='flex-grow'
        showsVerticalScrollIndicator={false}
      >
        {landlordRepairList?.length ? (
          <View className='gap-6 pb-8 pt-4'>
            {landlordRepairList?.map((repair: IRepair, idx: number) => {
              // get current item's house name
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
                  isSlot={!repair.status}
                  FooterSlotComp={
                    <Button
                      onPress={() => {
                        setRepairState({
                          id: repair.id,
                          status: HouseToRepairMap.REPAIR_COMPLETE,
                          tenantId: repair.tenantId,
                        });
                        setAlertVisible(true);
                      }}
                    >
                      <ButtonText>已完成维修</ButtonText>
                    </Button>
                  }
                />
              );
            })}
          </View>
        ) : (
          <Empty text='暂无维修申请' />
        )}
      </ScrollView>
      <AlertDialogGroup
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
        onConfirm={handleRepairComplete}
        content='该维修申请确定已维修完成吗？'
      />
    </View>
  );
}

export default observer(LandlordRepair);
