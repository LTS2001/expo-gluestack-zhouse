import { IAddComment, IComment } from '@/global';
import { axios } from '../axios';

/**
 * get the comment list by tenant id
 * @param tenantId tenant id
 * @returns comment list
 */
export const getCommentListByTenantIdApi = (
  tenantId: number
): Promise<IComment[]> =>
  axios.get(`/comment/tenantId`, { params: { tenantId } });

/**
 * add comment
 * @param data comment data
 * @returns comment info
 */
export const postCommentApi = (data: IAddComment): Promise<IComment> =>
  axios.post('/comment', data);

/**
 * get house all comment list by house id
 * @param houseId house id
 * @returns house all comment list
 */
export const getHouseCommentListApi = (houseId: number): Promise<IComment[]> =>
  axios.get(`/comment/houseId`, { params: { houseId } });
