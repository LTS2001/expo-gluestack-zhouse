import cls from 'classnames';
import { Href, router } from 'expo-router';
import { ReactNode } from 'react';
import { Icon } from '../ui/icon';
import { Text } from '../ui/text';
import { showToast } from '../ui/toast';
import { TouchableOpacity } from '../ui/touchable-opacity';
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
          <TouchableOpacity
            key={idx}
            activeOpacity={0.7}
            onPress={() => toDetail(domain.to as Href)}
          >
            <View
              className={cls([
                'flex-row justify-between mx-6 py-4 border-b-[1px] border-secondary-500 items-center bg-white',
                {
                  'border-t-[1px]': idx === 0,
                },
              ])}
            >
              <View className='flex-row items-center flex-1'>
                {domain.icon}
                <Text className='text-lg ml-2'>{domain.text}</Text>
              </View>
              {domain.notice ? (
                <Text className='bg-theme-primary text-white rounded-full px-2 text-sm py-0.5 mr-3'>
                  {domain.notice > 99 ? '99+' : domain.notice}
                </Text>
              ) : null}
              <Icon as='AntDesign' name='right' />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default Domain;
