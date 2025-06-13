import { showToast } from '@/components/ui/toast';
import { NOT_LOGIN_ERROR, SUCCESS } from '@/constants/code';
import { BaseRes } from '@/global';
import { userLogout } from '@/services/user';
import authStore from '@/stores/auth';
import _, { AxiosResponse } from 'axios';
const axios = _.create({
  baseURL: 'http://172.63.48.66:7002/',
  timeout: 5000,
});

axios.interceptors.request.use(
  (config) => {
    // each request carries the authorization field
    config.headers.Authorization = authStore.token;
    return config;
  },
  (error) => {
    showToast({ title: error });
    Promise.reject(error);
  }
);

axios.interceptors.response.use(
  async (res: AxiosResponse<BaseRes>) => {
    //  success connect server
    if (res.status === 200) {
      const data = res.data;
      // if res.headers has token field, is mean login api request success
      if (res.headers.token) {
        await authStore.setLoginState(true, res.headers.token);
      }
      // successfully fetch server data
      if (data && data.code === SUCCESS) {
        return data.data;
      }
      // user not login
      else if (data && data.code === NOT_LOGIN_ERROR) {
        // clear store login status
        if (authStore.isLogin) {
          userLogout();
        }
        showToast({ title: '未登录' });
        return new Promise(() => {});
      } else {
        showToast({ title: res.data.message });
        return new Promise(() => {});
      }
    }
  },
  // is mean fail to connect server
  () => {
    showToast({ title: '请求出错了！' });
    // interrupt promise chain
    return new Promise(() => {});
  }
);

export { axios };
