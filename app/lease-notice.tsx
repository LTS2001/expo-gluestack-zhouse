import {
  getLandlordHouseList,
  getTenantLeasedListLandlord,
  sendMessage,
} from '@/business';
import { Empty, TenantCard } from '@/components';
import {
  AlertDialogGroup,
  Button,
  ButtonText,
  showToast,
  Text,
  View,
} from '@/components/ui';
import {
  HouseToLeaseMap,
  SOCKET_GET_TENANT_LEASE_HOUSE,
  TENANT,
} from '@/constants';
import { IPendingLease } from '@/global';
import { getLeasePendingListApi, putLeaseStatusApi } from '@/request';
import { leaseStore } from '@/stores';
import { formatUtcTime } from '@/utils';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { ScrollView } from 'react-native';

function LeaseNotice() {
  const { landlordPendingLeaseList, setLandlordPendingLeaseList } = leaseStore;
  const [leasePopupVisible, setLeasePopupVisible] = useState(false);
  const [currentLease, setCurrentLease] = useState<IPendingLease>();
  const [currentStatus, setCurrentStatus] = useState<number>();
  const [alterText, setAlterText] = useState('');

  /**
   * change the status of current lease
   */
  const confirmLease = async () => {
    await putLeaseStatusApi({
      status: currentStatus!,
      landlordId: currentLease?.landlordId!,
      tenantId: currentLease?.tenantId!,
      houseId: currentLease?.houseId!,
    });
    const _pendingLeaseList = await getLeasePendingListApi();
    setLandlordPendingLeaseList(_pendingLeaseList);
    setLeasePopupVisible(false);
    if (currentStatus === HouseToLeaseMap.leased) {
      // update the tenant's rental housing data
      sendMessage({
        toIdentity: TENANT,
        toId: currentLease?.tenantId!,
        active: SOCKET_GET_TENANT_LEASE_HOUSE,
      });
      // update the landlord's tenant information
      getTenantLeasedListLandlord();
      // update the landlord's house
      getLandlordHouseList();
      showToast({
        title: `${currentLease?.tenantName}已入住${currentLease?.houseName}`,
        icon: 'success',
      });
    }
  };

  const showLeasePopup = (lease: IPendingLease, status: number) => {
    if (status === HouseToLeaseMap.leased) {
      setAlterText('是否通过申请？租客将直接入住房屋！');
    } else if (status === HouseToLeaseMap.rejected) {
      setAlterText('是否驳回申请？');
    }
    setLeasePopupVisible(true);
    setCurrentLease(lease);
    setCurrentStatus(status);
  };

  return (
    <View className='flex-1'>
      {(landlordPendingLeaseList?.length ?? 0) > 0 ? (
        <ScrollView>
          {landlordPendingLeaseList?.map(
            (lease: IPendingLease, idx: number) => {
              return (
                <TenantCard
                  key={idx}
                  lease={lease}
                  msgItemNode={
                    <View className='mt-2'>
                      <View className='flex-row items-center'>
                        <Text>申请租赁时长：</Text>
                        <Text>{lease.leaseMonths}个月</Text>
                      </View>
                      <View className='flex-row items-center'>
                        <Text>申请日期：</Text>
                        <Text>{formatUtcTime(lease.leaseDate)}</Text>
                      </View>
                    </View>
                  }
                  bottomNode={
                    <View className='flex-row items-center gap-4 mt-4'>
                      <Button
                        size='md'
                        onPress={() =>
                          showLeasePopup(lease, HouseToLeaseMap.leased)
                        }
                      >
                        <ButtonText>通过申请</ButtonText>
                      </Button>
                      <Button
                        size='md'
                        onPress={() =>
                          showLeasePopup(lease, HouseToLeaseMap.rejected)
                        }
                      >
                        <ButtonText>驳回申请</ButtonText>
                      </Button>
                    </View>
                  }
                />
              );
            }
          )}
        </ScrollView>
      ) : (
        <Empty text='暂无租赁申请' />
      )}
      <AlertDialogGroup
        visible={leasePopupVisible}
        onClose={() => setLeasePopupVisible(false)}
        onConfirm={confirmLease}
        content={alterText}
      />
    </View>
  );
}

export default observer(LeaseNotice);
