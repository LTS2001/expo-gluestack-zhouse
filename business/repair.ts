import { HouseToRepairMap } from '@/constants';
import { getRepairListLandlordApi, getRepairListTenantApi } from '@/request';
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

export const getRepairListLandlord = async (landlordId?: number) => {
  if (!landlordId) return;
  const res = await getRepairListLandlordApi(landlordId);
  repairStore.setLandlordRepairList(res);
};

/**
 * get house repair status
 * 1. pending repair return false
 * 2. complete repair return true
 */
export const getRepairStatus = (houseId?: number) => {
  const reportHouseList = repairStore.tenantReportForRepairList?.filter(
    (t) => t.houseId === houseId && t.status === HouseToRepairMap.REPAIR_PENDING
  );
  if (reportHouseList?.length !== 0) {
    return false;
  } else {
    return true;
  }
};
