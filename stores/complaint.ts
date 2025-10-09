import { IComplaint } from '@/global';
import { configure, makeAutoObservable } from 'mobx';

configure({
  enforceActions: 'never',
});
class ComplaintStore {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  /**
   * list of all complaints of user (tenant or landlord)
   */
  complaintList: IComplaint[] | undefined = undefined;

  /**
   * set list of all complaints
   * @param complaintList
   */
  setComplaintList(complaintList: IComplaint[]) {
    this.complaintList = complaintList;
  }

  /**
   * clear list of all complaints
   */
  clearComplaintList() {
    this.complaintList = undefined;
  }
}

const complaintStore = new ComplaintStore();

export default complaintStore;
