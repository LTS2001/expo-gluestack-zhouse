import { type VariantProps } from '@gluestack-ui/nativewind-utils';
import { tva } from '@gluestack-ui/nativewind-utils/tva';
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
  function View({ className, needShadow, style: _style, ...props }, ref) {
    const colorSchema = useColorScheme();
    return (
      <RNView
        ref={ref}
        {...props}
        className={viewStyle({ class: className })}
        style={Object.assign(
          needShadow
            ? {
                shadowColor: colorSchema === 'light' ? '#000' : '#fff',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 8,
                elevation: 8,
              }
            : {},
          _style
        )}
      />
    );
  }
);

View.displayName = 'View';
export { View };
