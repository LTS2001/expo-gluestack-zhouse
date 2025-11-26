/**
 * landlord sign
 */
export const CHAT_SIGN_LANDLORD = 'L';

/**
 * tenant sign
 */
export const CHAT_SIGN_TENANT = 'T';

/**
 * approx one line height
 */
export const CHAT_INPUT_MIN_HEIGHT = 36;

/**
 * max before scrolling
 */
export const CHAT_INPUT_MAX_HEIGHT = 120;

/**
 * chat message type text
 */
export const CHAT_MESSAGE_TYPE_TEXT = 1;
/**
 * chat message type image
 */
export const CHAT_MESSAGE_TYPE_IMAGE = 2;
/**
 * chat message type video
 */
export const CHAT_MESSAGE_TYPE_VIDEO = 3;
/**
 * webrtc video call
 */
export const CHAT_MESSAGE_TYPE_WEBRTC_VIDEO = 4;

/**
 * chat message type enum
 */
export enum ECHAT_MESSAGE_TYPE {
  TEXT = CHAT_MESSAGE_TYPE_TEXT,
  IMAGE = CHAT_MESSAGE_TYPE_IMAGE,
  VIDEO = CHAT_MESSAGE_TYPE_VIDEO,
  WEBRTC_VIDEO = CHAT_MESSAGE_TYPE_WEBRTC_VIDEO,
}

export const CHAT_MESSAGE_LIMIT = 50;
