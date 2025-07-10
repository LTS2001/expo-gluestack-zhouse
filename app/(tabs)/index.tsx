import Empty from '@/components/empty';
import HouseCard from '@/components/house-card';
import Tag from '@/components/tag';
import { AlertDialogGroup } from '@/components/ui/alert-dialog';
import { Button, ButtonText } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { HouseToStatusMap } from '@/constants/house';
import { IHouse } from '@/global';

import useHouse from '@/hooks/useHouse';
import authStore from '@/stores/auth';
import houseStore from '@/stores/house';
import locationStore from '@/stores/location';
import { router } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';

const LandlordHome = observer(() => {
  const { landlordHouseList, setCurrentHouse, clearCurrentHouse } = houseStore;
  const { isLogin } = authStore;
  const { clearTitle, clearAddress } = locationStore;
  const { getLandlordHouseList } = useHouse();
  // 删除房屋提示框
  const [delHouseAlterVisible, setDelHouseAlterVisible] = useState(false);
  const [chooseHouse, setChooseHouse] = useState<IHouse>();

  useEffect(() => {
    getLandlordHouseList();
  }, [isLogin]);

  /**
   * to add house page
   */
  const addHouse = () => {
    clearCurrentHouse();
    clearTitle();
    clearAddress();
    router.push('/add-edit-house');
  };

  /**
   * handle edit house
   * @param house house info
   */
  const toEditor = (house: IHouse) => {
    // set house info to store
    setCurrentHouse(house);
    clearTitle();
    clearAddress();
    router.push('/add-edit-house');
  };

  /**
   * close delete house alert
   */
  const closeDelAlter = () => {
    setDelHouseAlterVisible(false);
  };

  /**
   * open delete house alert
   * @param house house info
   */
  const openDelAlter = (house: IHouse) => {
    setChooseHouse(house);
    setDelHouseAlterVisible(true);
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

  /**
   * to house info
   * @param houses house info
   */
  const toHouseInfo = (houses: IHouse) => {
    // router.push('/house-info');
    // set house info to store
    setCurrentHouse(houses);
  };

  return (
    <View className='flex-1 relative'>
      {landlordHouseList?.length && isLogin ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {landlordHouseList.map((item: IHouse, idx: number) => {
            const { notLeaseNotReleased, notLeaseReleased, release } =
              HouseToStatusMap;
            // published (not lease released)
            const publish = Number(item.status) === notLeaseReleased;
            // waiting for rent (not lease not released or published)
            const forRent = [notLeaseNotReleased, publish].includes(
              Number(item.status)
            );
            // rented
            const rented = Number(item.status) === release;
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
                    <Tag
                      content={rented || publish ? '已发布' : '未发布'}
                      bgColor={
                        rented || publish
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
                    <Button
                      onTouchEnd={() => toEditor(item)}
                      className='bg-theme-primary'
                      size='sm'
                    >
                      <ButtonText>编辑</ButtonText>
                    </Button>
                    <Button
                      onTouchEnd={() => openDelAlter(item)}
                      className='bg-error-700'
                      size='sm'
                    >
                      <ButtonText>删除</ButtonText>
                    </Button>
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
        onClose={closeDelAlter}
        onConfirm={confirmDelHouse}
        content='你确定要删除该房屋吗？'
      />
    </View>
  );
});

const TenantHome = observer(() => {
  return (
    <View>
      <Text>我是租客首页</Text>
    </View>
  );
});

function Home() {
  const { identity } = authStore;
  return identity === 'tenant' ? <TenantHome /> : <LandlordHome />;
}
export default observer(Home);
