import { IAddComplaint, IComplaint } from '@/global';
import { axios } from '../axios';

/**
 * add complaint
 * @param data
 */
export const postComplaintApi = (data: IAddComplaint): Promise<IComplaint> => {
  return axios.post(`/complaint`, data);
};

/**
 * get complaint list by complaint id (tenand id or landlord id) and identity
 * @param complaintId
 * @param identity
 */
export const getComplaintListApi = (
  complaintId: number,
  identity: number
): Promise<IComplaint[]> =>
  axios.get(`/complaint`, {
    params: {
      complaintId,
      identity,
    },
  });
