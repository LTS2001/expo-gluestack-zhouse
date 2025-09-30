import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useEffect } from 'react';
import { BackHandler } from 'react-native';

interface IBackHandlerProps {
  /**
   * Whether to prevent the hardware back key event
   * @returns true to prevent, false to allow
   */
  onHardwareBack?: () => boolean;
  /**
   * Whether to prevent the gesture back event
   * @returns true to prevent, false to allow
   */
  onGestureBack?: () => boolean;
  /**
   * Whether to prevent the navigation back event
   * @returns true to prevent, false to allow
   */
  onNavigationBack?: () => boolean;
}
/**
 * Set three callbacks at the same time
 */
type TBackHandlerProps = () => boolean;

/**
 * Listen for all return key events
 */
export default function useBackHandlers(
  props: IBackHandlerProps | TBackHandlerProps
) {
  let options: IBackHandlerProps = {};
  if (typeof props === 'function')
    options = {
      onHardwareBack: props,
      onGestureBack: props,
      onNavigationBack: props,
    };
  else options = props;

  const { onHardwareBack, onGestureBack, onNavigationBack } = options;
  const navigation = useNavigation();

  // Listen for hardware back key events
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        return onHardwareBack ? onHardwareBack() : false;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );
      return () => subscription.remove();
    }, [onHardwareBack])
  );

  // Listen for all navigation events
  useEffect(() => {
    if (!navigation) return;
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      const action = e.data.action;

      let shouldPrevent = false;
      if (action.type === 'GO_BACK' || action.type === 'POP') {
        // Gesture back
        shouldPrevent = onGestureBack ? onGestureBack() : false;
      } else {
        // Other navigation operations
        shouldPrevent = onNavigationBack ? onNavigationBack() : false;
      }

      if (shouldPrevent) {
        e.preventDefault();
      }
    });

    return unsubscribe;
  }, [navigation, onGestureBack, onNavigationBack]);
}
