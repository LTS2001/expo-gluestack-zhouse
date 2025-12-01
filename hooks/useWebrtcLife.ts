import { closeConnection, handleAnswer, handleIceCandidate } from '@/business';
import { showToast } from '@/components/ui';
import emitter, { EEventNameEnum } from '@/emitter';
import { webrtcStore } from '@/stores';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
/**
 * 1. used under the watch of mobx
 * 2. the life cycle of this component is accompanied by the "webrtc-floating-window.tsx" component
 */
export default function useWebrtcLife() {
  const { connectionState, isWebrtcPage } = webrtcStore;
  const connectedTextTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  /**
   * watch the change of the connection state to calc the call duration
   */
  useEffect(() => {
    const { setCallDuration, callIntervalTimer, setCallIntervalTimer } =
      webrtcStore;
    if (['connected', 'new'].includes(connectionState)) {
      if (!callIntervalTimer) {
        const timer = setInterval(() => {
          setCallDuration(webrtcStore.callDuration + 1);
        }, 1000);
        setCallIntervalTimer(timer);
      }
    }
    /**
     * as long as the floating window is still there, the timer has to keep counting
     */
    return () => {
      const { callIntervalTimer, clearCallIntervalTimer, clearCallDuration } =
        webrtcStore;
      if (callIntervalTimer) {
        clearCallDuration();
        clearCallIntervalTimer();
      }
    };
  }, [connectionState]);

  /**
   * watch the change of the connection state
   */
  useEffect(() => {
    const {
      role,
      setShowFloatWindow,
      isConnected,
      setIsConnected,
      setConnectionStateText,
    } = webrtcStore;
    setShowFloatWindow(false);
    if (['new', 'connecting', 'connected'].includes(connectionState)) {
      let stateText = '';
      switch (connectionState) {
        case 'new':
          if (!isWebrtcPage) setShowFloatWindow(true);
          stateText = role === 'offer' ? '呼叫中...' : '';
          break;
        case 'connecting':
          if (!isWebrtcPage) setShowFloatWindow(true);
          stateText = '连接中...';
          break;
        case 'connected':
          setShowFloatWindow(true);
          if (!isConnected) {
            stateText = '已连接...';
            connectedTextTimerRef.current = setTimeout(() => {
              setConnectionStateText('');
            }, 3000);
            setIsConnected(true);
          }
          break;
      }
      setConnectionStateText(stateText);
    } else if (['closed', 'failed'].includes(connectionState)) {
      setIsConnected(false);
      switch (connectionState) {
        case 'closed':
          break;
        case 'failed':
          showToast({ title: '网络连接失败' });
          break;
      }
      closeConnection();
      if (isWebrtcPage) {
        // check whether you can return to avoid the error when the navigation stack is empty
        if (router.canGoBack()) {
          router.back();
        } else {
          // if not, navigate to the chat list page
          router.replace('/(tabs)/chat');
        }
      }
    }

    return () => {
      const { peerConnection, setShowFloatWindow } = webrtcStore;
      if (connectedTextTimerRef.current)
        clearTimeout(connectedTextTimerRef.current);
      if (peerConnection) {
        setShowFloatWindow(true);
      }
    };
  }, [connectionState, isWebrtcPage]);

  /**
   * subscribe this events to change peer to peer data each other
   */
  useEffect(() => {
    emitter.on(EEventNameEnum.WebrtcAnswer, (data) => {
      handleAnswer(JSON.parse(data));
    });
    emitter.on(EEventNameEnum.WebrtcOfferIce, (data) => {
      handleIceCandidate(JSON.parse(data));
    });
    emitter.on(EEventNameEnum.WebrtcAnswerIce, (data) => {
      handleIceCandidate(JSON.parse(data));
    });

    return () => {
      emitter.off(EEventNameEnum.WebrtcAnswer);
      emitter.off(EEventNameEnum.WebrtcOfferIce);
      emitter.off(EEventNameEnum.WebrtcAnswerIce);
    };
  }, []);
}
