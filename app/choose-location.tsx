import { Button, ButtonText } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { ITencentMapLocation } from '@/global';
import locationStore from '@/stores/location';
import { useNavigation } from '@react-navigation/native';
import { Asset } from 'expo-asset';
import { readAsStringAsync } from 'expo-file-system';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

export default function AddHouse() {
  const { setTitle, setAddress, setLatitude, setLongitude } = locationStore;
  const [html, setHtml] = useState('');
  const [location, setLocation] = useState<ITencentMapLocation | null>(null);
  const navigation = useNavigation();
  useEffect(() => {
    loadHtmlFile();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          size='xs'
          action='positive'
          onPress={() => {
            setTitle(location?.poiname ?? '');
            setAddress(location?.poiaddress ?? '');
            setLatitude(location?.latlng.lat ?? 0);
            setLongitude(location?.latlng.lng ?? 0);
            router.back();
          }}
        >
          <ButtonText className='whitespace-nowrap'>确定</ButtonText>
        </Button>
      ),
      headerLeft: () => (
        <View
          className='flex-row items-center gap-1'
          onTouchEnd={() => router.back()}
        >
          <Icon as='AntDesign' name='left' size={16} />
          <Text>返回</Text>
        </View>
      ),
    });
  }, [location, navigation, setTitle, setAddress, setLatitude, setLongitude]);

  const loadHtmlFile = async () => {
    const asset = await Asset.loadAsync(
      require('@/assets/htmls/choose-localtion.html')
    );
    if (!asset[0].localUri) return;
    const html = await readAsStringAsync(asset[0].localUri);
    setHtml(html);
  };

  const handleMessage = (event: WebViewMessageEvent) => {
    const data: ITencentMapLocation = JSON.parse(event.nativeEvent.data);
    setLocation(data);
  };

  return (
    <WebView
      style={{ height: '100%', width: '100%' }}
      source={{
        html,
      }}
      onMessage={handleMessage}
    />
  );
}
