import { IExistLease, IUser } from '@/global';
import { configure, makeAutoObservable } from 'mobx';

configure({
  enforceActions: 'always',
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
}

const userStore = new UserStore();
export default userStore;
