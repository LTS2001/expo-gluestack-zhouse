import { useEffect, useState } from 'react';
import { Keyboard, KeyboardEvent, Platform } from 'react-native';
import { useKeyboardHandler } from 'react-native-keyboard-controller';
import {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

interface IUseKeyboardHeightProps {
  handleKeyboardHeightChange?: () => void;
  offsetY?: number;
}

export default function useKeyboardHeight(props?: IUseKeyboardHeightProps) {
  const { handleKeyboardHeightChange = () => {}, offsetY = 0 } = props || {};
  const keyboardControllerHeight = useSharedValue(0);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const onShow = (e: KeyboardEvent) => {
      setKeyboardHeight(e.endCoordinates.height);
    };
    const onHide = () => {
      setKeyboardHeight(0);
    };

    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useKeyboardHandler(
    {
      onMove: (event) => {
        'worklet';
        keyboardControllerHeight.set(Math.max(event.height, 0));
      },
    },
    []
  );

  const fakeView = useAnimatedStyle(() => {
    const _value = keyboardControllerHeight.get() + offsetY;
    return {
      paddingBottom: Math.abs(_value > 0 ? _value : 0),
    };
  }, []);

  // when keyboard height changes, chat area scroll to bottom
  useAnimatedReaction(
    () => keyboardControllerHeight.get(),
    (currentValue, previousValue) => {
      if (currentValue !== previousValue && currentValue > 0) {
        scheduleOnRN(handleKeyboardHeightChange);
      }
    },
    []
  );

  return { keyboardHeight, fakeView };
}
