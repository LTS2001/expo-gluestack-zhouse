import { IExistLease, IHouseLease, IPendingLease } from "@/global";
import { configure, makeAutoObservable } from "mobx";

configure({
  enforceActions: "always",
});

class LeaseStore {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  /**
   * list of houses rented by tenants
   */
  leaseHouseList: IHouseLease[] | undefined;

  /**
   * current rentail house
   */
  currentLeaseHouse: IHouseLease | undefined;

  /**
   * pending lease application
   */
  pendingLeaseList: IPendingLease[] | undefined;

  /**
   * tenants who are currently being rented
   */
  currentRentBillTenant: IExistLease | undefined = {
    houseAddress: "广东省深圳市南山区桃园路",
    houseId: 5,
    houseName: "豪门单身公寓",
    landlordId: 12,
    leaseDate: "2024-12-21T15:05:33.000Z",
    leaseMonths: 13,
    tenantHeadImg: "/upload_1734682148167.0.1396289794714498.0.jpg",
    tenantId: 4,
    tenantName: "帅气租客yo",
    tenantPhone: "18453793540",
  };

  /**
   * set up the house rented by the tenant
   * @param leaseHouseList
   */
  setLeaseHouse(leaseHouseList: IHouseLease[]) {
    this.leaseHouseList = leaseHouseList;
  }

  /**
   * clear the house rented by the tenant
   */
  clearLeaseHouse() {
    this.leaseHouseList = undefined;
  }

  /**
   * set the current rental house
   * @param leaseHouse
   */
  setCurrentLeaseHouse(leaseHouse: IHouseLease) {
    this.currentLeaseHouse = leaseHouse;
  }

  /**
   * set up pending lease application
   */
  setPendingLeaseList(pendingLeaseList: IPendingLease[]) {
    this.pendingLeaseList = pendingLeaseList;
  }

  /**
   * clear pending lease application
   */
  clearPendingLeaseList() {
    this.pendingLeaseList = undefined;
  }

  /**
   * set the tenant who is currently being rented
   */
  setCurrentRentBillTenant(leaseTenant: IExistLease) {
    this.currentRentBillTenant = leaseTenant;
  }
}

const leaseStore = new LeaseStore();
export default leaseStore;
