import { getRepairListTenantApi } from '@/request';
import { repairStore } from '@/stores';

/**
 * get tenant repair list
 * @param tenantId tenant id
 */
export const getRepairListTenant = async (tenantId?: number) => {
  if (!tenantId) return;
  const res = await getRepairListTenantApi(tenantId);
  repairStore.setTenantReportForRepairList(res);
};
