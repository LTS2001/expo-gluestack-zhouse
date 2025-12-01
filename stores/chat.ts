import { EUserIdentityEnum } from '@/constants';
import { IChatMessage, IChatSession, IChatSessionUser, IUser } from '@/global';
import { configure, makeAutoObservable } from 'mobx';
import authStore from './auth';

configure({
  enforceActions: 'never',
});
class ChatStore {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  /**
   * whether to load more messages
   */
  isLoadingMessage: boolean = false;

  /**
   * whether to continue getting information
   */
  continueGetMessage: boolean = true;

  /**
   * the number of unread messages of the current user
   */
  chatUnreadNum: number | undefined = undefined;

  /**
   * sender id in chat
   */
  senderId = '';

  /**
   * sender info
   */
  chatSender: IUser | undefined = undefined;

  /**
   * receiver id in chat
   */
  receiverId = '';

  /**
   * receiver info
   */
  chatReceiver: IUser | undefined = undefined;

  /**
   * current chat session
   */
  currentChatSession: IChatSession | undefined = undefined;

  /**
   * current user chat session list
   */
  chatSessionList: IChatSession[] | undefined = undefined;

  /**
   * current chat session history
   */
  chatMessageList: IChatMessage[] | undefined = undefined;

  /**
   * receiver info of chat session list
   */
  chatReceiverInfoList: IChatSessionUser[] | undefined = undefined;

  /**
   * the latest message in the chat session list.
   */
  chatSessionLastOneMessageList: IChatMessage[] | undefined = undefined;

  /**
   * set whether to load more messages
   */
  setIsLoadingMessage(isLoadingMessage: boolean) {
    this.isLoadingMessage = isLoadingMessage;
  }

  /**
   * set continue get message
   */
  setContinueGetMessage(continueGetMessage: boolean) {
    this.continueGetMessage = continueGetMessage;
  }

  /**
   * set the number of unread messages of the current user
   */
  setChatUnreadNum(unreadNum: number) {
    this.chatUnreadNum = unreadNum;
  }

  /**
   * set sender info
   * @param sender
   */
  setChatSender(sender: IUser) {
    const { identity } = authStore;
    this.senderId = `${identity},${sender.id}`;
    this.chatSender = sender;
  }

  /**
   * set receiver info
   * @param receiver
   */
  setChatReceiver(receiver: IUser) {
    const { identity } = authStore;
    // sender is landlord, receiver is tenant
    if (identity === EUserIdentityEnum.Landlord) {
      this.receiverId = `${EUserIdentityEnum.Tenant},${receiver.id}`;
    }
    // sender is tenant, receiver is landlord
    else if (identity === EUserIdentityEnum.Tenant) {
      this.receiverId = `${EUserIdentityEnum.Landlord},${receiver.id}`;
    }
    this.chatReceiver = receiver;
  }

  /**
   * set the current user session list
   */
  setChatSessionList(chatSessionList: IChatSession[]) {
    let unreadNum = 0;
    chatSessionList.forEach((item) => {
      unreadNum += item.unread;
    });
    this.setChatUnreadNum(unreadNum);
    this.chatSessionList = chatSessionList;
  }

  /**
   * clear current user session list
   */
  clearChatSessionList() {
    this.chatSessionList = undefined;
    // clear senderId
    this.senderId = '';
  }

  /**
   * set the current session chat record
   */
  setChatMessageList(chatMessageList: IChatMessage[]) {
    this.chatMessageList = chatMessageList;
  }

  /**
   * clear the current session chat record
   */
  clearChatMessageList() {
    this.chatMessageList = undefined;
  }

  /**
   * set current session information
   */
  setCurrentChatSession(chatSession: IChatSession) {
    this.currentChatSession = chatSession;
  }

  /**
   * clear current session information
   */
  clearCurrentChatSession() {
    this.currentChatSession = undefined;
  }

  /**
   * set receiver info of chat session list
   */
  setChatReceiverInfoList(receiverInfoList: IChatSessionUser[]) {
    this.chatReceiverInfoList = receiverInfoList;
  }

  /**
   * set the latest message in the session list.
   */
  setChatSessionLastOneMessageList(messageList: IChatMessage[]) {
    this.chatSessionLastOneMessageList = messageList;
  }
}

const chatStore = new ChatStore();

export default chatStore;
