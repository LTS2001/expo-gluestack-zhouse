import { IDENTITY_KEY, TOKEN } from '@/constants/auth';
import { TIdentity } from '@/global';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { configure, makeAutoObservable } from 'mobx';

configure({
  enforceActions: 'always',
});
class AuthStore {
  private async initializeStore() {
    try {
      const [storedToken, storedIdentity] = await Promise.all([
        AsyncStorage.getItem(TOKEN),
        AsyncStorage.getItem(IDENTITY_KEY),
      ]);
      this.token = storedToken;
      this.identity = storedIdentity as TIdentity;
      this.isLogin = !!storedToken;
    } catch (error) {
      console.error('Failed to initialize store:', error);
    } finally {
      this.isInitialized = true;
    }
  }

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    this.initializeStore();
  }
  /**
   * initialization status identification
   */
  isInitialized: boolean = false;

  /**
   * user login status token
   */
  token: string | undefined | null = undefined;

  /**
   * flag user is login status
   */
  isLogin: boolean = false;

  /**
   * currently identity
   */
  identity: TIdentity | undefined = undefined;

  /**
   * previous identity
   */
  preIdentity: TIdentity | undefined = undefined;

  /**
   * set token
   */
  async setToken(token: string) {
    this.token = token;
  }

  /**
   * set login status
   * @param isLogin login status
   * @param totken token
   */
  async setLoginState(isLogin: boolean, token?: string) {
    try {
      // logout
      if (!isLogin) await AsyncStorage.removeItem(TOKEN);
      // login
      else if (isLogin && token) {
        await AsyncStorage.setItem(TOKEN, token);
        this.token = token;
      }
      this.isLogin = isLogin;
    } catch (error) {
      console.error(
        'Failed to setLoginState because of set token by AsyncStorage',
        error
      );
    }
  }

  /**
   * set currently identity
   */
  async setIdentityState(identity: TIdentity) {
    try {
      await AsyncStorage.setItem(IDENTITY_KEY, identity);
      this.identity = identity;
    } catch (error) {
      console.error('Failed to setIdentityState', error);
    }
  }

  /**
   * clear currently identity
   */
  async clearIdentityState() {
    try {
      await AsyncStorage.removeItem(IDENTITY_KEY);
      this.identity = undefined;
    } catch (error) {
      console.error('Failed to clearIdentityState', error);
    }
  }

  /**
   * set previous identity
   */
  async setPreIdentityState(identity: TIdentity) {
    this.preIdentity = identity;
  }
}

const authStore = new AuthStore();
export default authStore;
