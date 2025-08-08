import { ICollectList, IHouse } from '@/global';
import { configure, makeAutoObservable } from 'mobx';

configure({
  enforceActions: 'never',
});

class HouseStore {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  /**
   * information about the current house
   */
  currentHouse: IHouse | undefined = undefined;

  /**
   * total number of houses
   */
  houseNumberTotal: number = 0;

  /**
   * all the houses of the current landlord
   */
  landlordHouseList: IHouse[] | undefined = undefined;

  /**
   * collection list of houses
   */
  houseCollectList: ICollectList[] | undefined = undefined;

  /**
   * list of houses in the housing market
   */
  marketHouseList: IHouse[] | undefined = undefined;

  /**
   * set list of houses in the housing market
   * @param marketHouseList
   */
  setMarketHouseList(marketHouseList: IHouse[]) {
    this.marketHouseList = marketHouseList;
  }

  /**
   * clear list of houses in the housing market
   */
  clearMarketHouseList() {
    this.marketHouseList = undefined;
  }

  /**
   * set the currently edited house info
   * @param houses
   */
  setCurrentHouse = (house: IHouse) => {
    this.currentHouse = house;
  };

  /**
   * clear the currently edited house info
   */
  clearCurrentHouse = () => {
    this.currentHouse = undefined;
  };

  /**
   * set currently landlord total number of houses
   * @param num total number of houses
   */
  setHouseNumberTotal(num: number) {
    this.houseNumberTotal = num;
  }

  /**
   * set currently landlord houses
   * @param housesList
   */
  setLandlordHouseList(housesList: IHouse[]) {
    this.landlordHouseList = housesList;
    this.houseNumberTotal = housesList?.length;
  }

  /**
   * clear all the house info of the landlord
   */
  clearLandlordHouseList() {
    this.landlordHouseList = undefined;
    this.houseNumberTotal = 0;
  }

  /**
   * set the house collection list
   */
  setHouseCollectList(collectList: ICollectList[]) {
    this.houseCollectList = collectList;
  }

  /**
   * modify the house collection list
   * @param houseId house id
   * @param status status 0(not collected) 1(collected）
   */
  updateHouseCollectList(houseId: number, status: number) {
    const collect = this.houseCollectList?.find((c) => c.houseId === houseId);
    if (status === 0 && collect?.count != null) {
      collect.count--;
    } else if (status === 1 && collect?.count != null) {
      collect.count++;
    }
  }
}

const houseStore = new HouseStore();

export default houseStore;
