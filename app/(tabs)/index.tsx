import {
  getLandlordHouseList,
  getRepairStatus,
  getTenantLeasedHouseList,
  tenantInitialApi,
} from '@/business';
import { Empty, HeaderSearch, HouseCard, Tag } from '@/components';
import {
  AlertDialogGroup,
  Button,
  ButtonText,
  Icon,
  Text,
  TouchableOpacity,
  View,
  showToast,
} from '@/components/ui';
import { HouseToStatusMap } from '@/constants';
import { IHouse, IHouseLease, IUser } from '@/global';
import { useRefresh } from '@/hooks';
import { putHouseApi, tenantRefundApi } from '@/request';
import { authStore, houseStore, leaseStore, userStore } from '@/stores';
import { makePhoneCall } from '@/utils';
import { Redirect, router, useNavigation } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { RefreshControl, ScrollView } from 'react-native';

const LandlordHome = observer(() => {
  const navigation = useNavigation();
  const { landlordHouseList, setCurrentHouse, clearCurrentHouse } = houseStore;
  const { isLogin } = authStore;
  const [delHouseAlterVisible, setDelHouseAlterVisible] = useState(false);
  const [publishHouseAlterVisible, setPublishHouseAlterVisible] =
    useState(false);
  const [chooseHouse, setChooseHouse] = useState<IHouse>();
  const [search, setSearch] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: isSearchFocused ? '' : '我的房源',
      headerRight: () => (
        <HeaderSearch
          onChangeText={setSearch}
          onChangeFocus={setIsSearchFocused}
        />
      ),
    });
  }, [navigation, isSearchFocused]);

  /**
   * to add house page
   */
  const addHouse = () => {
    clearCurrentHouse();
    router.push('/add-edit-house');
  };

  /**
   * handle edit house
   * @param house house info
   */
  const toEditor = (house: IHouse) => {
    // set house info to store
    setCurrentHouse(house);
    router.push('/add-edit-house');
  };

  /**
   * to house info
   * @param houses house info
   */
  const toHouseInfo = (houses: IHouse) => {
    setCurrentHouse(houses);
    router.push('/landlord-look-house');
  };

  /**
   * confirm delete house
   */
  const confirmDelHouse = async () => {
    // if (chooseHouse?.status === HouseConstant.HouseToStatusMap.release) {
    //   closeDelAlter();
    //   showToast({
    //     title: '该房屋处于出租状态！',
    //     icon: 'error',
    //   });
    //   return;
    // }
    // await HouseBusiness.delHouse(chooseHouse?.houseId!);
    // againGetLandlordHouseList();
    // closeDelAlter();
    // showToast({
    //   title: '删除成功！',
    //   icon: 'success',
    // });
  };

  const confirmPublishHouse = async () => {
    if (!chooseHouse) return;
    const {
      provinceName,
      cityName,
      areaName,
      addressInfo,
      createdAt,
      updatedAt,
      landlordId,
      ...house
    } = chooseHouse;
    await putHouseApi({
      ...house,
      status: HouseToStatusMap.notLeaseReleased,
      addressDetail: `${provinceName}${cityName}${areaName}${addressInfo}`,
    });
    await getLandlordHouseList();
    showToast({
      title: '发布成功',
      icon: 'success',
    });
    setPublishHouseAlterVisible(false);
  };

  return (
    <View className='flex-1 relative'>
      {landlordHouseList?.length && isLogin ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className='gap-6 py-4'>
            {landlordHouseList.map((item: IHouse, idx: number) => {
              const { notLeaseNotReleased, notLeaseReleased, release } =
                HouseToStatusMap;
              const status = Number(item.status);
              // rented
              const rented = status === release;
              // published (not lease released)
              const isPublish = status === notLeaseReleased;
              // waiting for rent (not lease not released or published)
              const forRent = [notLeaseNotReleased, notLeaseReleased].includes(
                status
              );
              return (
                <HouseCard
                  key={idx}
                  houseName={item.name}
                  isShowLandlord={false}
                  houseImg={JSON.parse(item.houseImg)[0]}
                  statusSlotNode={
                    <View className='flex-row gap-2'>
                      {(isPublish || rented) && (
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
                      )}
                      {!rented && (
                        <Tag
                          content={isPublish ? '已发布' : '未发布'}
                          bgColor={
                            isPublish
                              ? 'bg-theme-primary'
                              : 'bg-theme-secondary'
                          }
                          expand
                        />
                      )}
                    </View>
                  }
                  housePrice={item.price}
                  dateText='创建时间：'
                  date={item.createdAt}
                  address={`${item.provinceName}${item.cityName}${item.areaName}${item.addressName}`}
                  footerSlotNode={
                    <View className='flex-row mt-4 gap-6'>
                      <Button onPress={() => toHouseInfo(item)} size='sm'>
                        <ButtonText>查看</ButtonText>
                      </Button>
                      <Button onPress={() => toEditor(item)} size='sm'>
                        <ButtonText>编辑</ButtonText>
                      </Button>
                      <Button
                        onPress={() => {
                          setChooseHouse(item);
                          setDelHouseAlterVisible(true);
                        }}
                        size='sm'
                      >
                        <ButtonText>删除</ButtonText>
                      </Button>
                      {rented || isPublish ? null : (
                        <Button
                          onPress={() => {
                            setChooseHouse(item);
                            setPublishHouseAlterVisible(true);
                          }}
                          size='sm'
                        >
                          <ButtonText>发布</ButtonText>
                        </Button>
                      )}
                    </View>
                  }
                />
              );
            })}
          </View>
        </ScrollView>
      ) : (
        <Empty
          text={isLogin ? '暂无房屋，点击右下角新增一个吧' : '请登陆后查看'}
        />
      )}
      {isLogin && (
        <TouchableOpacity
          className='absolute bottom-24 right-8 bg-primary-500 rounded-full p-3'
          onPress={addHouse}
        >
          <Text>
            <Icon
              as='AntDesign'
              name='plus'
              lightColor='white'
              darkColor='black'
            />
          </Text>
        </TouchableOpacity>
      )}
      <AlertDialogGroup
        visible={delHouseAlterVisible}
        onClose={() => setDelHouseAlterVisible(false)}
        onConfirm={confirmDelHouse}
        content='你确定要删除该房屋吗？'
      />
      <AlertDialogGroup
        visible={publishHouseAlterVisible}
        onClose={() => setPublishHouseAlterVisible(false)}
        onConfirm={confirmPublishHouse}
        content='你确定要发布该房屋吗？'
      />
    </View>
  );
});

const TenantHome = observer(() => {
  const { tenantLeasedHouseList, setCurrentLeaseHouse } = leaseStore;
  const { isLogin } = authStore;
  const { setCurrentLandlord, user } = userStore;
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerTitle: '我的租房',
      headerRight: null,
    });
  }, [navigation]);
  const [leaseId, setLeaseId] = useState(0);
  const [refundAlertVisible, setRefundAlertVisible] = useState(false);
  const { refreshing, onRefresh } = useRefresh();

  /**
   * to look lease house
   * @param leaseHouse lease house info
   * @param repairStatus house repair status
   */
  const toLookLeaseHouse = (leaseHouse: IHouseLease, repairStatus: boolean) => {
    setCurrentLandlord({
      id: leaseHouse.landlordId,
      name: leaseHouse.landlordName,
      headImg: leaseHouse.landlordImg,
      phone: leaseHouse.landlordPhone,
    } as IUser);
    setCurrentLeaseHouse(leaseHouse);
    router.push({
      pathname: '/tenant-look-lease-house',
      params: { repairStatus: repairStatus.toString() },
    });
  };

  /**
   * confirm refund house
   */
  const confirmRefund = async () => {
    await tenantRefundApi(leaseId);
    // update tenant's leased house list
    getTenantLeasedHouseList(user?.id);
    setRefundAlertVisible(false);
    showToast({
      title: '退租成功！',
      icon: 'success',
    });
  };

  /**
   * show refund alert
   * @param leaseId lease id
   */
  const showRefundAlert = (leaseId: number) => {
    setLeaseId(leaseId);
    setRefundAlertVisible(true);
  };

  return (
    <View className='flex-1'>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName='flex-grow'
        refreshControl={
          isLogin ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh(() => tenantInitialApi(user?.id))}
            />
          ) : undefined
        }
      >
        <View className='gap-6 py-4 flex-1'>
          {tenantLeasedHouseList?.length && isLogin ? (
            tenantLeasedHouseList.map((item: IHouseLease, idx: number) => {
              // get current house repair status
              const houseRepairStatus = getRepairStatus(item.houseId);
              return (
                <HouseCard
                  key={idx}
                  houseName={item.houseName}
                  landlordImg={item.landlordImg}
                  landlordName={item.landlordName}
                  toLookHouse={() => toLookLeaseHouse(item, houseRepairStatus)}
                  houseImg={JSON.parse(item.houseImg)[0]}
                  statusText={houseRepairStatus ? '正常' : '维修中'}
                  housePrice={item.price}
                  date={item.updatedAt}
                  dateText='租赁时间：'
                  address={`${item.provinceName}${item.cityName}${item.areaName}${item.addressName}`}
                  footerSlotNode={
                    <View className='flex-row gap-6 mt-4'>
                      <Button
                        onPress={() => makePhoneCall(item.landlordPhone)}
                        size='sm'
                      >
                        <ButtonText>联系房东</ButtonText>
                      </Button>
                      <Button
                        size='sm'
                        onPress={() => {
                          if (houseRepairStatus)
                            router.push({
                              pathname: '/tenant-report-for-repair',
                              params: {
                                houseId: item.houseId,
                                landlordId: item.landlordId,
                              },
                            });
                          else router.push('/tenant-repair');
                        }}
                      >
                        <ButtonText>
                          {houseRepairStatus ? '房间报修' : '已报修'}
                        </ButtonText>
                      </Button>
                      <Button
                        size='sm'
                        onPress={() => showRefundAlert(item.leaseId)}
                      >
                        <ButtonText>退租</ButtonText>
                      </Button>
                    </View>
                  }
                />
              );
            })
          ) : (
            <Empty
              text={
                isLogin ? '暂无租赁房屋，去房屋市场看看吧！' : '请登陆后查看'
              }
            />
          )}
        </View>
      </ScrollView>
      <AlertDialogGroup
        visible={refundAlertVisible}
        onClose={() => setRefundAlertVisible(false)}
        onConfirm={confirmRefund}
        content='您确定要退租吗？'
      />
    </View>
  );
});

function Home() {
  const { identity } = authStore;
  return identity === 'tenant' ? (
    <TenantHome />
  ) : identity === 'landlord' ? (
    <LandlordHome />
  ) : (
    <Redirect href='/identity' />
  );
}
export default observer(Home);
