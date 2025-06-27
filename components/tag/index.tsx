import cls from 'classnames';
import { Text } from '../ui/text';
import { View } from '../ui/view';

interface IProps {
  content: string;
  className?: string;
  bgColor?: string;
  textSize?: 'text-sm' | 'text-md' | 'text-lg';
}

const Tag = (props: IProps) => {
  const {
    content,
    className,
    bgColor = 'bg-theme-primary',
    textSize = 'text-sm',
  } = props;
  return (
    <View
      className={cls(
        'rounded-md w-6 h-6 flex items-center justify-center',
        className,
        bgColor
      )}
    >
      <Text className={cls('text-white leading-none', textSize)}>
        {content[0]}
      </Text>
    </View>
  );
};
export default Tag;
