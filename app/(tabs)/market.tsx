import Empty from '@/components/empty';
import HeaderSearch from '@/components/header-search';
import { Icon } from '@/components/ui/icon';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { ASPECT_RATIO } from '@/constants/image';
import emitter from '@/emitter';
import { GET_LOCATION } from '@/emitter/event-name';
import { IHouse, ITencentMapLocation, IUser } from '@/global';
import useHouse from '@/hooks/useHouse';
import { getCollectHouseNum } from '@/request/api/house-collect';
import { getLandlordByIds } from '@/request/api/user';
import houseStore from '@/stores/house';
import userStore from '@/stores/user';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Dimensions, RefreshControl, ScrollView } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const halfScreenWidth = screenWidth / 2;

/**
 * 后续优化：
 * 1、获取房屋的时候一次性将房东信息和收藏信息获取出来
 * 2、优化下拉刷新逻辑
 * 3、优化搜索逻辑
 */
const Market = () => {
  const {
    marketHouseList,
    setMarketHouseList,
    setHouseCollectList,
    houseCollectList,
    setCurrentHouse,
  } = houseStore;
  const { setCurrentLandlord } = userStore;
  // landlord list
  const [landlordList, setLandlordList] = useState<IUser[]>([]);
  const { getMarketHouseList } = useHouse();
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
    setRefreshing(true);
    // 这里写你的刷新逻辑
    // await fetchMarketHouseList();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  useEffect(() => {
    emitter.on(GET_LOCATION, (data) => {
      data && setChooseLocation(data);
    });
    return () => {
      emitter.off(GET_LOCATION);
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
            <View
              className='flex-row items-center gap-2 py-3 ml-4 absolute left-0'
              onTouchEnd={() =>
                router.push({
                  pathname: '/choose-location',
                  params: {
                    eventName: GET_LOCATION,
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
            </View>
          ),
      headerRight: () => (
        <HeaderSearch
          onChangeText={setSearch}
          onChangeFocus={setIsSearchFocused}
        />
      ),
    });
  }, [navigation, search, isSearchFocused, chooseLocation]);

  /**
   * 获取房东信息通过房东id
   */
  const getLandlordById = async () => {
    if (marketHouseList?.length) {
      const landlordIds: number[] = marketHouseList?.map(
        (item) => item.landlordId
      );
      // 获取房东信息
      const landlordList = await getLandlordByIds(
        [...new Set(landlordIds)].join(',')
      );
      setLandlordList((l) => [...l, ...landlordList]);
    }
  };

  /**
   * 获取房屋收藏信息
   */
  const getHouseCollectNum = async () => {
    if (marketHouseList instanceof Array && marketHouseList[0]?.houseId) {
      const collectList = await getCollectHouseNum(
        marketHouseList.map((house) => house?.houseId).join(',')!
      );
      setHouseCollectList([
        ...(houseCollectList || []),
        ...(collectList || []),
      ]);
    }
  };
  useEffect(() => {
    getHouseCollectNum();
    getLandlordById();
  }, [marketHouseList]);

  /**
   * 获取房东信息
   * @param landlordId 房东id
   */
  const getLandlordInfo = (landlordId?: number) => {
    return landlordList?.find((item) => item.id === landlordId);
  };

  /**
   * 获取房屋第一张图片
   * @param imgList
   */
  const getHouseFirstImg = (imgList: string = '') => {
    return JSON.parse(imgList)[0];
  };

  /**
   * 查看当前房屋详情信息
   * @param houses 当前房屋信息
   */
  const toHouseInfo = (houses: IHouse) => {
    setCurrentHouse(houses);
    setCurrentLandlord(getLandlordInfo(houses.landlordId));
    router.push('/market-look-house');
  };

  /**
   * 获取房屋通过关键字
   * @param keyword
   */
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

  /**
   * 搜索房屋
   * @param keyWord
   */
  const searchHouse = () => {
    let timer: any;
    return (keyWord: string) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        // 发送请求获取房屋
        getHouseByKeyword(keyWord);
      }, 500);
    };
  };

  return marketHouseList?.length ? (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className='flex-row flex-wrap gap-0 pt-6'>
        {marketHouseList?.map((house: IHouse, idx: number) => {
          return (
            <View
              style={{
                width: halfScreenWidth - 18,
                padding: 12,
                marginLeft: 12,
                marginRight: idx % 2 !== 0 ? 12 : 0,
              }}
              className='bg-background-0 mb-6 rounded-xl'
              key={idx}
              onTouchEnd={() => toHouseInfo(house)}
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
                    size='2xs'
                    className='rounded-full'
                  />
                  <Text>{getLandlordInfo(house.landlordId)?.name}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  ) : (
    <Empty text='该地址附近暂无房屋发布，试试其他地址吧！' />
  );
};

export default observer(Market);
