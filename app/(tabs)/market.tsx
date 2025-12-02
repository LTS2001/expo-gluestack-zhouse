import { getMarketHouseList } from '@/business';
import { Empty, HeaderSearch } from '@/components';
import { Icon, Image, Text, TouchableOpacity, View } from '@/components/ui';
import { ASPECT_RATIO } from '@/constants';
import emitter, { EEventNameEnum } from '@/emitter';
import { IHouse, ITencentMapLocation, IUser } from '@/global';
import { getCollectHouseNumApi, getLandlordListApi } from '@/request';
import { houseStore, userStore } from '@/stores';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Dimensions, RefreshControl, ScrollView } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const halfScreenWidth = screenWidth / 2;

/**
 * TODO：
 * 1、获取房屋的时候一次性将房东信息和收藏信息获取出来
 * 2、优化下拉刷新逻辑
 * 3、优化搜索逻辑
 */
const Market = () => {
  const { marketHouseList, houseCollectList, setCurrentHouse } = houseStore;
  const { setCurrentLandlord } = userStore;
  // landlord list
  const [landlordList, setLandlordList] = useState<IUser[]>([]);
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [chooseLocation, setChooseLocation] = useState<ITencentMapLocation>({
    cityname: '广州市',
    latlng: { lat: 23.12463, lng: 113.36199 },
    poiaddress: '广东省广州市天河区天府路1号',
    poiname: '广州市天河区人民政府',
  });
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    const { lat: latitude, lng: longitude } = chooseLocation.latlng;
    setRefreshing(true);
    await getMarketHouseList({ latitude, longitude });
    setRefreshing(false);
  };
  useEffect(() => {
    emitter.on(EEventNameEnum.GetLocation, (data) => {
      data && setChooseLocation(data);
    });
    return () => {
      emitter.off(EEventNameEnum.GetLocation);
    };
  }, []);

  useEffect(() => {
    const { lat: latitude, lng: longitude } = chooseLocation.latlng;
    getMarketHouseList({ latitude, longitude });
  }, [chooseLocation]);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: isSearchFocused
        ? undefined
        : () => (
            <TouchableOpacity
              className='flex-row items-center gap-2 py-3 ml-4 absolute left-0'
              onPress={() =>
                router.push({
                  pathname: '/choose-location',
                  params: {
                    eventName: EEventNameEnum.GetLocation,
                  },
                })
              }
            >
              <Icon
                as='Octicons'
                name='location'
                size={16}
                lightColor='black'
                darkColor='white'
              />
              <Text className='py-2 text-lg'>{chooseLocation.poiname}</Text>
            </TouchableOpacity>
          ),
      headerRight: () => (
        <HeaderSearch
          onChangeText={setSearch}
          onChangeFocus={setIsSearchFocused}
        />
      ),
    });
  }, [navigation, search, isSearchFocused, chooseLocation]);

  useEffect(() => {
    const getLandlordById = async () => {
      if (marketHouseList?.length) {
        const landlordIds: number[] = marketHouseList?.map(
          (item) => item.landlordId
        );
        const landlordList = await getLandlordListApi(
          [...new Set(landlordIds)].join(',')
        );
        setLandlordList((l) => [...l, ...landlordList]);
      }
    };

    const getHouseCollectNum = async () => {
      const { houseCollectList, setHouseCollectList } = houseStore;
      if (marketHouseList instanceof Array && marketHouseList[0]?.houseId) {
        const collectList = await getCollectHouseNumApi(
          marketHouseList.map((house) => house?.houseId).join(',')!
        );
        setHouseCollectList([
          ...(houseCollectList || []),
          ...(collectList || []),
        ]);
      }
    };
    getHouseCollectNum();
    getLandlordById();
  }, [marketHouseList]);

  const getLandlordInfo = (landlordId?: number) => {
    return landlordList?.find((item) => item.id === landlordId);
  };

  /**
   * get the first picture of the house
   */
  const getHouseFirstImg = (imgList: string = '') => {
    return JSON.parse(imgList)[0];
  };

  /**
   * view the current house details.
   */
  const toHouseInfo = (houses: IHouse) => {
    setCurrentHouse(houses);
    setCurrentLandlord(getLandlordInfo(houses.landlordId));
    router.push('/market-look-house');
  };

  const getHouseByKeyword = async (keyword: string) => {
    // const { minLat, minLng, maxLat, maxLng } = locationStore;
    // const res: any = await HouseBusiness.getHouseByKeyword({
    //   minLat,
    //   minLng,
    //   maxLat,
    //   maxLng,
    //   keyword,
    // });
    // setMarketHouseList(res);
  };

  const searchHouse = () => {
    let timer: any;
    return (keyWord: string) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        getHouseByKeyword(keyWord);
      }, 500);
    };
  };

  return (
    <ScrollView
      contentContainerClassName='flex-grow'
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {marketHouseList?.length ? (
        <View className='flex-row flex-wrap gap-0 pt-6'>
          {marketHouseList?.map((house: IHouse, idx: number) => {
            return (
              <TouchableOpacity key={idx} onPress={() => toHouseInfo(house)}>
                <View
                  style={{
                    width: halfScreenWidth - 18,
                    padding: 12,
                    marginLeft: 12,
                    marginRight: idx % 2 !== 0 ? 12 : 0,
                  }}
                  className='bg-background-0 mb-6 rounded-xl'
                  needShadow
                >
                  <Image
                    src={getHouseFirstImg(house.houseImg)}
                    style={{
                      width: '100%',
                      height: (halfScreenWidth - 42) / ASPECT_RATIO,
                      borderRadius: 4,
                    }}
                  />
                  <View className='mt-2'>
                    <Text className='text-xl font-bold'>{house.name}</Text>
                    <View className='flex-row items-center justify-between mt-1'>
                      <View className='flex-row items-center gap-1'>
                        <Text className='text-lg'>
                          {houseCollectList?.find(
                            (c) => c.houseId === house.houseId
                          )?.count || 0}
                        </Text>
                        <Text>收藏</Text>
                      </View>
                      <View className='flex-row items-center gap-1'>
                        <Text className='font-bold text-error-700'>
                          ￥{house.price}
                        </Text>
                        <Text>/月</Text>
                      </View>
                    </View>
                    <View className='mt-1 flex-row items-center gap-2'>
                      <Image
                        src={getLandlordInfo(house.landlordId)?.headImg}
                        size='none'
                        className='w-6 h-6'
                      />
                      <Text>{getLandlordInfo(house.landlordId)?.name}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <Empty text='该地址附近暂无房屋发布，试试其他地址吧！' />
      )}
    </ScrollView>
  );
};

export default observer(Market);
