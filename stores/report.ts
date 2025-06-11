import { IReport } from '@/global';
import { configure, makeAutoObservable } from 'mobx';

configure({
  enforceActions: 'always',
});

class ReportStore {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  /**
   * list of all repair applications of tenants
   */
  tenantReportList: IReport[] | undefined;

  /**
   * landlord's house repair (tenant's application for repair)
   */
  landlordReportList: IReport[] | undefined;

  /**
   * set list of all repair applications of tenants
   * @param tenantReportList
   */
  setTenantReportList(tenantReportList: IReport[]) {
    this.tenantReportList = tenantReportList;
  }

  /**
   * clear list of all repair applications of tenants
   */
  clearTenantReportList() {
    this.tenantReportList = undefined;
  }

  /**
   * set landlord's house repair (tenant's application for repair)
   */
  setLandlordReportList(landlordReportList: IReport[]) {
    this.landlordReportList = landlordReportList;
  }

  /**
   * clear landlord's house repair (tenant's application for repair)
   */
  clearLandlordReportList() {
    this.landlordReportList = undefined;
  }
}

const reportStore = new ReportStore();

export default reportStore;
