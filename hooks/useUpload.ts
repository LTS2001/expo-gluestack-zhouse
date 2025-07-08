import { showToast } from '@/components/ui/toast';
import { uploadImgVideo, uploadUserHeadImg } from '@/request/api/medium';
import * as ImagePicker from 'expo-image-picker';
import useUser from './useUser';
export default function useUpload() {
  const { getUserInfo } = useUser();
  /**
   * upload user header image
   */
  const uploadHeaderImage = async () => {
    try {
      // request permission
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
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
        const res = await uploadUserHeadImg(formData);
        await getUserInfo();
        return res;
      }
    } catch (error) {
      console.error('选择图片失败:', error);
      showToast({ title: '选择图片失败，请重试', icon: 'error' });
    }
  };

  const uploadIdentityCardImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
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
        const res = await uploadImgVideo(formData);
        return res;
      }
      return Promise.reject();
    } catch (error) {
      console.error('选择图片失败:', error);
      showToast({ title: '上传身份证失败，请重试', icon: 'error' });
    }
  };

  const uploadImage = async (image: ImagePicker.ImagePickerOptions) => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        showToast({ title: '需要相册权限才能上传' });
        return Promise.reject();
      }
      const result = await ImagePicker.launchImageLibraryAsync(image);
      if (!result.canceled) {
        const uri = result.assets[0].uri;
        const formData = new FormData();
        formData.append('image', {
          uri,
          type: 'image/jpeg',
          name: Date.now().valueOf() + 'image.jpg',
        } as any);
        const res = await uploadImgVideo(formData);
        return res;
      }
      return Promise.reject();
    } catch (error) {
      console.error('选择图片失败:', error);
      showToast({ title: '上传图片失败，请重试', icon: 'error' });
    }
  };

  return { uploadHeaderImage, uploadIdentityCardImage, uploadImage };
}
