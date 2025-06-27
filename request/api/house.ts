import { IAddHouseReq } from '@/global';
import authStore from '@/stores/auth';
import { axios } from '..';

/**
 * add house
 * @param data house info
 */
export const addHouse = (data: IAddHouseReq) => {
  return axios.post(`${authStore.identity}/house`, data);
};
