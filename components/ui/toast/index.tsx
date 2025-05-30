'use client';
import type { VariantProps } from '@gluestack-ui/nativewind-utils';
import { tva } from '@gluestack-ui/nativewind-utils/tva';
import React from 'react';
import { Dimensions, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ToastMessage, {
  ToastOptions,
  ToastProps,
} from 'react-native-toast-message';
import { Icon } from '../icon';

const toastStyle = tva({
  base: 'p-4 m-1 rounded-md gap-1 web:pointer-events-auto shadow-hard-5 border-outline-100',
  variants: {
    action: {
      error: 'bg-error-800',
      warning: 'bg-warning-700',
      success: 'bg-success-700',
      info: 'bg-info-700',
      muted: 'bg-background-800',
    },
    variant: {
      solid: '',
      outline: 'border bg-background-0',
    },
  },
});

const toastTitleStyle = tva({
  base: 'text-typography-0 font-medium font-body tracking-md text-left ml-2',
  variants: {
    isTruncated: {
      true: '',
    },
    bold: {
      true: 'font-bold',
    },
    underline: {
      true: 'underline',
    },
    strikeThrough: {
      true: 'line-through',
    },
    size: {
      '2xs': 'text-2xs',
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
      '5xl': 'text-5xl',
      '6xl': 'text-6xl',
    },
  },
  parentVariants: {
    variant: {
      solid: '',
      outline: '',
    },
    action: {
      error: '',
      warning: '',
      success: '',
      info: '',
      muted: '',
    },
  },
  parentCompoundVariants: [
    {
      variant: 'outline',
      action: 'error',
      class: 'text-error-800',
    },
    {
      variant: 'outline',
      action: 'warning',
      class: 'text-warning-800',
    },
    {
      variant: 'outline',
      action: 'success',
      class: 'text-success-800',
    },
    {
      variant: 'outline',
      action: 'info',
      class: 'text-info-800',
    },
    {
      variant: 'outline',
      action: 'muted',
      class: 'text-background-800',
    },
  ],
});

const toastDescriptionStyle = tva({
  base: 'font-normal font-body tracking-md text-left',
  variants: {
    isTruncated: {
      true: '',
    },
    bold: {
      true: 'font-bold',
    },
    underline: {
      true: 'underline',
    },
    strikeThrough: {
      true: 'line-through',
    },
    size: {
      '2xs': 'text-2xs',
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
      '5xl': 'text-5xl',
      '6xl': 'text-6xl',
    },
  },
  parentVariants: {
    variant: {
      solid: 'text-typography-50',
      outline: 'text-typography-900',
    },
  },
});

type IToastProps = React.ComponentProps<typeof View> & {
  className?: string;
} & VariantProps<typeof toastStyle>;

type IToastTitleProps = React.ComponentProps<typeof Text> & {
  className?: string;
} & VariantProps<typeof toastTitleStyle>;

type IToastDescriptionProps = React.ComponentProps<typeof Text> & {
  className?: string;
} & VariantProps<typeof toastDescriptionStyle>;

interface IShowToastProps {
  title: React.ReactNode;
  desc?: React.ReactNode;
  toastStyles?: IToastProps;
  titleStyles?: IToastTitleProps;
  descStyles?: IToastDescriptionProps;
  action?: keyof typeof toastTitleStyle.variants.action;
  variant?: keyof typeof toastTitleStyle.variants.variant;
  icon?: React.ReactNode;
}

const Toast = (props: ToastProps) => {
  const insets = useSafeAreaInsets();
  const screenWidth = Dimensions.get('screen').width;
  return (
    <ToastMessage
      topOffset={insets.top}
      {...props}
      config={{
        customToast: ({ props }: { props: IShowToastProps }) => {
          const {
            toastStyles = {},
            titleStyles = {},
            descStyles = {},
            title,
            desc,
            icon,
          } = props;
          const {
            className: toastClassName,
            variant = 'solid',
            action = 'muted',
            ...toastProps
          } = toastStyles;
          const {
            className: titleClassName,
            size: titleSize = 'md',
            children,
            ...titleProps
          } = titleStyles;
          const {
            className: descClassName,
            size: descSize = 'md',
            ...descProps
          } = descStyles;
          return (
            <View
              {...toastProps}
              className={toastStyle({ variant, action, class: toastClassName })}
              style={{
                minWidth: screenWidth * 0.6,
                maxWidth: screenWidth * 0.9,
              }}
            >
              <View className='flex-row justify-center'>
                {icon ? (
                  icon
                ) : (
                  <Icon as='AntDesign' name='exclamationcircle' size={16} />
                )}
                <Text
                  aria-live='assertive'
                  aria-atomic='true'
                  role='alert'
                  {...titleProps}
                  className={toastTitleStyle({
                    size: titleSize,
                    class: titleClassName,
                    parentVariants: {
                      variant,
                      action,
                    },
                  })}
                >
                  {title}
                </Text>
              </View>
              {desc && (
                <Text
                  {...descProps}
                  className={toastDescriptionStyle({
                    size: descSize,
                    class: descClassName,
                    parentVariants: {
                      variant,
                    },
                  })}
                >
                  {desc}
                </Text>
              )}
            </View>
          );
        },
      }}
    />
  );
};

const showToast = (
  _props?: IShowToastProps &
    Omit<
      ToastOptions,
      | 'type'
      | 'text1Style'
      | 'text2Style'
      | 'topOffset'
      | 'bottomOffset'
      | 'props'
    >
) => {
  const {
    position,
    autoHide,
    visibilityTime = 2000,
    swipeable,
    keyboardOffset,
    avoidKeyboard,
    onShow,
    onHide,
    onPress,
    ...props
  } = _props || {};
  ToastMessage.show({
    type: 'customToast',
    position,
    autoHide,
    visibilityTime,
    swipeable,
    keyboardOffset,
    avoidKeyboard,
    onShow,
    onHide,
    onPress,
    props,
  });
};

export { showToast, Toast };
