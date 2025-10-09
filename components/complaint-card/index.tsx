import {
  COMPLAINT_COMPLETE,
  COMPLAINT_DEL,
  COMPLAINT_PENDING,
  SERVER_IMAGE_ROOT,
} from '@/constants';
import { IVideo } from '@/global';
import { useMediaPreview } from '@/hooks';
import { formatUtcTime } from '@/utils';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import ImagePreview from '../image-preview';
import Tag from '../tag';
import { Image, Text, TouchableOpacity, View } from '../ui';
import VideoPreview from '../video-preview';
import VideoThumbnailImage from '../video-thumbnail-image';

interface IProps {
  status: number;
  reason: string;
  createdAt: Date;
  updatedAt: Date;
  images: string[];
  video: IVideo;
  FooterSlotComp?: React.ReactNode;
  isSlot?: boolean;
}
function ComplaintCard(props: IProps) {
  const {
    status,
    reason,
    createdAt,
    updatedAt,
    images,
    video,
    FooterSlotComp,
    isSlot,
  } = props;
  const [statusTag, setStatusTag] = useState({ tag: '', bg: '' });
  const {
    videoPreviewVisible,
    setVideoPreviewVisible,
    imagePreviewVisible,
    setImagePreviewVisible,
    imagePreviewIndex,
    setImagePreviewIndex,
  } = useMediaPreview();

  useEffect(() => {
    if (status === COMPLAINT_COMPLETE) {
      setStatusTag({
        tag: '已处理',
        bg: 'bg-primary-0',
      });
    } else if (status === COMPLAINT_DEL) {
      setStatusTag({
        tag: '已删除',
        bg: 'bg-primary-0',
      });
    } else if (status === COMPLAINT_PENDING) {
      setStatusTag({
        tag: '未处理',
        bg: 'bg-theme-primary',
      });
    }
  }, [status]);

  return (
    <View>
      <View className='mx-3 rounded-lg p-4 bg-background-0 gap-4' needShadow>
        <View className='flex-row gap-4 justify-between items-center'>
          <Text>状态</Text>
          <Tag content={statusTag.tag} bgColor={statusTag.bg} expand />
        </View>
        <View className='gap-6'>
          <View className='flex-row'>
            <Text>投诉/建议问题描述：</Text>
            <Text>{reason}</Text>
          </View>
          <View className='flex-row gap-2 flex-wrap'>
            {images?.map((url: string, i: number) => (
              <TouchableOpacity
                onPress={() => {
                  setImagePreviewVisible(true);
                  setImagePreviewIndex(i);
                }}
                key={i}
              >
                <Image src={url} className='w-32 h-20' />
              </TouchableOpacity>
            ))}
          </View>
          {video?.thumbnail.path && (
            <VideoThumbnailImage
              width={video?.thumbnail.width}
              height={video?.thumbnail.height}
              path={video?.thumbnail.path}
              videoDuration={video.duration}
              handlePress={() => {
                setVideoPreviewVisible(true);
              }}
            />
          )}
          <View className='gap-2'>
            <View className='flex-row items-center'>
              <Text>投诉/建议日期：</Text>
              <Text>{formatUtcTime(createdAt)}</Text>
            </View>
            {[COMPLAINT_COMPLETE, COMPLAINT_DEL].includes(status) ? (
              <View className='flex-row items-center'>
                <Text>投诉/建议处理完成日期：</Text>
                <Text>{formatUtcTime(updatedAt)}</Text>
              </View>
            ) : null}
          </View>
        </View>
        {isSlot ? FooterSlotComp : null}
      </View>
      <ImagePreview
        srcs={images}
        visible={imagePreviewVisible}
        index={imagePreviewIndex}
        onClose={() => setImagePreviewVisible(false)}
      />
      {videoPreviewVisible ? (
        <VideoPreview
          source={SERVER_IMAGE_ROOT + video?.path}
          aspectRatio={video?.aspectRatio ?? 1}
          isOpen={videoPreviewVisible}
        />
      ) : null}
    </View>
  );
}

export default observer(ComplaintCard);
