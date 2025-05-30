'use client';
import { createImage } from '@gluestack-ui/image';
import type { VariantProps } from '@gluestack-ui/nativewind-utils';
import { tva } from '@gluestack-ui/nativewind-utils/tva';
import cls from 'classnames';
import React from 'react';
import { Platform, Image as RNImage, useColorScheme } from 'react-native';

const imageStyle = tva({
  base: 'max-w-full',
  variants: {
    size: {
      '2xs': 'h-6 w-6',
      xs: 'h-10 w-10',
      sm: 'h-16 w-16',
      md: 'h-20 w-20',
      lg: 'h-24 w-24',
      xl: 'h-32 w-32',
      '2xl': 'h-44 w-44',
      '3xl': 'h-72 w-72',
      '4xl': 'h-80 w-80',
      full: 'h-full w-full',
      none: '',
    },
  },
});

const UIImage = createImage({ Root: RNImage });

type ImageProps = VariantProps<typeof imageStyle> &
  React.ComponentProps<typeof UIImage>;
const Image = React.forwardRef<
  React.ComponentRef<typeof UIImage>,
  ImageProps & {
    className?: string;
    /**
     * add needShadow can help you add box shadow, and switch shadow color when you switch you theme
     */
    needShadow?: boolean;
  }
>(function Image({ size = 'md', className, needShadow, ...props }, ref) {
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
    <UIImage
      className={imageStyle({ size, class: _className })}
      alt=''
      {...props}
      ref={ref}
      // @ts-expect-error : web only
      style={
        Platform.OS === 'web'
          ? { height: 'revert-layer', width: 'revert-layer' }
          : undefined
      }
    />
  );
});

Image.displayName = 'Image';
export { Image };
