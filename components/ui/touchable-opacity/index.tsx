import { type VariantProps } from '@gluestack-ui/nativewind-utils';
import { tva } from '@gluestack-ui/nativewind-utils/tva';
import React from 'react';
import {
  TouchableOpacity as RNTouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
const touchableOpacityStyle = tva({});

type ITouchableOpacityProps = TouchableOpacityProps &
  VariantProps<typeof touchableOpacityStyle> & {
    className?: string;
    /**
     * add needShadow can help you add box shadow, and switch shadow color when you switch you theme
     */
    needShadow?: boolean;
  };

const TouchableOpacity = React.forwardRef<
  React.ComponentRef<typeof RNTouchableOpacity>,
  ITouchableOpacityProps
>(function TouchableOpacity(
  { className, style: _style, activeOpacity = 1, ...props },
  ref
) {
  return (
    <RNTouchableOpacity
      ref={ref}
      {...props}
      activeOpacity={activeOpacity}
      className={touchableOpacityStyle({ class: className })}
      style={_style}
    />
  );
});

TouchableOpacity.displayName = 'TouchableOpacity';
export { TouchableOpacity };
