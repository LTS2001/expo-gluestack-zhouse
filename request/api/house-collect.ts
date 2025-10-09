import { ICollect, ICollectList, IHouseCollect } from '@/global';
import { axios } from '../axios';

/**
 * get the number of collection houses
 * @param houseIds house id list
 * @returns collect number list
 */
export const getCollectHouseNumApi = (
  houseIds: string
): Promise<ICollectList[]> => axios.get(`/collect/num?houseIdList=${houseIds}`);

/**
 * get the collection information of the tenant in this house
 * @param houseId house id
 * @param tenantId tenant id
 * @returns collect info or null
 */
export const getCollectHouseTenantApi = (
  houseId: number,
  tenantId: number
): Promise<ICollect | null> =>
  axios.get(`/collect?houseId=${houseId}&tenantId=${tenantId}`);

/**
 * update the status of collection houses
 * @param data
 */
export const putCollectHouseStatusApi = (data: {
  houseId: number;
  tenantId: number;
  status: number;
  landlordId: number;
}): Promise<ICollect> => axios.put(`/collect`, data);

/**
 * get the collected house list by tenant id
 * @param tenantId tenant id
 * @returns collected house list
 */
export const getCollectedHouseListApi = (
  tenantId: number
): Promise<IHouseCollect[]> =>
  axios.get(`/collect/tenant`, { params: { tenantId } });
