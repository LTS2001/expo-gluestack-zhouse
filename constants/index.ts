import {
  APP_SERVER_API_ROOT,
  APP_SERVER_IMAGE_ROOT,
  APP_SERVER_SOCKET_ROOT,
} from '@env';
export * from './auth';
export * from './chat';
export * from './code';
export * from './complaint';
export * from './domain';
export * from './house';
export * from './image';
export * from './map';
export * from './socket';
export * from './webrtc';

/**
 * api server root
 */
export const SERVER_API_ROOT = APP_SERVER_API_ROOT;

/**
 * websocket server root
 */
export const SERVER_SOCKET_ROOT = APP_SERVER_SOCKET_ROOT;

/**
 * image and video server root
 */
export const SERVER_IMAGE_ROOT = APP_SERVER_IMAGE_ROOT;
