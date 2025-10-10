import { IComment } from '@/global';
import { configure, makeAutoObservable } from 'mobx';

configure({
  enforceActions: 'never',
});
class CommentStore {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  /**
   * list of comments of tenant
   */
  tenantCommentList: IComment[] | undefined = undefined;

  /**
   * set list of comments of tenant
   * @param tenantCommentList
   */
  setTenantCommentList(tenantCommentList: IComment[]) {
    this.tenantCommentList = tenantCommentList;
  }

  /**
   * clear list of comments of tenant
   */
  clearTenantCommentList() {
    this.tenantCommentList = undefined;
  }
}

const commentStore = new CommentStore();
export default commentStore;
