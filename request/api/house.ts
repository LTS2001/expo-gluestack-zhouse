import { IAddHouseReq, IHouse, IUpdateHouseReq } from '@/global';
import { axios } from '..';

/**
 * add house
 * @param data house info
 */
export const addHouse = (data: IAddHouseReq) => axios.post('/house', data);

/**
 * get houses
 */
export const getHouses = (): Promise<IHouse[]> => axios.get('/house');

/**
 * update house
 * @param data house info
 */
export const updateHouse = (data: IUpdateHouseReq) => axios.put('/house', data);

/**
 * get houses by page
 * @param minLat
 * @param maxLat
 * @param minLng
 * @param maxLng
 */
export const getHousesByPage = (params: {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}) => axios.get(`/house/page`, { params });
