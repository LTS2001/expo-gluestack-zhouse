import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { showToast } from '@/components/ui/toast';
import { View } from '@/components/ui/view';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Alert, Linking, Platform } from 'react-native';

export default function AddHouse() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [permissionStatus, setPermissionStatus] = useState<string>('');
  const [locationServiceEnabled, setLocationServiceEnabled] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [debugInfo, setDebugInfo] = useState<string>('');

  // 检查权限状态
  const checkPermissionStatus = async () => {
    try {
      setDebugInfo('检查权限状态...');
      const { status } = await Location.getForegroundPermissionsAsync();
      console.log('权限状态检查结果:', status);
      setPermissionStatus(status);
      setDebugInfo(`权限状态: ${status}`);
      return status;
    } catch (error) {
      console.error('检查权限状态失败:', error);
      setDebugInfo(`权限检查失败: ${error}`);
      return 'unknown';
    }
  };

  // 检查位置服务状态
  const checkLocationService = async () => {
    try {
      setDebugInfo('检查位置服务...');
      const isEnabled = await Location.hasServicesEnabledAsync();
      console.log('位置服务状态:', isEnabled);
      setLocationServiceEnabled(isEnabled);
      setDebugInfo(`位置服务: ${isEnabled ? '已开启' : '未开启'}`);
      return isEnabled;
    } catch (error) {
      console.error('检查位置服务失败:', error);
      setDebugInfo(`位置服务检查失败: ${error}`);
      return false;
    }
  };

  // 请求权限
  const requestPermission = async () => {
    try {
      setDebugInfo('请求位置权限...');
      console.log('开始请求位置权限...');
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log('权限请求结果:', status);
      setPermissionStatus(status);
      setDebugInfo(`权限请求结果: ${status}`);

      if (status !== 'granted') {
        Alert.alert(
          '需要位置权限',
          '此应用需要访问您的位置信息。请在设置中开启位置权限。',
          [
            { text: '取消', style: 'cancel' },
            {
              text: '去设置',
              onPress: () => {
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings:');
                } else {
                  Linking.openSettings();
                }
              },
            },
          ]
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error('请求权限失败:', error);
      setDebugInfo(`权限请求失败: ${error}`);
      return false;
    }
  };

  const getLocation = async () => {
    console.log('=== 开始获取位置流程 ===');
    setIsLoading(true);
    setDebugInfo('开始获取位置...');

    try {
      // 1. 检查位置服务
      console.log('1. 检查位置服务...');
      setDebugInfo('1. 检查位置服务...');
      const isServiceEnabled = await checkLocationService();
      if (!isServiceEnabled) {
        Alert.alert(
          '位置服务未开启',
          '请在系统设置中开启位置服务，然后重试。',
          [
            { text: '取消', style: 'cancel' },
            {
              text: '去设置',
              onPress: () => {
                if (Platform.OS === 'ios') {
                  Linking.openURL('App-Prefs:Privacy&path=LOCATION');
                } else {
                  Linking.openSettings();
                }
              },
            },
          ]
        );
        return;
      }

      // 2. 检查权限状态
      console.log('2. 检查权限状态...');
      setDebugInfo('2. 检查权限状态...');
      let status = await checkPermissionStatus();
      console.log('当前权限状态:', status);

      // 3. 如果没有权限，请求权限
      if (status !== 'granted') {
        console.log('3. 请求权限...');
        setDebugInfo('3. 请求权限...');
        const granted = await requestPermission();
        if (!granted) {
          console.log('权限被拒绝');
          setDebugInfo('权限被拒绝');
          return;
        }
        status = await checkPermissionStatus();
      }

      // 4. 再次确认位置服务
      console.log('4. 再次确认位置服务...');
      setDebugInfo('4. 再次确认位置服务...');
      const isEnabled = await checkLocationService();
      if (!isEnabled) {
        Alert.alert('位置服务未开启', '请在系统设置中开启位置服务。', [
          { text: '取消', style: 'cancel' },
          {
            text: '去设置',
            onPress: () => {
              if (Platform.OS === 'ios') {
                Linking.openURL('App-Prefs:Privacy&path=LOCATION');
              } else {
                Linking.openSettings();
              }
            },
          },
        ]);
        return;
      }

      // 5. 获取位置信息（添加超时）
      console.log('5. 开始获取位置...');
      setDebugInfo('5. 开始获取位置...');

      // 创建超时Promise
      // const timeoutPromise = new Promise((_, reject) => {
      //   setTimeout(() => {
      //     reject(new Error('获取位置超时，请检查网络连接或移动到信号更好的地方'));
      //   }, 30000); // 30秒超时
      // });

      // 位置获取Promise
      const locationPromise = Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Low, // 使用低精度，更快获取
      });

      // 竞争Promise
      const location = (await Promise.race([
        locationPromise,
      ])) as Location.LocationObject;

      console.log('位置获取成功:', location);
      setLocation(location);
      setDebugInfo('位置获取成功！');

      showToast({
        title: '位置获取成功',
      });
    } catch (error) {
      console.error('获取位置失败:', error);

      let errorMessage = '获取位置失败';
      let showSettings = false;

      if (error instanceof Error) {
        console.log('错误信息:', error.message);
        setDebugInfo(`错误: ${error.message}`);

        if (error.message.includes('Location service is disabled')) {
          errorMessage = '位置服务未开启，请在设置中开启';
          showSettings = true;
        } else if (
          error.message.includes('Location request timed out') ||
          error.message.includes('获取位置超时')
        ) {
          errorMessage = '获取位置超时，请检查网络连接或移动到信号更好的地方';
        } else if (error.message.includes('Location is unavailable')) {
          errorMessage = '当前位置不可用，请移动到信号更好的地方或检查位置服务';
          showSettings = true;
        } else if (error.message.includes('Permission denied')) {
          errorMessage = '位置权限被拒绝，请在设置中开启';
          showSettings = true;
        }
      }

      if (showSettings) {
        Alert.alert('位置获取失败', errorMessage, [
          { text: '取消', style: 'cancel' },
          {
            text: '去设置',
            onPress: () => {
              if (Platform.OS === 'ios') {
                Linking.openURL('App-Prefs:Privacy&path=LOCATION');
              } else {
                Linking.openSettings();
              }
            },
          },
        ]);
      } else {
        showToast({
          title: errorMessage,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const testSimpleLocation = async () => {
    console.log('=== 简单位置测试 ===');
    setDebugInfo('开始简单位置测试...');
    setIsLoading(true);

    try {
      // 直接尝试获取位置，不检查权限和服务
      setDebugInfo('直接获取位置...');
      const location = await Location.getCurrentPositionAsync({});
      console.log('简单测试成功:', location);
      setLocation(location);
      setDebugInfo('简单测试成功！');

      showToast({
        title: '简单测试成功',
      });
    } catch (error) {
      console.error('简单测试失败:', error);
      setDebugInfo(`简单测试失败: ${error}`);

      showToast({
        title: '简单测试失败',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 组件加载时检查状态
  useEffect(() => {
    console.log('组件加载，检查权限和服务状态...');
    setDebugInfo('组件加载中...');
    checkPermissionStatus();
    checkLocationService();
  }, []);

  return (
    <View className='flex-1 p-4'>
      <Text className='text-lg mb-4'>添加房屋</Text>

      <View className='mb-4 p-3 bg-gray-50 rounded-lg'>
        <Text className='text-sm text-gray-600 mb-2'>
          权限状态: {permissionStatus}
        </Text>
        <Text className='text-sm text-gray-600 mb-2'>
          位置服务: {locationServiceEnabled ? '已开启' : '未开启'}
        </Text>
        <Text className='text-sm text-gray-600 mb-2'>平台: {Platform.OS}</Text>
        <Text className='text-sm text-gray-600'>调试信息: {debugInfo}</Text>
      </View>

      <Button onPress={getLocation} className='mb-4' disabled={isLoading}>
        <ButtonText>{isLoading ? '获取中...' : '获取当前位置'}</ButtonText>
      </Button>

      <Button
        onPress={testSimpleLocation}
        className='mb-4'
        disabled={isLoading}
      >
        <ButtonText>简单位置测试</ButtonText>
      </Button>

      {location && (
        <View className='bg-gray-100 p-4 rounded-lg'>
          <Text className='font-bold mb-2'>位置信息:</Text>
          <Text>纬度: {location.coords.latitude.toFixed(6)}</Text>
          <Text>经度: {location.coords.longitude.toFixed(6)}</Text>
          <Text>精度: {location.coords.accuracy}米</Text>
          <Text>时间: {new Date(location.timestamp).toLocaleString()}</Text>
        </View>
      )}
    </View>
  );
}
