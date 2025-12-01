/**
 * chat message type enum
 */
export enum EChatMessageTypeEnum {
  Text = 1,
  Image,
  Video,
  WebrtcVideo,
}

/**
 * approx one line height
 */
export const CHAT_INPUT_MIN_HEIGHT = 36;

/**
 * max before scrolling
 */
export const CHAT_INPUT_MAX_HEIGHT = 120;

/**
 * gets the number of chat messages from the server.
 */
export const CHAT_MESSAGE_LIMIT = 50;
