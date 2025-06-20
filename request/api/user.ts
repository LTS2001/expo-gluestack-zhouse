import {
  ILogin,
  IRegister,
  IUpdateBaseUserInfo,
  IUser,
  IUserVerify,
} from '@/global';
import authStore from '@/stores/auth';
import { axios } from '..';
/**
 * user login
 * @param data phone and password
 */
export const login = (data: ILogin): Promise<IUser> =>
  axios.post(`${authStore.identity}/login`, data);

/**
 * user registry
 * @param data phone and password
 */
export const registry = (data: IRegister): Promise<IUser> =>
  axios.post(`${authStore.identity}/registry`, data);

/**
 * get user information (tenant info or landlord info)
 */
export const getUser = (): Promise<IUser> => axios.get(`${authStore.identity}`);

/**
 * update user info (base info or identity real name verify)
 * @param data 
 */
export const updateUser = (
  data: IUpdateBaseUserInfo | IUserVerify
): Promise<IUser> => axios.put(`${authStore.identity}`, data);
