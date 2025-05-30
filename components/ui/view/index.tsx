import { type VariantProps } from '@gluestack-ui/nativewind-utils';
import { tva } from '@gluestack-ui/nativewind-utils/tva';
import cls from 'classnames';
import React from 'react';
import { View as RNView, useColorScheme, ViewProps } from 'react-native';
const viewStyle = tva({});

type IViewProps = ViewProps &
  VariantProps<typeof viewStyle> & {
    className?: string;
    /**
     * add needShadow can help you add box shadow, and switch shadow color when you switch you theme
     */
    needShadow?: boolean;
  };

const View = React.forwardRef<React.ComponentRef<typeof RNView>, IViewProps>(
  function View({ className, needShadow, ...props }, ref) {
    const colorSchema = useColorScheme();
    const _className = cls([
      className,
      needShadow
        ? {
            'shadow-hard-1': colorSchema === 'light',
            'shadow-hard-4': colorSchema === 'dark',
          }
        : null,
    ]);
    return (
      <RNView
        ref={ref}
        {...props}
        className={viewStyle({ class: _className })}
      />
    );
  }
);

View.displayName = 'View';
export { View };
