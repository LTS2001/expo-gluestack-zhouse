import { configure, makeAutoObservable } from 'mobx';

configure({
  enforceActions: 'never',
});

class LocationStore {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  /**
   * title of location
   */
  title: string = '';
  /**
   * location address
   */
  address: string = '';

  /**
   * location category info
   */
  category: string = '';

  /**
   * loation latitude
   */
  latitude: number = 39.9042;

  /**
   * location longitude
   */
  longitude: number = 116.4074;

  /**
   * min latitude
   */
  minLat: number = 0;

  /**
   * max latitude
   */
  maxLat: number = 0;

  /**
   * min longitude
   */
  minLng: number = 0;

  /**
   * max longitude
   */
  maxLng: number = 0;

  setMinLat(minLat: number) {
    this.minLat = minLat;
  }

  setMaxLat(maxLat: number) {
    this.maxLat = maxLat;
  }

  setMinLng(minLng: number) {
    this.minLng = minLng;
  }

  setMaxLng(maxLng: number) {
    this.maxLng = maxLng;
  }

  /**
   * set title of location
   * @param title location title
   */
  setTitle(title: string) {
    this.title = title;
  }

  /**
   * set address of location
   * @param address location address
   */
  setAddress(address: string) {
    this.address = address;
  }

  /**
   * set category of location
   * @param category location category
   */
  setCategory(category: string) {
    this.category = category;
  }

  /**
   * set latitude
   * @param latitude latitude
   */
  setLatitude(latitude: number) {
    this.latitude = latitude;
  }

  /**
   * set longitude
   * @param longitude longitude
   */
  setLongitude(longitude: number) {
    this.longitude = longitude;
  }

  /**
   * clear title of location
   */
  clearTitle() {
    this.title = '';
  }

  /**
   * clear address of location
   */
  clearAddress() {
    this.address = '';
  }
}

const locationStore = new LocationStore();

export default locationStore;
