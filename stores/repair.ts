import { IRepair } from '@/global';
import { configure, makeAutoObservable } from 'mobx';

configure({
  enforceActions: 'always',
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
  }

  /**
   * clear landlord's house repair (tenant's application for repair)
   */
  clearLandlordRepairList() {
    this.landlordRepairList = undefined;
  }
}

const repairStore = new RepairStore();

export default repairStore;
