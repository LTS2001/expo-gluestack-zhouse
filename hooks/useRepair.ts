import repairStore from '@/stores/repair';
import { useMemo } from 'react';

export default function useRepair() {
  const {
    landlordRepairList,
    setTenantReportForRepairList,
    setLandlordRepairList,
  } = repairStore;

  /**
   * get list of all repair applications of tenants
   * @param tenantId
   */
  const getTenantReportForRepairList = async (tenantId?: number) => {
    if (!tenantId) return;
    const res: any = await getTenantReportForRepairById(tenantId);
    setTenantReportForRepairList(res);
  };

  /**
   * get landlord's house repair (tenant's application for repair)
   * @param landlordId
   */
  const getLandlordRepairList = async (landlordId?: number) => {
    if (!landlordId) return;
    const res: any = await getLandlordRepairById(landlordId);
    setLandlordRepairList(res);
  };

  /**
   * number of landlord's house repair (tenant's application for repair) that need to be processed
   */
  const landlordReportPendingNoticeNum = useMemo(
    () => landlordRepairList?.filter((l) => l.status === REPAIR_PENDING).length,
    [landlordRepairList]
  );

  return {
    getTenantReportForRepairList,
    getLandlordRepairList,
    landlordReportPendingNoticeNum,
  };
}
