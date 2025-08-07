import { IAddRepairReq, IRepair } from '@/global';
import { axios } from '../axios';

/**
 * add repair
 * @param data repair data
 * @returns repair info
 */
export const postRepairApi = (data: IAddRepairReq): Promise<IRepair> =>
  axios.post('/report', data);

/**
 * get tenant's repair list by tenant id
 * @param tenantId tenant id
 * @returns repair list
 */
export const getRepairListTenantApi = (tenantId: number): Promise<IRepair[]> =>
  axios.get(`/report/tenant?tenantId=${tenantId}`);

/**
 * get landlord's repair list by landlord id
 * @param landlordId landlord id
 * @returns repair list
 */
export const getRepairListLandlordApi = (
  landlordId: number
): Promise<IRepair[]> => axios.get(`/report/landlord?landlordId=${landlordId}`);

/**
 * update the status of repair
 * @param repairId repair id
 * @param status status
 * @returns repair info
 */
export const putRepairStatusApi = (
  repairId: number,
  status: number
): Promise<IRepair> =>
  axios.put('/report', {
    repairId,
    status,
  });
