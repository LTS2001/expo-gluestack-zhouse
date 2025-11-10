import cls from 'classnames';
import { Spinner } from '../spinner';
import { Text } from '../text';
import { View } from '../view';
interface IProps {
  progress: number;
  color?: 'gray' | 'white';
}
export default function UploadProgress(props: IProps) {
  const { progress, color = 'gray' } = props;
  return (
    <View className='justify-center items-center'>
      <Spinner size={40} color={color} className='absolute' />
      <Text
        className={cls('text-xs scale-95', { 'text-white': color === 'white' })}
      >
        {progress}%
      </Text>
    </View>
  );
}
