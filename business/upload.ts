import { showToast } from '@/components/ui';
import { postUploadImgVideoApi, postUploadUserHeadImgApi } from '@/request';
import * as ImagePicker from 'expo-image-picker';
import { getUserInfo } from './user';

/**
 * upload user header image
 */
export const uploadHeaderImage = async () => {
  try {
    // request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showToast({ title: '需要相册权限才能上传头像' });
      return;
    }
    // open image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const formData = new FormData();
      formData.append('avatar', {
        uri,
        type: 'image/jpeg',
        name: 'avatar.jpg',
      } as any);
      const res = await postUploadUserHeadImgApi(formData);
      await getUserInfo();
      return res;
    }
  } catch (error) {
    console.error('选择图片失败:', error);
    showToast({ title: '选择图片失败，请重试', icon: 'error' });
  }
};

/**
 * upload identity card image
 */
export const uploadIdentityCardImage = async () => {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showToast({ title: '需要相册权限才能上传' });
      return Promise.reject();
    }
    // open image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [16, 10],
      quality: 1,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const formData = new FormData();
      formData.append('identity', {
        uri,
        type: 'image/jpeg',
        name: 'identity.jpg',
      } as any);
      const res = await postUploadImgVideoApi(formData);
      return res;
    }
    return Promise.reject();
  } catch (error) {
    console.error('选择图片失败:', error);
    showToast({ title: '上传身份证失败，请重试', icon: 'error' });
  }
};

/**
 * upload image
 * @param options image picker options
 */
export const uploadImage = async (options: ImagePicker.ImagePickerOptions) => {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showToast({ title: '需要相册权限才能上传' });
      return Promise.reject();
    }
    const result = await ImagePicker.launchImageLibraryAsync(options);
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const formData = new FormData();
      formData.append('image', {
        uri,
        type: 'image/jpeg',
        name: Date.now().valueOf() + 'image.jpg',
      } as any);
      const res = await postUploadImgVideoApi(formData);
      return res;
    }
    return Promise.reject();
  } catch (error) {
    console.error('选择图片失败:', error);
    showToast({ title: '上传图片失败，请重试', icon: 'error' });
  }
};
