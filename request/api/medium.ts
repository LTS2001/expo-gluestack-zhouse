import authStore from '@/stores/auth';
import { axios } from '..';

/**
 * upload user head image
 */
export const uploadUserHeadImg = (data: FormData) =>
  axios.post(`${authStore.identity}/headImg`, data);
/**
 * upload image or video
 */
export const uploadImgVideo = (data: FormData) => axios.post('medium', data);
/**
 * chat upload image or video
 */
export const chatUploadImgVideo = (data: FormData) =>
  axios.post('medium/chat', data);
