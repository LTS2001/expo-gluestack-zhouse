import { uploadImage, uploadVideo } from '@/business/upload';
import {
  Icon,
  Image,
  Spinner,
  Text,
  TouchableOpacity,
  View,
} from '@/components/ui';
import { SERVER_IMAGE_ROOT } from '@/constants';
import { IVideo, IVideoThumbnail } from '@/global';
import { useMediaPreview } from '@/hooks';
import { handleVideoThumbnail } from '@/utils';
import { useEffect, useState } from 'react';
import ImagePreview from '../image-preview';
import VideoPreview from '../video-preview';
import VideoThumbnailImage from '../video-thumbnail-image';

// define props interface of components and use generic
interface UploadImagesProps<T = string> {
  value?: T[];
  onChange?: (value: T[]) => void;
  maxCount?: number;
  disabled?: boolean;
}

// upload progress state interface
interface UploadProgressState {
  isUploading: boolean;
  progress: number;
}

// use generic to define component
export const UploadImages = ({
  value = [],
  onChange,
  maxCount = 9,
  disabled = false,
}: UploadImagesProps) => {
  const {
    imagePreviewVisible,
    setImagePreviewVisible,
    imagePreviewIndex,
    setImagePreviewIndex,
  } = useMediaPreview();
  const [uploadProgress, setUploadProgress] = useState<UploadProgressState>({
    isUploading: false,
    progress: 0,
  });

  const handleAddImage = async () => {
    if (
      disabled ||
      (maxCount && value.length >= maxCount) ||
      uploadProgress.isUploading
    ) {
      return;
    }
    try {
      setUploadProgress({ isUploading: true, progress: 0 });
      const res = await uploadImage(
        {
          allowsEditing: true,
          aspect: [16, 10],
        },
        (progress) => {
          setUploadProgress({ isUploading: true, progress });
        }
      );
      if (!res) return;
      if (value instanceof Array) {
        onChange?.([...value, res]);
      } else {
        onChange?.([res]);
      }
    } catch (error) {
      console.log('上传图片失败:', error);
    } finally {
      setUploadProgress({ isUploading: false, progress: 0 });
    }
  };

  return (
    <View className='flex-row flex-wrap gap-4'>
      {/* image list */}
      {value && Array.isArray(value) && value.length > 0
        ? value.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setImagePreviewVisible(true);
                setImagePreviewIndex(index);
              }}
            >
              <Image
                src={item}
                className='w-32 h-20 rounded-md border-[1px] border-secondary-300'
              />
            </TouchableOpacity>
          ))
        : null}
      {/* add image */}
      {(!maxCount || value.length < maxCount) && (
        <TouchableOpacity
          className='w-32 h-20 bg-secondary-300 flex justify-center items-center rounded-md relative'
          onPress={handleAddImage}
          disabled={disabled || uploadProgress.isUploading}
        >
          {uploadProgress.isUploading ? (
            <View className='flex items-center justify-center'>
              <Spinner size='small' />
              <Text className='text-xs mt-1'>{uploadProgress.progress}%</Text>
            </View>
          ) : (
            <Icon as='AntDesign' name='plus' size={24} />
          )}
        </TouchableOpacity>
      )}
      {/* image preview */}
      <ImagePreview
        srcs={value}
        visible={imagePreviewVisible}
        onClose={() => setImagePreviewVisible(false)}
        index={imagePreviewIndex}
      />
    </View>
  );
};

// define upload videos props interface
interface UploadVideosProps {
  value?: IVideo;
  onChange?: (value: IVideo) => void;
  disabled?: boolean;
}

export const UploadVideos = ({
  value,
  onChange,
  disabled = false,
}: UploadVideosProps) => {
  const { videoPreviewVisible, setVideoPreviewVisible } = useMediaPreview();
  const [uploadProgress, setUploadProgress] = useState<UploadProgressState>({
    isUploading: false,
    progress: 0,
  });
  const [thumbnailInfo, setThumbnailInfo] = useState<IVideoThumbnail | null>(
    null
  );
  const [videoInfo, setVideoInfo] = useState<Omit<IVideo, 'thumbnail'> | null>(
    null
  );

  useEffect(
    () => {
      if (thumbnailInfo && videoInfo) {
        onChange?.({
          ...videoInfo,
          thumbnail: thumbnailInfo,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [thumbnailInfo, videoInfo]
  );

  const handleAddVideo = async () => {
    if (disabled || value?.path || uploadProgress.isUploading) {
      return;
    }
    try {
      setUploadProgress({ isUploading: true, progress: 0 });
      const res = await uploadVideo({
        onProgress(progress) {
          setUploadProgress({ isUploading: true, progress });
        },
        onThumbnailGenerated(thumbnail) {
          setThumbnailInfo(handleVideoThumbnail(thumbnail));
        },
      });
      if (!res) return;
      setVideoInfo(res);
    } finally {
      setUploadProgress({ isUploading: false, progress: 0 });
    }
  };

  return (
    <>
      {/* add video */}
      {!value?.path ? (
        <TouchableOpacity
          className='w-32 h-20 bg-secondary-300 flex justify-center items-center rounded-md relative'
          onPress={handleAddVideo}
          disabled={disabled || uploadProgress.isUploading}
        >
          {uploadProgress.isUploading ? (
            <View className='justify-center items-center'>
              <Spinner size={40} color='gray' className='absolute' />
              <Text className='text-xs scale-95'>
                {uploadProgress.progress}%
              </Text>
            </View>
          ) : (
            <Icon as='AntDesign' name='plus' size={24} />
          )}
        </TouchableOpacity>
      ) : (
        <VideoThumbnailImage
          width={thumbnailInfo?.width ?? 0}
          height={thumbnailInfo?.height ?? 0}
          path={thumbnailInfo?.path ?? ''}
          videoDuration={videoInfo?.duration ?? 0}
          handlePress={() => setVideoPreviewVisible(true)}
        />
      )}
      {videoPreviewVisible && (
        <VideoPreview
          source={SERVER_IMAGE_ROOT + videoInfo?.path}
          aspectRatio={videoInfo?.aspectRatio ?? 1}
          isOpen={videoPreviewVisible}
        />
      )}
    </>
  );
};
