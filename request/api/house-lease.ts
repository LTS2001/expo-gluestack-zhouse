import { IUser } from '@/global';
import { axios } from '..';

/**
 * get lease by house id
 * @param houseId house id
 * @returns lease info
 */
export const getLeaseByHouseId = (houseId: number): Promise<IUser> =>
  axios.get(`/lease/houseId?houseId=${houseId}`);
