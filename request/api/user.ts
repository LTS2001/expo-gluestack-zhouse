import { BaseRes, ILogin, IRegister, IUser } from '@/global';
import authStore from '@/stores/auth';
import { axios } from '..';
/**
 * user login
 * @param data phone and password
 */
export const login = (data: ILogin) =>
  axios.post<BaseRes<IUser>>(`${authStore.identity}/login`, data);

/**
 * user registry
 * @param data phone and password
 */
export const registry = (data: IRegister) =>
  axios.post(`${authStore.identity}/registry`, data);

/**
 * get user information (tenant info or landlord info)
 */
export const getUser = () => axios.get(`${authStore.identity}`);
