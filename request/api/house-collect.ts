import { axios } from '..';

/**
 * get collect house num
 * @param houseIds house id list
 */
export const getCollectHouseNum = (houseIds: string) =>
  axios.get(`/collect/num?houseIdList=${houseIds}`);

/**
 * get collect status
 * @param houseId house id
 * @param tenantId tenant id
 */
export const getCollectStatus = (houseId: number, tenantId: number) =>
  axios.get(`/collect?houseId=${houseId}&tenantId=${tenantId}`);
