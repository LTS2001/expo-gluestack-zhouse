import { ILease, IPendingLease, IUser } from '@/global';
import { axios } from '../axios';

/**
 * get the tenant of the leased house
 * @param houseId house id
 * @returns tenant info or null
 */
export const getTenantLeaseHouseApi = (
  houseId: number
): Promise<IUser | null> => axios.get(`/lease/tenant?houseId=${houseId}`);

/**
 * get the lease information of the tenant in this house
 * @param houseId house id
 * @param tenantId tenant id
 * @returns lease info or null
 */
export const getLeaseHouseTenantApi = (
  houseId: number,
  tenantId: number
): Promise<ILease | null> =>
  axios.get(`/lease?houseId=${houseId}&tenantId=${tenantId}`);

/**
 * add lease
 * @param data lease data
 * @returns lease info
 */
export const postLeaseApi = (data: {
  houseId: number;
  tenantId: number;
  landlordId: number;
  leaseMonths: number;
}): Promise<ILease> => axios.post(`/lease`, data);

/**
 * get the lease application that needs to be processed by the landlord
 * @returns lease application list
 */
export const getLeasePendingListApi = (): Promise<IPendingLease[]> =>
  axios.get(`/lease/pending`);
