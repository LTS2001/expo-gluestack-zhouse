import { NetInfoStateType } from '@react-native-community/netinfo';
import { configure, makeAutoObservable } from 'mobx';

configure({
  enforceActions: 'never',
});
class NetworkStore {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  /**
   * network connect state (is connected)
   */
  isConnected: boolean = false;
  setIsConnected(flag: boolean) {
    this.isConnected = flag;
  }
  clearIsConnected() {
    this.isConnected = false;
  }

  /**
   * network type
   */
  networkType: NetInfoStateType | undefined = undefined;
  setNetworkType(type: NetInfoStateType) {
    this.networkType = type;
  }
  clearNetworkType() {
    this.networkType = undefined;
  }
}

const networkStore = new NetworkStore();

export default networkStore;
