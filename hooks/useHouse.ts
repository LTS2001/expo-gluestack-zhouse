import { HOUSE_MARK_RANGE } from '@/constants/map';
import { IHouse } from '@/global';
import { getHouses, getHousesByPage } from '@/request/api/house';
import authStore from '@/stores/auth';
import houseStore from '@/stores/house';
import locationStore from '@/stores/location';
import userStore from '@/stores/user';
import { calculateCoordinatesWithinRadius } from '@/utils/common';

export default function useHouse() {
  const { user } = userStore;
  const { isLogin } = authStore;
  const { setLandlordHouseList, setHouseNumberTotal, setMarketHouseList } =
    houseStore;
  const { setMinLat, setMaxLat, setMinLng, setMaxLng } = locationStore;

  /**
   * get landlord house list
   */
  const getLandlordHouseList = async () => {
    if (!isLogin) return;
    // get houses info
    const res: IHouse[] = await getHouses();
    setLandlordHouseList(res);
    setHouseNumberTotal(res?.length || 0);
  };

  /**
   * get market house list
   * @param minLat
   * @param maxLat
   * @param minLng
   * @param maxLng
   */
  const getMarketHouseList = async ({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }) => {
    const { minLat, minLng, maxLng, maxLat } = calculateCoordinatesWithinRadius(
      latitude,
      longitude,
      HOUSE_MARK_RANGE
    );
    setMinLat(minLat);
    setMaxLat(maxLat);
    setMinLng(minLng);
    setMaxLng(maxLng);
    const res: any = await getHousesByPage({
      minLat,
      maxLat,
      minLng,
      maxLng,
    });
    console.log('res', res);
    setMarketHouseList(res);
  };

  return {
    getLandlordHouseList,
    getMarketHouseList,
  };
}
