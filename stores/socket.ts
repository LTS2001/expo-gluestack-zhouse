import { ConnectionState } from '@/constants';
import { ISocketMessage } from '@/global';
import { configure, makeAutoObservable } from 'mobx';

configure({
  enforceActions: 'never',
});

class SocketStore {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  /**
   * websocket instance
   */
  socketInstance: WebSocket | undefined = undefined;

  /**
   * connection state
   */
  connectionState: ConnectionState = ConnectionState.DISCONNECTED;

  /**
   * reconnect attempts
   */
  reconnectAttempts: number = 0;

  /**
   * last connected at
   */
  lastConnectedAt: Date | null = null;

  /**
   * message queue
   */
  messageQueue: ISocketMessage[] = [];

  /**
   * set websocket instance
   * @param instance
   */
  setWebsocketInstance(instance: WebSocket) {
    this.socketInstance = instance;
  }

  /**
   * clear websocket instance
   */
  clearWebsocketInstance() {
    this.socketInstance = undefined;
  }

  /**
   * set connection state
   */
  setConnectionState(state: ConnectionState) {
    this.connectionState = state;
  }

  /**
   * set reconnect attempts
   */
  setReconnectAttempts(attempts: number) {
    this.reconnectAttempts = attempts;
  }

  /**
   * set last connected at
   */
  setLastConnectedAt(date: Date) {
    this.lastConnectedAt = date;
  }

  /**
   * add message to queue
   */
  addToMessageQueue(message: ISocketMessage) {
    this.messageQueue.push(message);
  }

  /**
   * clear message queue
   */
  clearMessageQueue() {
    this.messageQueue = [];
  }
}

const socketStore = new SocketStore();

export default socketStore;
