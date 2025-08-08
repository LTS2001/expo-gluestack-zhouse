import { IExistLease, IHouseLease, IPendingLease } from '@/global';
import { configure, makeAutoObservable } from 'mobx';

configure({
  enforceActions: 'never',
});

class LeaseStore {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  /**
   * list of houses rented by tenants
   */
  leaseHouseList: IHouseLease[] | undefined = undefined;

  /**
   * current rentail house
   */
  currentLeaseHouse: IHouseLease | undefined = undefined;

  /**
   * landlord pending lease application
   */
  landlordPendingLeaseList: IPendingLease[] | undefined = undefined;

  /**
   * tenants who are currently being rented
   */
  currentRentBillTenant: IExistLease | undefined = {
    houseAddress: '广东省深圳市南山区桃园路',
    houseId: 5,
    houseName: '豪门单身公寓',
    landlordId: 12,
    leaseDate: '2024-12-21T15:05:33.000Z',
    leaseMonths: 13,
    tenantHeadImg: '/upload_1734682148167.0.1396289794714498.0.jpg',
    tenantId: 4,
    tenantName: '帅气租客yo',
    tenantPhone: '18453793540',
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
  setLandlordPendingLeaseList(landlordPendingLeaseList: IPendingLease[]) {
    this.landlordPendingLeaseList = landlordPendingLeaseList;
  }

  /**
   * clear pending lease application
   */
  clearLandlordPendingLeaseList() {
    this.landlordPendingLeaseList = undefined;
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
