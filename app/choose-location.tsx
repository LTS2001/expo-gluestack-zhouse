import {
  Button,
  ButtonText,
  Icon,
  Text,
  TouchableOpacity,
} from '@/components/ui';
import emitter, { EEventNameEnum } from '@/emitter';
import { ITencentMapLocation } from '@/global';
import { useNavigation } from '@react-navigation/native';
import { Asset } from 'expo-asset';
import { readAsStringAsync } from 'expo-file-system';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
export default function AddHouse() {
  const [html, setHtml] = useState('');
  const [location, setLocation] = useState<ITencentMapLocation | null>(null);
  const navigation = useNavigation();
  const { eventName } = useLocalSearchParams();
  useEffect(() => {
    loadHtmlFile();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          size='xs'
          action={location ? 'positive' : 'secondary'}
          disabled={!location}
          onPress={() => {
            if (typeof eventName === 'string') {
              emitter.emit(eventName as EEventNameEnum, location!);
            }
            router.back();
          }}
        >
          <ButtonText className='whitespace-nowrap'>确定</ButtonText>
        </Button>
      ),
      headerLeft: () => (
        <TouchableOpacity
          className='flex-row items-center gap-1'
          onPress={() => router.back()}
        >
          <Icon as='AntDesign' name='left' size={16} />
          <Text>返回</Text>
        </TouchableOpacity>
      ),
    });
  }, [location, navigation, eventName]);

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
