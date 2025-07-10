import { Image } from '../ui/image';
import { Text } from '../ui/text';
import { View } from '../ui/view';
export default function Empty({ text }: { text?: string }) {
  return (
    <View className='flex-1 items-center justify-center'>
      <Image
        source={require('@/assets/images/empty.png')}
        size='lg'
        className='mb-4 ml-4 -mt-10'
      />
      <Text className='text-center mt-2'>{text || '暂无数据'}</Text>
    </View>
  );
}
