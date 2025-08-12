import {
  IExistLease,
  IHouseLease,
  ILogin,
  IRegister,
  IUpdateBaseUserInfo,
  IUser,
  IUserVerify,
} from '@/global';
import { authStore } from '@/stores';
import { axios } from '../axios';
/**
 * user login
 * @param data phone and password
 * @returns user info (landlord info or tenant info)
 */
export const postLoginApi = (data: ILogin): Promise<IUser> =>
  axios.post(`/${authStore.identity}/login`, data);

/**
 * user registry
 * @param data phone and password
 * @returns user info (landlord info or tenant info)
 */
export const postRegistryApi = (data: IRegister): Promise<IUser> =>
  axios.post(`/${authStore.identity}/registry`, data);

/**
 * get user information
 * @returns user info (landlord info or tenant info)
 */
export const getUserApi = (): Promise<IUser> =>
  axios.get(`/${authStore.identity}`);

/**
 * update user info (base info or identity real name verify)
 * @param data user info
 * @returns user info (landlord info or tenant info)
 */
export const putUserApi = (
  data: IUpdateBaseUserInfo | IUserVerify
): Promise<IUser> => axios.put(`/${authStore.identity}`, data);

/**
 * get landlord list by ids
 * @param ids landlord id list
 * @returns landlord list
 */
export const getLandlordListApi = (ids: string): Promise<IUser[]> =>
  axios.get(`/landlord/list?ids=${ids}`);

/**
 * get the landlord's tenant lease information list
 * @returns tenant's lease info list
 */
export const getTenantLeasedListLandlordApi = (): Promise<IExistLease[]> =>
  axios.get(`/landlord/tenant`);

/**
 * get tenant's leased house list
 * @param tenantId tenant id
 * @returns house list
 */
export const getTenantLeasedHouseListApi = (
  tenantId: number
): Promise<IHouseLease[]> => axios.get(`/tenant/lease?tenantId=${tenantId}`);
