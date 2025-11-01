import { Icon } from '@/components/ui';
import { TAB_BAR_BADGE_COLOR } from '@/constants';
import { useTabBarBadgeNum } from '@/hooks';
import { Tabs } from 'expo-router';
import { useCallback } from 'react';
import { StyleProp, TextStyle } from 'react-native';

export default function Layout() {
  const getIconColor = useCallback(
    (focused: boolean) => (focused ? '#f2a536' : '#999'),
    []
  );

  const getTabBarBadgeText = useCallback<
    (n: number | undefined) => string | number | undefined
  >(
    (n: number | undefined = 0) =>
      n < 100 ? (n === 0 ? undefined : n) : `99+`,
    []
  );

  const getTabBarBadgeStyle = useCallback<
    (n: number | undefined) => StyleProp<TextStyle>
  >(
    (n: number | undefined = 0) => ({
      backgroundColor: TAB_BAR_BADGE_COLOR,
      color: '#fff',
      overflow: 'hidden',
      marginRight: n >= 100 ? -12 : n > 9 && n < 100 ? -8 : -7,
      fontSize: 10,
    }),
    []
  );

  const { mineNum, chatNum } = useTabBarBadgeNum();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#f2a536',
        headerTitleAlign: 'center',
        headerShown: true,
      }}
      initialRouteName='index'
    >
      <Tabs.Screen
        name='index'
        options={{
          title: '首页',
          tabBarIcon: ({ focused }) => (
            <Icon as='FontAwesome' name='home' color={getIconColor(focused)} />
          ),
        }}
      />
      <Tabs.Screen
        name='market'
        options={{
          title: '房屋市场',
          headerTitle: '',
          tabBarIcon: ({ focused }) => (
            <Icon
              as='MaterialIcons'
              name='home-repair-service'
              size={28}
              color={getIconColor(focused)}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='chat'
        options={{
          title: '消息',
          tabBarIcon: ({ focused }) => (
            <Icon
              as='MaterialIcons'
              name='message'
              color={getIconColor(focused)}
            />
          ),
          tabBarBadge: getTabBarBadgeText(chatNum),
          tabBarBadgeStyle: getTabBarBadgeStyle(chatNum),
        }}
      />
      <Tabs.Screen
        name='user'
        options={{
          title: '我的',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Icon as='FontAwesome' name='user' color={getIconColor(focused)} />
          ),
          tabBarBadge: getTabBarBadgeText(mineNum),
          tabBarBadgeStyle: getTabBarBadgeStyle(mineNum),
        }}
      />
    </Tabs>
  );
}
