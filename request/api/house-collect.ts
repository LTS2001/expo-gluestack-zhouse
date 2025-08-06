import { ICollect, ICollectList } from '@/global';
import { axios } from '..';

/**
 * get collect house num
 * @param houseIds house id list
 */
export const getCollectHouseNum = (houseIds: string): Promise<ICollectList[]> =>
  axios.get(`/collect/num?houseIdList=${houseIds}`);

/**
 * get collect status
 * @param houseId house id
 * @param tenantId tenant id
 */
export const getCollectStatus = (
  houseId: number,
  tenantId: number
): Promise<ICollect> =>
  axios.get(`/collect?houseId=${houseId}&tenantId=${tenantId}`);

/**
 * change collect status
 * @param data
 */
export const changeCollectStatus = (data: {
  houseId: number;
  tenantId: number;
  status: number;
  landlordId: number;
}): Promise<ICollect> => axios.put(`/collect`, data);
