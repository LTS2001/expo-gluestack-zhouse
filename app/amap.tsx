import { Icon, TouchableOpacity, View } from '@/components/ui';
import { AmapView } from '@/native-modules';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { PermissionsAndroid } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

async function requestLocationPermission() {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
}

export default function Amap() {
  const insets = useSafeAreaInsets();
  useEffect(() => {
    requestLocationPermission();
  }, []);
  return (
    <View className='flex-1'>
      <View className='absolute left-0 flex-1 z-50' style={{ top: insets.top }}>
        <TouchableOpacity onPress={() => router.back()} className='bg-white w-10 h-10 rounded-full m-4 justify-center'>
          <Icon as='FontAwesome6' name='arrow-left' color='black' size={16} />
        </TouchableOpacity>
      </View>
      <AmapView style={{ flex: 1 }} />
    </View>
  );
}
