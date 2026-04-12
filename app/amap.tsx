import { View } from '@/components/ui';
import { AmapView } from '@/native-modules';
import { useEffect } from 'react';
import { PermissionsAndroid } from 'react-native';

async function requestLocationPermission() {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
}

export default function Amap() {
  useEffect(() => {
    requestLocationPermission();
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <AmapView style={{ flex: 1 }} />
    </View>
  );
}
