import { IDENTITY_KEY, TOKEN } from '@/constant/auth';
import { TIdentity } from '@/global';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { action, configure, makeAutoObservable, runInAction } from 'mobx';

configure({
  enforceActions: 'always',
});
class AuthStore {
  private async initializeStore() {
    try {
      const [storedToken, storedIdentity] = await Promise.all([
        AsyncStorage.getItem(TOKEN),
        AsyncStorage.getItem(IDENTITY_KEY)
      ])
      runInAction(() => {
        this.token = storedToken
        this.identity = storedIdentity as TIdentity
        this.isLogin = !!storedToken
      })
    } catch (error) {
      console.error('Failed to initialize store:', error);
    } finally {
      runInAction(() => {
        this.isInitialized = true
      })
    }
  }

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    this.initializeStore()
  }
  /**
   * 初始化状态标识
   */
  isInitialized: boolean = false

  /**
   * 登录态token
   */
  token: string | null = null;

  /**
   * 标志是否处于登录
   */
  isLogin: boolean = false;

  /**
   * 当前身份
   */
  identity: TIdentity | null = null;

  /**
   * 上一个身份
   */
  preIdentity: TIdentity | null = null;

  /**
   * 设置token值
   */
  async setToken(token: string) {
    this.token = token;
  }

  /**
   * 设置登录态
   * @param isLogin 是否处于登录状态
   * @param totken token令牌
   */
  setLoginState = action(async (isLogin: boolean, token?: string) => {
    try {
      if (!isLogin) await AsyncStorage.removeItem(TOKEN);
      else if (isLogin && token) {
        await AsyncStorage.setItem(TOKEN, token);
        this.token = token;
      }
      this.isLogin = isLogin;
    } catch (error) {
      console.error('Failed to setLoginState because of set token by AsyncStorage', error);
    }
  })

  /**
   * 设置当前身份
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
   * 清除当前身份
   */
  async clearIdentityState() {
    try {
      await AsyncStorage.removeItem(IDENTITY_KEY);
      this.identity = null;
    } catch (error) {
      console.error('Failed to clearIdentityState', error);
    }
  }

  /**
   * 设置上一个身份
   */
  async setPreIdentityState(identity: TIdentity) {
    this.preIdentity = identity;
  }
}

const authStore = new AuthStore();
export default authStore;