import { HouseToRepairMap, SERVER_IMAGE_ROOT } from '@/constants';
import { IVideo } from '@/global';
import { useMediaPreview } from '@/hooks';
import { formatUtcTime } from '@/utils';
import ImagePreview from '../image-preview';
import Tag from '../tag';
import { Image, Text, TouchableOpacity, View } from '../ui';
import VideoPreview from '../video-preview';
import VideoThumbnailImage from '../video-thumbnail-image';
interface IProps {
  key?: number;
  houseName: string;
  status: number;
  reason: string;
  createdAt: Date;
  updatedAt: Date;
  images?: string[];
  video?: IVideo;
  FooterSlotComp?: React.ReactNode;
  isSlot?: boolean;
}
export default function RepairCard(props: IProps) {
  const {
    houseName,
    status,
    reason,
    createdAt,
    updatedAt,
    images,
    video,
    FooterSlotComp,
    isSlot,
  } = props;
  const {
    videoPreviewVisible,
    setVideoPreviewVisible,
    imagePreviewVisible,
    setImagePreviewVisible,
    imagePreviewIndex,
    setImagePreviewIndex,
  } = useMediaPreview();

  return (
    <View>
      <View className='mx-3 rounded-lg p-4 bg-background-0 gap-4' needShadow>
        <View className='flex-row gap-4 justify-between'>
          <Text className='text-primary-400 text-2xl font-bold'>
            {houseName}
          </Text>
          <Tag
            content={
              status === HouseToRepairMap.REPAIR_COMPLETE ? '已维修' : '维修中'
            }
            bgColor={
              status === HouseToRepairMap.REPAIR_COMPLETE
                ? 'bg-primary-0'
                : 'bg-theme-primary'
            }
            expand
            className='rounded-lg'
          />
        </View>
        <View className='flex-row items-center'>
          <Text>问题描述：</Text>
          <Text>{reason}</Text>
        </View>
        <View className='gap-6'>
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
          <View>
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
          </View>
        </View>
        <View className='flex-row items-center'>
          <Text>报修申请日期：</Text>
          <Text>{formatUtcTime(createdAt)}</Text>
        </View>
        {status === HouseToRepairMap.REPAIR_COMPLETE ? (
          <View className='flex-row items-center -mt-4'>
            <Text>完成维修日期：</Text>
            <Text>{formatUtcTime(updatedAt)}</Text>
          </View>
        ) : null}
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
