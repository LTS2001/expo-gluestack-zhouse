import { authStore } from '@/stores';
import { AxiosRequestConfig } from 'axios';
import { axios } from '../axios';

/**
 * upload user head image
 */
export const postUploadUserHeadImgApi = (data: FormData) =>
  axios.post(`/${authStore.identity}/headImg`, data);

/**
 * upload image or video
 */
export const postUploadImgVideoApi = (
  data: FormData,
  options?: AxiosRequestConfig
): Promise<string> => {
  // upload medium set no timeout
  axios.defaults.timeout = 0;
  return axios.post('/medium', data, options);
};

/**
 * upload image or video for chat
 */
export const postChatUploadImgVideoApi = (data: FormData) =>
  axios.post('/medium/chat', data);
