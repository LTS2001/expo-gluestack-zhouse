import cls from 'classnames';
import { Text } from '../ui/text';
import { View } from '../ui/view';

interface IProps {
  content: string;
  className?: string;
  bgColor?: string;
  textSize?: 'text-sm' | 'text-md' | 'text-lg';
  expand?: boolean;
}

const Tag = (props: IProps) => {
  const {
    content,
    className,
    bgColor = 'bg-theme-primary',
    textSize = 'text-sm',
    expand = false,
  } = props;
  return (
    <View
      className={cls(
        'rounded-md flex items-center justify-center',
        className,
        bgColor,
        {
          'w-6 h-6': !expand,
          'py-0.5 px-2': expand,
        }
      )}
    >
      <Text className={cls('text-white leading-none', textSize)}>
        {expand ? content : content[0]}
      </Text>
    </View>
  );
};
export default Tag;
