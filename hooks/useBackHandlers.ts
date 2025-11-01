import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useRef } from 'react';
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
  let isSingleFunction = false;

  if (typeof props === 'function') {
    isSingleFunction = true;
    options = {
      onHardwareBack: props,
      onGestureBack: props,
      onNavigationBack: props,
    };
  } else {
    options = props;
  }

  const { onHardwareBack, onGestureBack, onNavigationBack } = options;
  const navigation = useNavigation();
  const hasExecuted = useRef(false);
  const firstResult = useRef<boolean>(false);

  // Listen for hardware back key events
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (isSingleFunction) {
          // single function case: need to prevent duplication and remember the result
          if (hasExecuted.current) {
            return firstResult.current;
          }
          if (onHardwareBack) {
            const result = onHardwareBack();
            hasExecuted.current = true;
            firstResult.current = result;
            // Reset after a short delay to allow for next navigation
            setTimeout(() => {
              hasExecuted.current = false;
              firstResult.current = false;
            }, 100);
            return result;
          }
          return false;
        } else {
          // multiple different functions case: directly execute
          return onHardwareBack ? onHardwareBack() : false;
        }
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );
      return () => subscription.remove();
    }, [onHardwareBack, isSingleFunction])
  );

  // Listen for all navigation events
  useEffect(() => {
    if (!navigation) return;
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      const action = e.data.action;
      let shouldPrevent = firstResult.current;

      if (isSingleFunction) {
        // single function case: need to prevent duplication and remember the result
        if (!hasExecuted.current) {
          if (action.type === 'GO_BACK' || action.type === 'POP') {
            // Gesture back
            if (onGestureBack) {
              shouldPrevent = onGestureBack();
              hasExecuted.current = true;
              firstResult.current = shouldPrevent;
              setTimeout(() => {
                hasExecuted.current = false;
                firstResult.current = false;
              }, 100);
            }
          } else {
            // Other navigation operations
            if (onNavigationBack) {
              shouldPrevent = onNavigationBack();
              hasExecuted.current = true;
              firstResult.current = shouldPrevent;
              setTimeout(() => {
                hasExecuted.current = false;
                firstResult.current = false;
              }, 100);
            }
          }
        }
      } else {
        // multiple different functions case: directly execute
        if (action.type === 'GO_BACK' || action.type === 'POP') {
          // Gesture back
          shouldPrevent = onGestureBack ? onGestureBack() : false;
        } else {
          // Other navigation operations
          shouldPrevent = onNavigationBack ? onNavigationBack() : false;
        }
      }

      if (shouldPrevent) {
        e.preventDefault();
      }
    });

    return unsubscribe;
  }, [navigation, onGestureBack, onNavigationBack, isSingleFunction]);
}
