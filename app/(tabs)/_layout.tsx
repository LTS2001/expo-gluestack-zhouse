import { Icon } from '@/components/ui/icon';
import { Tabs } from 'expo-router';
export default function Layout() {
  const getIconColor = (focused: boolean) => (focused ? '#f2a536' : '#999');

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
          tabBarBadge: '92',
          tabBarBadgeStyle: {
            backgroundColor: '#f2a536',
            color: '#fff',
            overflow: 'hidden',
            marginRight: -8,
            fontSize: 10,
          },
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
          tabBarBadge: '92',
          tabBarBadgeStyle: {
            backgroundColor: '#f2a536',
            color: '#fff',
            overflow: 'hidden',
            marginRight: -8,
            fontSize: 10,
          },
        }}
      />
    </Tabs>
  );
}
