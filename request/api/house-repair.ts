import { IAddRepairReq } from '@/global';
import { axios } from '..';

/**
 * add report for repair
 * @param data
 */
export const addReportForRepair = (data: IAddRepairReq) =>
  axios.post('/report', data);

/**
 * get tenant's repair by tenant id
 * @param tenantId
 */
export const getTenantReportForRepairById = (tenantId: number) =>
  axios.get(`/report/tenant?tenantId=${tenantId}`);

/**
 * get landlord's repair by landlord id
 * @param tenantId
 */
export const getLandlordRepairById = (landlordId: number) =>
  axios.get(`/report/landlord?landlordId=${landlordId}`);

/**
 * update repair status
 * @param reportId repair id
 * @param status status
 */
export const updateRepairStatus = (repairId: number, status: number) =>
  axios.put('/report', {
    repairId,
    status,
  });
