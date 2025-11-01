import {
  CHAT_MESSAGE_LIMIT,
  CHAT_SIGN_LANDLORD,
  ECHAT_MESSAGE_TYPE,
  LANDLORD,
  TENANT,
} from '@/constants';
import { ISendChatMessage, ISocketMessage, TAddChatMessage } from '@/global';
import {
  getChatMessageListApi,
  getChatSessionLastOneMessageListApi,
  getChatSessionListApi,
  postChatMessageApi,
  postChatSessionApi,
} from '@/request';
import { chatStore, socketStore } from '@/stores';
import { getReceiverInfoListByIdList } from './user';

/**
 * send message (with queue mechanism)
 */
export const sendMessage = (message: ISocketMessage) => {
  const { addToMessageQueue, socketInstance: ws } = socketStore;
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
    return true;
  } else {
    // if connection not established, add message to queue
    addToMessageQueue(message);
    console.log('websocket: message queued, waiting for connection');
    return false;
  }
};

/**
 * chat initialization logic
 */
export const initializeChat = async () => {
  // TODO: 后续将这些接口合并在一起进行优化
  await getChatSessionList();
  getChatSessionReceiverInfoList();
};

/**
 * get the latest one message in the chat session list
 */
export const getChatSessionLastOneMessageList = async () => {
  const { setChatSessionLastOneMessageList, senderId } = chatStore;
  const chatSessionLastOneMessageList =
    await getChatSessionLastOneMessageListApi(senderId);
  setChatSessionLastOneMessageList(chatSessionLastOneMessageList);
};

/**
 * get chat session list of user(tenant/landlord)
 */
export const getChatSessionList = async () => {
  const { senderId, setChatSessionList } = chatStore;
  if (!senderId) return;
  // get chat session information
  const chatSession = await getChatSessionListApi(senderId);
  if (!chatSession?.length) return;
  // get the latest one message in the chat session list
  await getChatSessionLastOneMessageList();
  setChatSessionList(chatSession);
};

/**
 * add a chat session
 */
export const addChatSession = async () => {
  const { senderId, receiverId, setCurrentChatSession } = chatStore;
  if (!senderId || !receiverId) return;
  const chatSession = await postChatSessionApi(senderId, receiverId);
  setCurrentChatSession(chatSession);
};

/**
 * add a chat message
 * @param data chat message data
 */
export const addChatMessage = async (
  data: TAddChatMessage,
  opt: { msgIdCount: number }
) => {
  const { chatMessageList, setChatMessageList } = chatStore;
  const { content, type, ...rest } = data;
  const { msgIdCount } = opt;
  const _data: ISendChatMessage = {
    ...rest,
    type,
    content:
      type === ECHAT_MESSAGE_TYPE.TEXT ? content : JSON.stringify(content),
  };
  setChatMessageList([
    {
      ..._data,
      id: Date.now() + msgIdCount,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    ...(chatMessageList ?? []),
  ]);
  await postChatMessageApi(_data);
};

/**
 * get current session chat message list
 */
export const getChatMessageList = async () => {
  const {
    senderId,
    receiverId,
    chatMessageList,
    setChatMessageList,
    continueGetMessage,
    setContinueGetMessage,
    isLoadingMessage,
    setIsLoadingMessage,
  } = chatStore;
  if (!senderId || !receiverId || !continueGetMessage || isLoadingMessage)
    return;
  setIsLoadingMessage(true);
  const msgList = await getChatMessageListApi({
    senderId,
    receiverId,
    limit: CHAT_MESSAGE_LIMIT,
  });
  if (msgList?.length) {
    // 1、server has data returned
    setChatMessageList([...(chatMessageList ?? []), ...msgList.reverse()]);
  } else {
    // 2、server has no data returned, which means all records have been loaded
    setContinueGetMessage(false);
  }
  setIsLoadingMessage(false);
};

/**
 * get chat session receiver info list
 */
export const getChatSessionReceiverInfoList = async () => {
  const { senderId, chatSessionList, setChatReceiverInfoList } = chatStore;

  if (!senderId || !chatSessionList) return;
  const receiverList = await getReceiverInfoListByIdList(
    chatSessionList?.map((session) => {
      const [identity, id] = session.receiverId.split(',');
      return {
        identity: identity === CHAT_SIGN_LANDLORD ? LANDLORD : TENANT,
        id: Number(id),
      };
    })
  );
  setChatReceiverInfoList(receiverList);
};
