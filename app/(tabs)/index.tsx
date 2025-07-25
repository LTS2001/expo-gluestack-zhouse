import Empty from '@/components/empty';
import HeaderSearch from '@/components/header-search';
import HouseCard from '@/components/house-card';
import Tag from '@/components/tag';
import { AlertDialogGroup } from '@/components/ui/alert-dialog';
import { Button, ButtonText } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { showToast } from '@/components/ui/toast';
import { View } from '@/components/ui/view';
import { LANDLORD } from '@/constants/auth';
import { HouseToStatusMap } from '@/constants/house';
import { SOCKET_GET_PENDING_LEASE } from '@/constants/socket';
import { IHouse } from '@/global';

import useHouse from '@/hooks/useHouse';
import { updateHouse } from '@/request/api/house';
import authStore from '@/stores/auth';
import houseStore from '@/stores/house';
import socketStore from '@/stores/socket';
import { router, useNavigation } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';

const LandlordHome = observer(() => {
  const navigation = useNavigation();
  const { landlordHouseList, setCurrentHouse, clearCurrentHouse } = houseStore;
  const { isLogin } = authStore;
  const { getLandlordHouseList } = useHouse();
  // 删除房屋提示框
  const [delHouseAlterVisible, setDelHouseAlterVisible] = useState(false);
  const [publishHouseAlterVisible, setPublishHouseAlterVisible] =
    useState(false);
  const [chooseHouse, setChooseHouse] = useState<IHouse>();
  const [search, setSearch] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    console.log('isSearchFocused', isSearchFocused);
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

  useEffect(() => {
    getLandlordHouseList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogin]);

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
    await updateHouse({
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
          {landlordHouseList.map((item: IHouse, idx: number) => {
            const { notLeaseNotReleased, notLeaseReleased, release } =
              HouseToStatusMap;
            const status = Number(item.status);
            // published (not lease released)
            const isPublish = status === notLeaseReleased;

            // waiting for rent (not lease not released or published)
            const forRent = [notLeaseNotReleased, notLeaseReleased].includes(
              status
            );
            // rented
            const rented = status === release;
            return (
              <HouseCard
                key={idx}
                className='m-4'
                houseName={item.name}
                isShowLandlord={false}
                houseImg={JSON.parse(item.houseImg)[0]}
                isStatusSlot={true}
                StatusSlotComponent={
                  <View className='flex-row gap-2'>
                    {isPublish && (
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

                    <Tag
                      content={rented || isPublish ? '已发布' : '未发布'}
                      bgColor={
                        rented || isPublish
                          ? 'bg-theme-primary'
                          : 'bg-theme-secondary'
                      }
                      expand
                    />
                  </View>
                }
                housePrice={item.price}
                dateText='创建时间：'
                date={item.createdAt}
                address={`${item.provinceName}${item.cityName}${item.areaName}${item.addressName}`}
                isFooterSlot={true}
                FooterSlotComponent={
                  <View className='flex-row mt-4 gap-6'>
                    <Button onTouchEnd={() => toHouseInfo(item)} size='sm'>
                      <ButtonText>查看</ButtonText>
                    </Button>
                    <Button onTouchEnd={() => toEditor(item)} size='sm'>
                      <ButtonText>编辑</ButtonText>
                    </Button>
                    <Button
                      onTouchEnd={() => {
                        setChooseHouse(item);
                        setDelHouseAlterVisible(true);
                      }}
                      size='sm'
                    >
                      <ButtonText>删除</ButtonText>
                    </Button>
                    {!isPublish ? (
                      <Button
                        onTouchEnd={() => {
                          setChooseHouse(item);
                          setPublishHouseAlterVisible(true);
                        }}
                        size='sm'
                      >
                        <ButtonText>发布</ButtonText>
                      </Button>
                    ) : null}
                  </View>
                }
              />
            );
          })}
        </ScrollView>
      ) : (
        <Empty
          text={isLogin ? '暂无房屋，点击右下角新增一个吧' : '请登陆后查看'}
        />
      )}
      {isLogin && (
        <View
          className='absolute bottom-24 right-8 bg-primary-500 rounded-full p-3'
          onTouchEnd={addHouse}
        >
          <Text>
            <Icon
              as='AntDesign'
              name='plus'
              lightColor='white'
              darkColor='black'
            />
          </Text>
        </View>
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
  const navigation = useNavigation();
  const { socketInstance } = socketStore;
  useEffect(() => {
    navigation.setOptions({
      headerTitle: '我的租房',
      headerRight: null,
    });
  }, [navigation]);

  return (
    <View>
      <Text>我是租客首页</Text>
      <Button
        onTouchEnd={() => {
          socketInstance?.send(
            JSON.stringify({
              toIdentity: LANDLORD,
              toId: 1,
              active: SOCKET_GET_PENDING_LEASE,
            })
          );
        }}
      >
        <ButtonText>发送消息</ButtonText>
      </Button>
    </View>
  );
});

function Home() {
  const { identity } = authStore;
  return identity === 'tenant' ? <TenantHome /> : <LandlordHome />;
}
export default observer(Home);
