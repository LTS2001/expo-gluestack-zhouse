import { Icon } from '@/components/ui/icon';
import { Tabs } from 'expo-router';
import React from 'react';
export default function Layout() {
  const getIconColor = (focused: boolean) => focused ? '#f2a536' : '#999'

  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#f2a536',
      headerTitleAlign: 'center',
      headerShown: true
    }}>
      <Tabs.Screen
        name='index'
        options={{
          title: '首页',
          tabBarIcon: ({ focused }) => <Icon as='FontAwesome' name="home" color={getIconColor(focused)} />,
        }}
      />
      <Tabs.Screen
        name='market'
        options={{
          title: '房屋市场',
          tabBarIcon: ({ focused }) => <Icon as='MaterialIcons' name="home-repair-service" size={26} color={getIconColor(focused)} />
        }}
      />
      <Tabs.Screen
        name='chat'
        options={{
          title: '消息',
          tabBarIcon: ({ focused }) => <Icon as='MaterialIcons' name="message" color={getIconColor(focused)} />
        }}
      />
      <Tabs.Screen
        name='user'
        options={{
          title: '我的',
          headerShown: false,
          tabBarIcon: ({ focused }) => <Icon as='FontAwesome' name="user" color={getIconColor(focused)} />,
        }}
      />
    </Tabs>
  )
}
