import { COMPLAINT_LANDLORD, COMPLAINT_TENANT, TENANT } from '@/constants';
import { getComplaintListApi } from '@/request';
import { authStore, complaintStore, userStore } from '@/stores';

/**
 * get complaint list of user (tenant or landlord)
 */
export const getComplaintList = async () => {
  const _identity =
    authStore.identity === TENANT ? COMPLAINT_TENANT : COMPLAINT_LANDLORD;
  const res = await getComplaintListApi(userStore.user?.id!, _identity);
  complaintStore.setComplaintList(res);
};
