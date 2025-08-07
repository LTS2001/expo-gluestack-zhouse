import { HOUSE_MARK_RANGE } from '@/constants';
import { getHouseListLandlordApi, getHouseListPageApi } from '@/request';
import { authStore, houseStore, locationStore } from '@/stores';
import { calculateCoordinatesWithinRadius } from '@/utils';

/**
 * get landlord's house list
 */
export const getLandlordHouseList = async () => {
  const { isLogin } = authStore;
  const { setLandlordHouseList, setHouseNumberTotal } = houseStore;
  if (!isLogin) return;
  const res = await getHouseListLandlordApi();
  setLandlordHouseList(res);
  setHouseNumberTotal(res?.length || 0);
};

/**
 * get market house list
 */
export const getMarketHouseList = async ({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) => {
  const { setMarketHouseList } = houseStore;
  const { setMinLat, setMaxLat, setMinLng, setMaxLng } = locationStore;
  const { minLat, minLng, maxLng, maxLat } = calculateCoordinatesWithinRadius(
    latitude,
    longitude,
    HOUSE_MARK_RANGE
  );
  setMinLat(minLat);
  setMaxLat(maxLat);
  setMinLng(minLng);
  setMaxLng(maxLng);
  const res = await getHouseListPageApi({
    minLat,
    maxLat,
    minLng,
    maxLng,
  });
  setMarketHouseList(res);
};
