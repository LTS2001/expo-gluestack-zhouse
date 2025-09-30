import { HouseToRepairMap } from '@/constants';
import { IRepair } from '@/global';
import { configure, makeAutoObservable } from 'mobx';

configure({
  enforceActions: 'never',
});

class RepairStore {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  /**
   * list of all repair applications of tenants
   */
  tenantReportForRepairList: IRepair[] | undefined = undefined;

  /**
   * landlord's house repair (tenant's application for repair)
   */
  landlordRepairList: IRepair[] | undefined = undefined;

  /**
   * landlord pending repair application
   */
  landlordPendingRepairList: IRepair[] | undefined = undefined;

  /**
   * set list of all repair applications of tenants
   * @param tenantReportList
   */
  setTenantReportForRepairList(tenantReportForRepairList: IRepair[]) {
    this.tenantReportForRepairList = tenantReportForRepairList;
  }

  /**
   * clear list of all repair applications of tenants
   */
  clearTenantReportForRepairList() {
    this.tenantReportForRepairList = undefined;
  }

  /**
   * set landlord's house repair (tenant's application for repair)
   */
  setLandlordRepairList(landlordRepairList: IRepair[]) {
    this.landlordRepairList = landlordRepairList;
    this.landlordPendingRepairList = landlordRepairList?.filter(
      (t) => t.status === HouseToRepairMap.REPAIR_PENDING
    );
  }

  /**
   * clear landlord's house repair (tenant's application for repair)
   */
  clearLandlordRepairList() {
    this.landlordRepairList = undefined;
    this.landlordPendingRepairList = undefined;
  }
}

const repairStore = new RepairStore();

export default repairStore;
