import { formatVideoDuration } from '@/utils';
import { Icon, Image, Text, TouchableOpacity, View } from '../ui';

interface IProps {
  width: number;
  height: number;
  path: string;
  videoDuration: number;
  handlePress?: () => void;
}

export default function VideoThumbnailImage(props: IProps) {
  const { width, height, path, videoDuration, handlePress } = props;
  return (
    <TouchableOpacity
      className='relative'
      onPress={handlePress}
      style={{ width, height }}
    >
      <Image
        src={path}
        className='rounded-md'
        style={{
          width,
          height,
        }}
      />
      <View className='absolute inset-0 z-50 flex items-center justify-center'>
        <Icon as='Ionicons' name='play-circle-outline' size={36} color='white' />
        <Text className='text-white absolute right-2 bottom-0 text-sm'>
          {formatVideoDuration(videoDuration)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
