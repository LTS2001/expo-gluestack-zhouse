import cls from 'classnames';
import { Href, router } from 'expo-router';
import { ReactNode } from 'react';
import { Icon } from '../ui/icon';
import { Text } from '../ui/text';
import { showToast } from '../ui/toast';
import { View } from '../ui/view';
interface IProps {
  domainList: {
    icon: ReactNode;
    to: string;
    text: string;
    notice: number;
  }[];
  isLogin: boolean;
}
const Domain = (props: IProps) => {
  const { domainList, isLogin } = props;
  /**
   * 去功能区详细页面
   * @param url 页面路径
   */
  const toDetail = (url: Href) => {
    if (!isLogin) {
      showToast({
        title: '请先登录！',
      });
      return;
    }
    router.push(url);
  };

  return (
    <View className='mt-6'>
      {domainList.map((domain, idx) => {
        return (
          <View
            key={idx}
            onTouchEnd={() => toDetail(domain.to as Href)}
            className={cls([
              'flex-row justify-between mx-6 py-4 border-b-[1px] border-secondary-500',
              {
                'border-t-[1px]': idx === 0,
              },
            ])}
          >
            <View className='flex-row items-center' pointerEvents='none'>
              {domain.icon}
              <Text className='text-lg ml-2'>{domain.text}</Text>
              {domain.notice ? <Text>{domain.notice}</Text> : null}
            </View>
            <Icon as='AntDesign' name='right' />
          </View>
        );
      })}
    </View>
  );
};

export default Domain;
