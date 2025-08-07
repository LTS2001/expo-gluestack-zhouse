import { IAddHouseReq, IHouse, IUpdateHouseReq } from '@/global';
import { axios } from '../axios';

/**
 * add house
 * @param data house info
 * @returns house info
 */
export const postHouseApi = (data: IAddHouseReq): Promise<IHouse> =>
  axios.post('/house', data);

/**
 * get house list (landlord's house list)
 * @returns house list
 */
export const getHouseListLandlordApi = (): Promise<IHouse[]> =>
  axios.get('/house');

/**
 * update house info
 * @param data house info
 * @returns house info
 */
export const putHouseApi = (data: IUpdateHouseReq): Promise<IHouse> =>
  axios.put('/house', data);

/**
 * get house list by page
 * @param params latitude and longitude range
 * @returns house list
 */
export const getHouseListPageApi = (params: {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}): Promise<IHouse[]> => axios.get(`/house/page`, { params });
