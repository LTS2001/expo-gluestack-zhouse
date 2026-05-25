import { Empty } from '@/components';
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  Button,
  ButtonText,
  Icon,
  Input,
  InputField,
  showToast,
  Spinner,
  Text,
  TouchableOpacity,
  View,
} from '@/components/ui';
import emitter, { EEventNameEnum } from '@/emitter';
import { AmapView, searchPoi } from '@/native-modules';
import { router } from 'expo-router';
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  findNodeHandle,
  FlatList,
  NativeModules,
  StyleProp,
  UIManager,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { AMapSearchModule } = NativeModules;

/**
 * poi of search keyword
 */
interface ISearchTipPoi {
  name: string;
  district: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface ISearchMapPoi {
  adName: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  province: string;
  title: string;
}

export interface ICenter {
  latitude: number;
  longitude: number;
}

interface IPropsMoveToLocation extends ICenter {
  zoom: number;
  triggerMapSearch: boolean;
}

const TouchableIconWrap = (props: {
  icon: React.ReactNode;
  onPress?: () => void;
  className?: string;
  style?: StyleProp<ViewStyle>;
}) => {
  const { icon, onPress, className, style } = props;
  return (
    <View
      className={`absolute z-50 bg-white w-10 h-10 rounded-full justify-center ${className}`}
      style={style}
      needShadow
    >
      <TouchableOpacity onPress={onPress}>{icon}</TouchableOpacity>
    </View>
  );
};

const MapFloatLayer = ({
  poi,
  isSelectedPoi,
  onSearchTipActionsheetOpen,
  onMoveToLocation,
}: {
  poi?: ISearchMapPoi;
  isSelectedPoi: boolean;
  onSearchTipActionsheetOpen: () => void;
  onMoveToLocation: (center: Partial<IPropsMoveToLocation>) => void;
}) => {
  const insets = useSafeAreaInsets();

  const handleSiteConfirm = useCallback(() => {
    if (!isSelectedPoi || !poi) {
      showToast({
        title: '请选择下方地址选项',
      });
      return;
    }
    const { city, latitude, longitude, address, adName, province, title } = poi;
    emitter.emit(EEventNameEnum.GetLocation, {
      cityname: city,
      latlng: { lat: latitude, lng: longitude },
      poiaddress: `${province}${city}${adName}${address}`,
      poiname: title,
    });
    router.back();
  }, [isSelectedPoi, poi]);

  return (
    <>
      <TouchableIconWrap
        icon={
          <Icon as='FontAwesome6' name='arrow-left' color='black' size={18} />
        }
        className='left-4'
        style={{ top: insets.top }}
        onPress={() => router.back()}
      />
      <TouchableIconWrap
        icon={
          <Icon
            as='Entypo'
            name='check'
            color={isSelectedPoi ? '#fff' : '#a0a0a0'}
            size={22}
          />
        }
        className={`right-4 ${isSelectedPoi ? 'bg-success-400' : ''}`}
        style={{ top: insets.top }}
        onPress={handleSiteConfirm}
      />
      <TouchableIconWrap
        icon={
          <Icon
            as='FontAwesome6'
            name='magnifying-glass'
            color='black'
            size={18}
          />
        }
        className='right-4 bottom-20'
        onPress={onSearchTipActionsheetOpen}
      />
      <TouchableIconWrap
        icon={
          <Icon
            as='FontAwesome5'
            name='location-arrow'
            color='black'
            size={18}
            className='-ml-0.5 -mb-0.5'
          />
        }
        className='right-4 bottom-4'
        onPress={() => onMoveToLocation({ zoom: 14 })}
      />
      <Icon
        as='Ionicons'
        name='location'
        className='absolute left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-full'
        color='#d10a0a'
        size={30}
      />
    </>
  );
};

const SearchTipActionsheet = ({
  open,
  setOpen,
  onConfirm,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onConfirm: (poi: ISearchTipPoi) => void;
}) => {
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = undefined;
      }
    };
  }, []);

  const [searchPoiList, setSearchPoiList] = useState<ISearchTipPoi[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<string>();

  const handleClose = useCallback(() => {
    setOpen(false);
    setSearchPoiList([]);
    setSelectedIndex('');
  }, [setOpen]);

  const handleChangeText = useCallback((text: string) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      const tips: ISearchTipPoi[] = await AMapSearchModule.searchTips(text);
      setSearchPoiList(tips.filter((t) => t.latitude && t.longitude));
      setSelectedIndex(undefined);
    }, 500);
  }, []);

  const handleConfirm = useCallback(() => {
    if (selectedIndex === '') return;
    const idx = Number(selectedIndex);
    handleClose();
    onConfirm(searchPoiList[idx]);
  }, [handleClose, onConfirm, selectedIndex, searchPoiList]);

  return (
    <Actionsheet
      isOpen={open}
      onClose={handleClose}
      style={{ height: 800 }}
      snapPoints={[80]}
    >
      <ActionsheetBackdrop />
      <ActionsheetContent className='h-screen'>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        <View className='mb-1 w-full mt-4'>
          <View className='w-full flex-row items-center gap-5'>
            <Input variant='underlined' className='flex-1'>
              <Icon as='FontAwesome6' name='magnifying-glass' size={20} />
              <InputField
                placeholder='搜索地点'
                className='text-lg ml-4'
                onChangeText={handleChangeText}
                autoFocus={true}
              />
            </Input>
            <Button
              size='xs'
              action={selectedIndex ? 'primary' : 'secondary'}
              onPress={handleConfirm}
            >
              <ButtonText
                className={selectedIndex ? 'text-white' : 'text-gray-500'}
              >
                确定
              </ButtonText>
            </Button>
          </View>
          <Text className='text-gray-400 text-xs mt-1'>请选择下列选项</Text>
        </View>

        <FlatList
          showsVerticalScrollIndicator={false}
          className='w-full'
          contentContainerClassName='flex-grow'
          keyExtractor={(_, i) => i + ''}
          data={searchPoiList}
          ListEmptyComponent={<Empty text='请输入地点关键字进行搜索🔍' />}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              className='justify-between border-b-[1px] border-gray-200 py-3 flex-row'
              onPress={() => setSelectedIndex(index + '')}
            >
              <View className='w-[80%]'>
                <Text className='font-medium'>{item.name}</Text>
                <Text className='text-sm text-gray-500'>{`${item.district}${item.address}`}</Text>
              </View>
              {Number(selectedIndex) === index && (
                <Icon as='Entypo' name='check' size={20} color='black' />
              )}
            </TouchableOpacity>
          )}
        />
      </ActionsheetContent>
    </Actionsheet>
  );
};

export default function Amap() {
  const flatListRef = useRef<FlatList<ISearchMapPoi>>(null);
  const mapRef = useRef(null);
  const maxSearchMapPageRef = useRef(5);
  const currentSearchMapPageRef = useRef(maxSearchMapPageRef.current);
  const isSearchMapReturnSuccessRef = useRef(true);
  const [searchTipActionsheetOpen, setSearchTipActionsheetOpen] =
    useState(false);
  const [mapPoiSearchLoading, setMapPoiSearchLoading] = useState(false);
  const [mapPoiList, setMapPoiList] = useState<ISearchMapPoi[]>([]);
  const [mapCenter, setMapCenter] = useState<ICenter>();
  const [mapPoiSelectedIdx, setMapPoiSelectedIdx] = useState<number>();

  const handleMoveToLocation = useCallback(
    (center: Partial<IPropsMoveToLocation> = {}) => {
      const {
        latitude = null,
        longitude = null,
        zoom = null,
        triggerMapSearch = null,
      } = center;
      const node = findNodeHandle(mapRef.current);
      if (!node) return;

      UIManager.dispatchViewManagerCommand(node, 'moveToLocation', [
        { latitude, longitude, zoom, triggerMapSearch },
      ]);
    },
    [],
  );

  const handlePoiListEndReached = useCallback(async () => {
    if (
      !isSearchMapReturnSuccessRef.current ||
      currentSearchMapPageRef.current >= maxSearchMapPageRef.current
    )
      return;
    isSearchMapReturnSuccessRef.current = false;
    const latitude = mapCenter?.latitude || mapPoiList[0].latitude;
    const longitude = mapCenter?.longitude || mapPoiList[0].longitude;
    const result = await searchPoi(
      latitude,
      longitude,
      currentSearchMapPageRef.current++,
    );
    setMapPoiList((prev) => [...prev, ...result]);
    isSearchMapReturnSuccessRef.current = true;
  }, [mapPoiList, mapCenter]);

  const handleSearchTipActionsheetConfirm = useCallback(
    (poi: ISearchTipPoi) => {
      const { latitude, longitude } = poi || {};
      handleMoveToLocation({
        latitude,
        longitude,
        zoom: 16,
        triggerMapSearch: true,
      });
    },
    [handleMoveToLocation],
  );

  const handlePoiSelected = useCallback(
    (idx: number) => {
      setMapPoiSelectedIdx(idx);
      const { latitude, longitude } = mapPoiList[idx];
      handleMoveToLocation({ latitude, longitude });
    },
    [handleMoveToLocation, mapPoiList],
  );

  useEffect(() => {
    if (mapCenter) currentSearchMapPageRef.current = 1;
  }, [mapCenter]);

  return (
    <>
      <View className='flex-1 relative'>
        <MapFloatLayer
          poi={
            mapPoiSelectedIdx !== undefined
              ? mapPoiList[mapPoiSelectedIdx]
              : undefined
          }
          isSelectedPoi={mapPoiSelectedIdx !== undefined}
          onMoveToLocation={handleMoveToLocation}
          onSearchTipActionsheetOpen={() => setSearchTipActionsheetOpen(true)}
        />

        <AmapView
          style={{ flex: 1 }}
          ref={mapRef}
          onPoiSearchStart={() => {
            setMapPoiSearchLoading(true);
          }}
          onPoiSearch={({ nativeEvent: { pois, center } }) => {
            flatListRef.current?.scrollToOffset({
              offset: 0,
              animated: true,
            });
            setMapPoiSearchLoading(false);
            setMapCenter(center);
            setMapPoiList(pois);
            setMapPoiSelectedIdx(undefined);
          }}
        />
      </View>

      <View className='flex-1 bg-white relative'>
        {mapPoiSearchLoading && (
          <View className='absolute flex-1 bg-[rgba(255,255,255,0.7)] w-full h-full z-50 justify-center'>
            <Spinner size={36} color='#888' />
          </View>
        )}

        <View className='items-center'>
          <ActionsheetDragIndicator />
        </View>

        <FlatList
          contentContainerClassName='flex-grow'
          showsVerticalScrollIndicator={false}
          data={mapPoiList}
          ref={flatListRef}
          keyExtractor={(_, index) => index + ''}
          onEndReached={handlePoiListEndReached}
          ListEmptyComponent={<Empty text='该定位暂无数据，请更换其他位置' />}
          ListFooterComponent={
            currentSearchMapPageRef.current < maxSearchMapPageRef.current ? (
              <View className='py-5'>
                <Spinner />
              </View>
            ) : (
              <View className='py-3' />
            )
          }
          renderItem={({ item, index }) => (
            <TouchableOpacity
              className='justify-between border-b-[1px] border-gray-200 p-3 flex-row'
              onPress={() => handlePoiSelected(index)}
            >
              <View className='w-[88%]'>
                <Text className='font-medium'>{item.title}</Text>
                <Text className='text-sm text-gray-500'>{`${item.province}${item.city}${item.adName}${item.address}`}</Text>
              </View>
              {Number(mapPoiSelectedIdx) === index && (
                <Icon as='Entypo' name='check' size={20} color='black' />
              )}
            </TouchableOpacity>
          )}
        />
      </View>

      <SearchTipActionsheet
        open={searchTipActionsheetOpen}
        setOpen={setSearchTipActionsheetOpen}
        onConfirm={handleSearchTipActionsheetConfirm}
      />
    </>
  );
}
