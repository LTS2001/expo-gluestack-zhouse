import { IChatMessage, IChatSession, IUser } from '@/global';
import { makeAutoObservable } from 'mobx';

class ChatStore {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  /**
   * sender id in chat
   */
  senderId = '';

  /**
   * sender info
   */
  chatSender: IUser | undefined;

  /**
   * receiver info
   */
  chatReceiver: IUser | undefined;

  /**
   * current chat session
   */
  currentChatSession: IChatSession | undefined;

  /**
   * current user chat session list
   */
  chatSessionList: IChatSession[] | undefined;

  /**
   * current chat session history
   */
  chatMessageList: IChatMessage[] | undefined;

  /**
   * receiver info of chat session list
   */
  chatReceiverInfoList: any[] | undefined;

  /**
   * the latest message in the chat session list.
   */
  chatSessionLastOneMessageList: IChatMessage[] | undefined;

  /**
   * @param senderId
   */
  setSenderId(senderId: string) {
    this.senderId = senderId;
  }

  /**
   * set sender info
   * @param sender
   */
  setChatSender(sender: IUser) {
    this.chatSender = sender;
  }

  /**
   * set receiver info
   * @param receiver
   */
  setChatReceiver(receiver: IUser) {
    this.chatReceiver = receiver;
  }

  /**
   * set the current user session list
   */
  setChatSessionList(chatSessionList: IChatSession[]) {
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
  setChatReceiverInfoList(receiverInfoList: any) {
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