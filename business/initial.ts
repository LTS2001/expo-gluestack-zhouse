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
    /**
     * the following situations will trigger the `get lease pending list` api
     * 1. get lease pending list when you first enter the app (if you are landlord and login)
     * 2. get lease pending list when you login (if you are landlord)
     * 3. get lease pending list when you change the landlord identity
     */
    getLeasePendingListByLandlord(),
    getTenantLeasedListLandlord(),
    getRepairListLandlord(landlordId),
  ]);
};
