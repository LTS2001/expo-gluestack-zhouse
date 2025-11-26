import { WebrtcCallToolbar, WebrtcTimer } from '@/components';
import { Icon, Image, Text, TouchableOpacity } from '@/components/ui';
import { IChatSessionUser } from '@/global';
import { useWebrtc } from '@/hooks';
import { webrtcStore } from '@/stores';
import { router } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { Dimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RTCView } from 'react-native-webrtc';
const { height: SCREEN_HEIGHT } = Dimensions.get('screen');

const ChatWebrtc = () => {
  const {
    role,
    viewportTurn,
    localMediaStream,
    remoteMediaStream,
    isConnected,
    connectionStateText,
    facingModeTurn,
  } = webrtcStore;
  const insets = useSafeAreaInsets();
  const { offerUser, answerUser } = useWebrtc();

  const getOtherStructure = useCallback(
    (user: IChatSessionUser) => (
      <View className='justify-center items-center gap-4'>
        <Image src={user.headImg} size='lg' />
        <Text className='text-3xl font-bold text-white'>{user.name}</Text>
      </View>
    ),
    []
  );

  return (
    <View className='relative flex-1'>
      <View className='absolute inset-0 z-50' style={{ marginTop: insets.top }}>
        <TouchableOpacity
          className='absolute top-4 left-6 p-2'
          onPress={() => {
            router.back();
          }}
        >
          <Icon
            as='Feather'
            name='minimize-2'
            lightColor='white'
            darkColor='white'
            size={28}
          />
        </TouchableOpacity>
        {/* local video stream, default in small viewport  */}
        <View className='flex-1'>
          {/* calling user info */}
          {!isConnected && (
            <View style={{ marginTop: SCREEN_HEIGHT * 0.1 }}>
              {role === 'offer' && answerUser
                ? getOtherStructure(answerUser)
                : role === 'answer' && offerUser
                ? getOtherStructure(offerUser)
                : null}
            </View>
          )}
          <View className='mt-6 items-center gap-4'>
            {(role === 'offer' || (role === 'answer' && isConnected)) && (
              <WebrtcTimer />
            )}
            <Text className='text-white text-xl font-medium ml-2'>
              {connectionStateText}
            </Text>
          </View>
        </View>
        <View style={{ marginBottom: SCREEN_HEIGHT * 0.15 }} className='gap-16'>
          {/* call toolbar */}
          <WebrtcCallToolbar />
        </View>
      </View>
      {isConnected && !viewportTurn ? (
        // remote stream show
        <RTCView
          streamURL={remoteMediaStream?.toURL()}
          objectFit='cover'
          style={{ flex: 1 }}
          mirror={false}
        />
      ) : (
        // local stream show
        <RTCView
          streamURL={localMediaStream?.toURL()}
          objectFit='cover'
          style={{
            flex: 1,
          }}
          mirror={!facingModeTurn}
        />
      )}
    </View>
  );
};
export default observer(ChatWebrtc);
