import { getTenantLeaseRefundList } from '@/business';
import { Empty, HouseCard } from '@/components';
import { Button, ButtonText, View } from '@/components/ui';
import { IHouseLease } from '@/global';
import { commentStore, leaseStore } from '@/stores';
import { router } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { ScrollView } from 'react-native';

function TenantRefundHistory() {
  const { tenantLeaseRefundList } = leaseStore;
  const { tenantCommentList } = commentStore;
  useEffect(() => {
    getTenantLeaseRefundList();
  }, []);

  /**
   * to comment house
   * @param lease
   * @param isComment whether the house has been commented
   */
  const toCommentHouse = (lease: IHouseLease, isComment: boolean) => {
    const { houseName, houseId, landlordId, tenantId, leaseId } = lease;
    router.push({
      pathname: isComment ? '/house-all-comment' : '/comment-house',
      params: {
        houseId,
        houseName,
        tenantId,
        leaseId,
        landlordId,
      },
    });
  };

  return (
    <View className='flex-1'>
      <ScrollView
        contentContainerClassName='flex-grow'
        showsVerticalScrollIndicator={false}
      >
        {tenantLeaseRefundList?.length ? (
          <View className='gap-6 pb-8 pt-4'>
            {tenantLeaseRefundList?.map(
              (leaseRefund: IHouseLease, idx: number) => {
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
                  leaseId,
                } = leaseRefund;
                const currentComment = tenantCommentList?.find(
                  (c) => c.leaseId === leaseId
                );
                return (
                  <HouseCard
                    key={idx}
                    houseName={houseName}
                    landlordImg={landlordImg}
                    landlordName={landlordName}
                    houseImg={JSON.parse(houseImg)[0]}
                    housePrice={price}
                    date={updatedAt}
                    dateText='退租时间：'
                    statusText='已退租'
                    address={`${provinceName}${cityName}${areaName}${addressInfo}`}
                    footerSlotNode={
                      <View className='flex justify-center mt-4'>
                        <Button
                          onPress={() =>
                            toCommentHouse(leaseRefund, !!currentComment)
                          }
                          action={currentComment ? 'secondary' : 'primary'}
                        >
                          <ButtonText>
                            {currentComment ? '查看评论' : '去评论'}
                          </ButtonText>
                        </Button>
                      </View>
                    }
                  />
                );
              }
            )}
          </View>
        ) : (
          <Empty text='暂无租房历史' />
        )}
      </ScrollView>
    </View>
  );
}

export default observer(TenantRefundHistory);
