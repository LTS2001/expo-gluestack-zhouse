import {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Fontisto,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
  Zocial,
} from '@expo/vector-icons';
import { type VariantProps } from '@gluestack-ui/nativewind-utils';
import { tva } from '@gluestack-ui/nativewind-utils/tva';
import React from 'react';
import { View as RNView, useColorScheme, ViewProps } from 'react-native';

// create icon map
const IconComponents = {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Fontisto,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
  Zocial,
} as const;

// icon type
type IconType = keyof typeof IconComponents;

// icon component props
interface IconProps {
  as: IconType;
  name: string;
  size?: number;
  color?: string;
  lightColor?: string;
  darkColor?: string;
}
const viewStyle = tva({
  base: 'self-center',
  variants: {
    position: {
      start: 'self-start',
      end: 'self-end',
    },
  },
});

type IViewProps = ViewProps &
  VariantProps<typeof viewStyle> & { className?: string };

export const Icon = React.forwardRef<
  React.ComponentRef<typeof RNView>,
  IconProps & IViewProps
>(
  (
    {
      as,
      name,
      size,
      color,
      lightColor = '#888',
      darkColor = '#ccc',
      className,
      position,
      ...props
    },
    ref
  ) => {
    const theme = useColorScheme();
    const IconComponent = IconComponents[as];
    if (!IconComponent) {
      console.warn(`Icon ${as} not found`);
      return null;
    }
    return (
      <RNView
        ref={ref}
        className={viewStyle({ class: className, position })}
        {...props}
      >
        <IconComponent
          name={name}
          size={size ?? 24}
          color={color ? color : theme === 'light' ? lightColor : darkColor}
        />
      </RNView>
    );
  }
);

Icon.displayName = 'Icon';
export type { IconProps };
