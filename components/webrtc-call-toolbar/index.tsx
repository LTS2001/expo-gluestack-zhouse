import { addChatMessage, createAnswer, sendMessage } from '@/business';
import {
  CHAT_SIGN_LANDLORD,
  CHAT_SIGN_TENANT,
  ECHAT_MESSAGE_TYPE,
  ESocketMessageActionEnum,
  TENANT,
} from '@/constants';
import { chatStore, webrtcStore } from '@/stores';
import { formatVideoDuration } from '@/utils';
import cls from 'classnames';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { Icon, TouchableOpacity, View } from '../ui';

function WebrtcCallToolbar() {
  const {
    offer,
    role,
    localMediaStream,
    connectionState,
    isBackCam,
    isCameraOff,
    isMicOff,
    setConnectionState,
  } = webrtcStore;

  /**
   * handle audio open or close
   */
  const handleMicOff = useCallback(async () => {
    const { setIsMicOff, isMicOff } = webrtcStore;
    if (!localMediaStream) return;
    const audioTrack = await localMediaStream.getAudioTracks()[0];
    audioTrack.enabled = !audioTrack.enabled;
    setIsMicOff(!isMicOff);
  }, [localMediaStream]);

  /**
   * handle camera open or close
   */
  const handleCameraOff = useCallback(async () => {
    const { setIsCameraOff, isCameraOff } = webrtcStore;
    if (!localMediaStream) return;
    const videoTrack = localMediaStream.getVideoTracks()[0];
    videoTrack.enabled = !videoTrack.enabled;
    setIsCameraOff(!isCameraOff);
  }, [localMediaStream]);

  /**
   * handle switch front/back camera
   */
  const handleSwitchCameraFacingMode = useCallback(async () => {
    const { setIsBackCam, isBackCam, setFacingModeTurn } = webrtcStore;
    if (!localMediaStream) return;
    const _isFrontCam = isBackCam;
    const videoTrack = localMediaStream.getVideoTracks()[0];
    await videoTrack.applyConstraints({
      facingMode: _isFrontCam ? 'user' : 'environment',
    });
    // a facingModeTurn property of false indicates a "user" camera
    setFacingModeTurn(!_isFrontCam);
    setIsBackCam(!isBackCam);
  }, [localMediaStream]);

  const callToolbar = useMemo(() => {
    return [
      {
        icon: (
          <Icon
            as='Ionicons'
            name='mic-off-outline'
            size={28}
            lightColor={isMicOff ? undefined : 'white'}
            darkColor={isMicOff ? undefined : 'white'}
          />
        ),
        applyFlag: isMicOff,
        onPress: handleMicOff,
      },
      {
        icon: (
          <Icon
            as='MaterialCommunityIcons'
            name='camera-off-outline'
            size={28}
            lightColor={isCameraOff ? undefined : 'white'}
            darkColor={isCameraOff ? undefined : 'white'}
          />
        ),
        applyFlag: isCameraOff,
        onPress: handleCameraOff,
      },
      {
        icon: (
          <Icon
            as='MaterialCommunityIcons'
            name='camera-flip-outline'
            size={28}
            lightColor={isBackCam ? undefined : 'white'}
            darkColor={isBackCam ? undefined : 'white'}
          />
        ),
        applyFlag: isBackCam,
        onPress: handleSwitchCameraFacingMode,
      },
    ];
  }, [
    isMicOff,
    handleMicOff,
    isCameraOff,
    handleCameraOff,
    isBackCam,
    handleSwitchCameraFacingMode,
  ]);

  return (
    <>
      {/* call toolbar */}
      <View className='flex-row justify-around relative z-50'>
        {callToolbar.map((tool, idx) => {
          return (
            <TouchableOpacity
              key={idx}
              className={cls([
                'border p-3 rounded-3xl border-white',
                { 'bg-white': tool.applyFlag },
              ])}
              onPress={tool.onPress}
            >
              {tool.icon}
            </TouchableOpacity>
          );
        })}
      </View>
      {/* end call and connect call buttons */}
      <View className='flex-row justify-around'>
        <TouchableOpacity
          className='bg-error-600 p-4 rounded-3xl'
          onPress={async () => {
            const {
              webrtcSession,
              isConnected,
              callDuration,
              offerId,
              offerIdentity,
              answerId,
              answerIdentity,
            } = webrtcStore;
            const { senderId } = chatStore;
            if (role === 'answer') {
              sendMessage({
                toId: offerId!,
                toIdentity: offerIdentity!,
                active: ESocketMessageActionEnum.WebrtcHangup,
              });
              await addChatMessage(
                {
                  sessionId: webrtcSession?.id!,
                  senderId,
                  receiverId: `${
                    offerIdentity === TENANT
                      ? CHAT_SIGN_TENANT
                      : CHAT_SIGN_LANDLORD
                  },${offerId}`,
                  type: ECHAT_MESSAGE_TYPE.WEBRTC_VIDEO,
                  content: isConnected
                    ? `已结束 ${formatVideoDuration(callDuration * 1000)}`
                    : '已拒绝',
                },
                { msgIdCount: new Date().valueOf() }
              );
              sendMessage({
                toId: offerId!,
                toIdentity: offerIdentity!,
                active: ESocketMessageActionEnum.GetChatMessage,
              });
            } else {
              sendMessage({
                toId: answerId!,
                toIdentity: answerIdentity!,
                active: ESocketMessageActionEnum.WebrtcHangup,
              });
              await addChatMessage(
                {
                  sessionId: webrtcSession?.id!,
                  senderId,
                  receiverId: `${
                    answerIdentity === TENANT
                      ? CHAT_SIGN_TENANT
                      : CHAT_SIGN_LANDLORD
                  },${answerId}`,
                  type: ECHAT_MESSAGE_TYPE.WEBRTC_VIDEO,
                  content: isConnected
                    ? `已结束 ${formatVideoDuration(callDuration * 1000)}`
                    : '已取消',
                },
                { msgIdCount: new Date().valueOf() }
              );
              sendMessage({
                toId: answerId!,
                toIdentity: answerIdentity!,
                active: ESocketMessageActionEnum.GetChatMessage,
              });
            }
            setConnectionState('closed');
          }}
        >
          <Icon
            as='Feather'
            name='phone-off'
            size={30}
            darkColor='white'
            lightColor='white'
          />
        </TouchableOpacity>
        {role === 'answer' && connectionState === 'new' && (
          <TouchableOpacity
            className='bg-success-500 p-4 rounded-3xl'
            onPress={() => {
              if (offer) {
                createAnswer(offer);
              }
            }}
          >
            <Icon
              as='Feather'
              name='phone-call'
              size={30}
              darkColor='white'
              lightColor='white'
            />
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}

export default observer(WebrtcCallToolbar);
