import { getLandlordHouseList } from './house';
import { getLeasePendingListByLandlord } from './lease';
import { getRepairListLandlord, getRepairListTenant } from './repair';
import { getTenantLeasedHouseList, getTenantLeasedListLandlord } from './user';

/**
 * tenant initial api
 */
export const tenantInitialApi = async (tenantId?: number) => {
  return await Promise.all([
    getTenantLeasedHouseList(tenantId),
    getRepairListTenant(tenantId),
  ]);
};

/**
 * landlord initial api
 */
export const landlordInitialApi = async (landlordId?: number) => {
  return await Promise.all([
    getLeasePendingListByLandlord(),
    getTenantLeasedListLandlord(),
    getRepairListLandlord(landlordId),
    getLandlordHouseList(),
  ]);
};
