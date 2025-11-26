import { useWebrtcLife } from '@/hooks';
import { webrtcStore } from '@/stores';
import { router } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useMemo, useRef } from 'react';
import { Animated, Dimensions, PanResponder } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RTCView } from 'react-native-webrtc';
import { TouchableOpacity } from '../ui';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('screen');
const FLOATING_WINDOW_WIDTH = SCREEN_WIDTH * 0.25 + 4;
const FLOATING_WINDOW_HEIGHT = SCREEN_HEIGHT * 0.2 + 4;
const FLOATING_MOVE_MIDDLE_LINE =
  (SCREEN_WIDTH - FLOATING_WINDOW_WIDTH) / 2 - 8;
const FLOATING_LEFT_BOUNDARY = -(SCREEN_WIDTH - 16 - FLOATING_WINDOW_WIDTH);
const FLOATING_BOTTOM_BOUNDARY = SCREEN_HEIGHT - FLOATING_WINDOW_HEIGHT * 1.5;
/**
 * this component is registered in the "app/_layout.tsx"
 */
function WebrtcFloatWindow() {
  const {
    viewportTurn,
    setViewportTurn,
    localMediaStream,
    remoteMediaStream,
    showFloatWindow,
    isWebrtcPage,
    isConnected,
    facingModeTurn,
  } = webrtcStore;
  useWebrtcLife();
  const insets = useSafeAreaInsets();
  const pan = useRef(
    new Animated.ValueXY({
      x: 0,
      y: 0,
    })
  ).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5,
      onPanResponderGrant: () => {
        // when starting a new drag, stop the animation and get the current actual position (including offset).
        pan.stopAnimation(() => {
          // get the current actual position (value + offset)
          const currentX = (pan.x as any).__getValue?.() ?? 0;
          const currentY = (pan.y as any).__getValue?.() ?? 0;
          /**
           * set the current actual position to offset and reset the value to 0.
           * in this way, Animated.event will accumulate dx and dy from this position.
           */
          pan.setOffset({ x: currentX, y: currentY });
          pan.setValue({ x: 0, y: 0 });
        });
      },
      onPanResponderMove: (evt, gestureState) => {
        Animated.event([null, { dx: pan.x, dy: pan.y }], {
          useNativeDriver: false,
        })(evt, gestureState);
      },
      onPanResponderRelease: () => {
        // merge offset to value first, and then get the merged value.
        pan.flattenOffset();
        // use the __getValue method to get the current animation value (this is the internal method of react native animated)
        const currentX = (pan.x as any).__getValue?.() ?? 0;
        const currentY = (pan.y as any).__getValue?.() ?? 0;
        // judging which side the floating window is closer to based on the center line of the screen width
        const adsorbX =
          FLOATING_MOVE_MIDDLE_LINE > Math.abs(currentX)
            ? 0
            : FLOATING_LEFT_BOUNDARY;
        const adsorbY =
          currentY < 0
            ? 0
            : currentY > FLOATING_BOTTOM_BOUNDARY
            ? FLOATING_BOTTOM_BOUNDARY
            : currentY;
        Animated.spring(pan, {
          toValue: { x: adsorbX, y: adsorbY },
          useNativeDriver: false,
          tension: 50,
          friction: 7,
        }).start(() => {
          pan.extractOffset();
        });
      },
    })
  ).current;

  /**
   * this condition determines whether it is a front camera.
   */
  const $frontCameraCondition = useMemo(
    () =>
      (isWebrtcPage && isConnected && !viewportTurn && !facingModeTurn) ||
      (!isWebrtcPage && !isConnected && !facingModeTurn),
    [isWebrtcPage, isConnected, viewportTurn, facingModeTurn]
  );

  /**
   * this candition determines whether it is a local media stream
   */
  const $localMediaStream = useMemo(
    () =>
      (isWebrtcPage && isConnected && !viewportTurn) ||
      (!isWebrtcPage && !isConnected)
        ? localMediaStream?.toURL()
        : remoteMediaStream?.toURL(),
    [
      isWebrtcPage,
      isConnected,
      viewportTurn,
      localMediaStream,
      remoteMediaStream,
    ]
  );

  return (
    showFloatWindow && (
      <Animated.View
        style={{
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
          borderRadius: 8,
          position: 'absolute',
          top: insets.top + 12,
          right: 8,
          backgroundColor: 'white',
          width: FLOATING_WINDOW_WIDTH,
          height: FLOATING_WINDOW_HEIGHT,
          padding: 2,
          zIndex: 999,
        }}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          style={{ borderRadius: 8, overflow: 'hidden' }}
          onPress={() => {
            if (isWebrtcPage) {
              setViewportTurn(!viewportTurn);
            } else {
              router.push('/chat-webrtc');
            }
          }}
        >
          <RTCView
            streamURL={$localMediaStream}
            objectFit='cover'
            style={{
              width: FLOATING_WINDOW_WIDTH - 4,
              height: FLOATING_WINDOW_HEIGHT - 4,
            }}
            zOrder={1}
            mirror={$frontCameraCondition}
          />
        </TouchableOpacity>
      </Animated.View>
    )
  );
}
export default observer(WebrtcFloatWindow);
