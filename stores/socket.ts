import { configure, makeAutoObservable } from 'mobx';

configure({
  enforceActions: 'always',
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
}

const socketStore = new SocketStore();

export default socketStore;
