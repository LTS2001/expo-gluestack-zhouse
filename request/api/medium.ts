import { authStore } from '@/stores';
import { axios } from '../axios';

/**
 * upload user head image
 */
export const postUploadUserHeadImgApi = (data: FormData) =>
  axios.post(`${authStore.identity}/headImg`, data);

/**
 * upload image or video
 */
export const postUploadImgVideoApi = (data: FormData) =>
  axios.post('medium', data);

/**
 * upload image or video for chat
 */
export const postChatUploadImgVideoApi = (data: FormData) =>
  axios.post('medium/chat', data);
