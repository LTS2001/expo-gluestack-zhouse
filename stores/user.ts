import { IExistLease, IUser } from '@/global';
import { configure, makeAutoObservable } from 'mobx';

configure({
  enforceActions: 'never',
});

class UserStore {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  /**
   * user information
   */
  user: IUser | undefined = undefined;

  /**
   * current landlord info
   */
  currentLandlord: IUser | undefined;

  /**
   * tenant information of the landlord's house that has been leased
   */
  leasedTenant: IExistLease[] | undefined;

  /**
   * the number of tenant that has rented the landlord's house
   */
  landlordTenantCount: number = 0;

  /**
   * @param user user info
   */
  setUser(user: IUser) {
    this.user = user;
  }

  /**
   * clear user info
   */
  clearUser() {
    this.user = undefined;
  }

  /**
   * @param landlord landlord info
   */
  setCurrentLandlord(landlord?: IUser) {
    this.currentLandlord = landlord;
  }

  /**
   * set the tenant information that has rented the landlord's house
   * @param leasedTenant tenant list
   */
  setLeasedTenant(leasedTenant: IExistLease[]) {
    this.leasedTenant = leasedTenant;
  }

  /**
   * clear the tenant information that has rented the landlord's house
   */
  clearLeasedTenant() {
    this.leasedTenant = undefined;
  }

  /**
   * set the number of tenant that has rented the landlord's house
   * @param count
   */
  setLandlordTenantCount(count: number) {
    this.landlordTenantCount = count;
  }

  /**
   * clear the number of tenant that has rented the landlord's house
   */
  clearLandlordTenantCount() {
    this.landlordTenantCount = 0;
  }
}

const userStore = new UserStore();
export default userStore;
