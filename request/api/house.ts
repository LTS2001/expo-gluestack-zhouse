import { IAddHouseReq } from '@/global';
import { axios } from '..';

/**
 * add house
 * @param data house info
 */
export const addHouse = (data: IAddHouseReq) => {
  return axios.post('/house', data);
};
