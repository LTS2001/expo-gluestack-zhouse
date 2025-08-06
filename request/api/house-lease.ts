import { IHouseLease, ILease, IPendingLease, IUser } from '@/global';
import { axios } from '..';

/**
 * get lease by house id
 * @param houseId house id
 * @returns lease info
 */
export const getLeaseByHouseId = (houseId: number): Promise<IUser> =>
  axios.get(`/lease/houseId?houseId=${houseId}`);

/**
 * get lease status
 * @param houseId house id
 * @param tenantId tenant id
 */
export const getLeaseStatus = (
  houseId: number,
  tenantId: number
): Promise<ILease> =>
  axios.get(`/lease?houseId=${houseId}&tenantId=${tenantId}`);

/**
 * add lease
 * @param data lease data
 */
export const addLease = (data: {
  houseId: number;
  tenantId: number;
  landlordId: number;
  leaseMonths: number;
}): Promise<IHouseLease> => axios.post(`/lease`, data);

/**
 * get the lease request that needs to be processed by the landlord
 */
export const getLeasePendingByLandlordId = (): Promise<IPendingLease[]> =>
  axios.get(`/lease/pending`);
