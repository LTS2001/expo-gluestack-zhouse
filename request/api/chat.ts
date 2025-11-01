import { IChatMessage, IChatSession, ISendChatMessage } from '@/global';
import { axios } from '../axios';

/**
 * get chat session list by sender id
 * @param senderId sender id
 * @returns chat session list
 */
export const getChatSessionListApi = (
  senderId: string
): Promise<IChatSession[]> =>
  axios.get(`/chat/session`, { params: { senderId } });

/**
 * get the latest one message in the chat session list
 * @param senderId
 */
export const getChatSessionLastOneMessageListApi = (
  senderId: string
): Promise<IChatMessage[]> =>
  axios.get(`/chat/message/lastOne`, { params: { senderId } });

/**
 * add a chat session record
 * @param senderId sender id
 * @param receiverId receiver id
 */
export const postChatSessionApi = (
  senderId: string,
  receiverId: string
): Promise<IChatSession> => {
  return axios.post(`/chat/session`, {
    senderId,
    receiverId,
  });
};

/**
 * add a chat message
 * @param data chat message data
 */
export const postChatMessageApi = (
  data: ISendChatMessage
): Promise<IChatMessage> => axios.post(`/chat/message`, data);

/**
 * get sender and receiver chat message list
 * @param params senderId, receiverId, page, limit
 * @returns chat message list
 */
export const getChatMessageListApi = (params: {
  senderId: string;
  receiverId: string;
  limit: number;
}): Promise<IChatMessage[]> => axios.get(`/chat/message`, { params });

/**
 * leave chat message page
 * @param data
 */
export const putLeaveChatMessageApi = (data: {
  sessionId: number;
  senderId: string;
  receiverId: string;
}) => axios.put(`/chat/session/leave`, data);
