import { showToast } from '@/components/ui';
import { IVideo, IVideoThumbnail } from '@/global';
import { postUploadImgVideoApi, postUploadUserHeadImgApi } from '@/request';
import * as ImagePicker from 'expo-image-picker';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { getUserInfo } from './user';

/**
 * pick medium file
 * @param options image picker options
 * @returns image picker result
 */
const pickMediumFile = async (
  options: ImagePicker.ImagePickerOptions
): Promise<ImagePicker.ImagePickerResult> => {
  try {
    // request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showToast({ title: '需要相册权限才能上传' });
      return Promise.reject('需要相册权限才能上传');
    }
    // open medium picker
    const result = await ImagePicker.launchImageLibraryAsync(options);
    return Promise.resolve(result);
  } catch (error) {
    console.log('pickMediumFile error:', error);
    return Promise.reject(error);
  }
};

/**
 * upload image to server
 * @param uri image uri
 * @param onProgress on progress callback function
 * @returns server image url
 */
const uploadImageToServer = async ({
  uri,
  onProgress,
}: {
  uri: string;
  onProgress?: (progress: number) => void;
}) => {
  const formData = new FormData();
  formData.append('image', {
    uri,
    type: 'image/jpeg',
    name: Date.now().valueOf() + 'image.jpg',
  } as any);

  const url = await postUploadImgVideoApi(formData, {
    onUploadProgress(progressEvent) {
      if (progressEvent.total && onProgress) {
        // add boundary check, ensure progress does not exceed 100%
        let progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        progress = Math.min(progress, 100); // limit maximum value to 100%
        onProgress(progress);
      }
    },
  });
  onProgress?.(100);
  return url;
};

/**
 * upload user header image
 */
export const uploadHeaderImage = async () => {
  const result = await pickMediumFile({
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
    const url = await postUploadUserHeadImgApi(formData);
    await getUserInfo();
    return url;
  }
  return Promise.reject();
};

/**
 * upload identity card image
 */
export const uploadIdentityCardImage = async () => {
  const result = await pickMediumFile({
    allowsEditing: true,
    aspect: [16, 10],
    quality: 1,
  });
  if (!result.canceled) {
    const uri = result.assets[0].uri;
    return await uploadImageToServer({ uri });
  }
  return Promise.reject();
};

/**
 * upload image
 * @param options image picker options
 * @param onProgress on progress callback function
 * @returns server image url
 */
export const uploadImage = async (
  options: ImagePicker.ImagePickerOptions,
  onProgress?: (progress: number) => void
) => {
  const result = await pickMediumFile(options);
  if (!result.canceled) {
    const uri = result.assets[0].uri;
    return await uploadImageToServer({ uri, onProgress });
  }
  return Promise.reject();
};

/**
 * generate video thumbnail
 * @param videoUri video file uri
 * @param timeMs specified time point (milliseconds), default 1 second
 * @returns thumbnail info (contains src, dimensions and aspect ratio)
 */
export const generateVideoThumbnail = async (
  videoUri: string,
  timeMs: number = 1000
): Promise<IVideoThumbnail> => {
  try {
    const { uri, width, height } = await VideoThumbnails.getThumbnailAsync(
      videoUri,
      {
        time: timeMs,
        quality: 1, // highest quality
      }
    );
    // upload thumbnail to server and get server url
    const path = await uploadImageToServer({ uri });
    return {
      path,
      width,
      height,
      aspectRatio: Number((width / height).toFixed(2)),
    };
  } catch (error) {
    console.log('generate video thumbnail failed:', error);
    return Promise.reject(error);
  }
};

/**
 * upload video to server
 * @param uri video uri
 * @param onProgress on progress callback function
 * @returns server video url
 */
const uploadVideoToServer = async ({
  uri,
  onProgress,
}: {
  uri: string;
  onProgress?: (progress: number) => void;
}) => {
  const formData = new FormData();
  formData.append('video', {
    uri,
    type: 'video/mp4',
    name: Date.now().valueOf() + 'video.mp4',
  } as any);

  const url = await postUploadImgVideoApi(formData, {
    onUploadProgress(progressEvent) {
      if (progressEvent.total && onProgress) {
        /**
         * Due to the overhead of network transmission,
         * the total amount of network transmission will always be larger than the file content,
         * and an approximate value can be taken to represent the total amount of network transmission,
         * that is, 1.5 times the file content.
         */
        let progress = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total * 1.5)
        );
        progress = Math.min(progress, 100); // limit maximum value to 100%
        onProgress(progress);
      }
    },
  });
  onProgress?.(100);
  return url;
};

export interface IUploadVideoParams {
  options?: ImagePicker.ImagePickerOptions;
  onProgress?: (progress: number) => void;
  onThumbnailGenerated?: (thumbnailInfo: IVideoThumbnail) => void;
}
/**
 * upload video
 * @param options image picker options
 * @param onProgress on progress callback function
 * @param onThumbnailGenerated video thumbnail generated callback function
 * @returns video info
 */
export const uploadVideo = async (
  props: IUploadVideoParams
): Promise<Omit<IVideo, 'thumbnail'>> => {
  const {
    options = {
      mediaTypes: ['videos'],
      quality: 1,
    },
    onProgress,
    onThumbnailGenerated,
  } = props;

  try {
    const result = await pickMediumFile(options);
    if (!result.canceled) {
      const { uri, width, height, duration } = result.assets[0];
      // generate video thumbnail
      const thumbnail = await generateVideoThumbnail(uri);
      onThumbnailGenerated?.(thumbnail);
      // upload video to server
      const path = await uploadVideoToServer({ uri, onProgress });
      return {
        path,
        width,
        height,
        aspectRatio: Number((width / height).toFixed(2)),
        duration: duration ?? 0,
      };
    }
    return Promise.reject();
  } catch (error) {
    console.log('uploadVideo error:', error);
    showToast({ title: '上传视频失败，请重试', icon: 'error' });
    return Promise.reject(error);
  }
};
