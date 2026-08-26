import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils';
import { tva } from '@gluestack-ui/utils/nativewind-utils';
import React from 'react';
import { View } from 'react-native';

const dividerStyle = tva({
  base: 'bg-background-200',
  variants: {
    orientation: {
      vertical: 'w-px h-full',
      horizontal: 'h-px w-full',
    },
  },
});

type IUIDividerProps = React.ComponentPropsWithoutRef<typeof View> &
  VariantProps<typeof dividerStyle>;

const Divider = React.forwardRef<
  React.ComponentRef<typeof View>,
  IUIDividerProps
>(function Divider({ className, orientation = 'horizontal', ...props }, ref) {
  return (
    <View
      ref={ref}
      {...props}
      aria-orientation={orientation}
      className={dividerStyle({
        orientation,
        class: className,
      })}
    />
  );
});

Divider.displayName = 'Divider';

export { Divider };
