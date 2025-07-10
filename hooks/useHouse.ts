import { IHouse } from '@/global';
import { getHouses } from '@/request/api/house';
import authStore from '@/stores/auth';
import houseStore from '@/stores/house';
import userStore from '@/stores/user';

export default function useHouse() {
  const { user } = userStore;
  const { isLogin } = authStore;
  const { setLandlordHouseList, setHouseNumberTotal, setMarketHouseList } =
    houseStore;
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
  const getMarketHouseList = async (
    minLat: number,
    maxLat: number,
    minLng: number,
    maxLng: number
  ) => {
    // const res: any = await getHousesByPage(
    //   minLat,
    //   maxLat,
    //   minLng,
    //   maxLng
    // );
    // setMarketHouseList(res);
  };

  return {
    getLandlordHouseList,
    getMarketHouseList,
  };
}
