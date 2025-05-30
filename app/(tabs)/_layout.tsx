import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import React from 'react';
export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen
        name='index'
        options={{
          title: '首页',
          headerShown: true,
          headerTitleAlign: 'center',
          tabBarIcon: ({ focused }) => <FontAwesome name="home" size={24} color={focused ? '#f2a536' : 'black'} />,
          tabBarActiveTintColor: '#f2a536',
        }}
      />
      {/* <Tabs.Screen
        name='identity'
        options={{
          title: '身份选择',
          headerShown: false,
          tabBarIcon: 'person',
        }}
      /> */}
      <Tabs.Screen
        name='user'
        options={{
          title: '关于',
          headerShown: false,
          tabBarIcon: ({ focused }) => <FontAwesome name="user" size={24} color={focused ? '#f2a536' : 'black'} />,
          tabBarActiveTintColor: '#f2a536',
        }}
      />
    </Tabs>
  )
}
