import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils';
import {
  tva,
  useStyleContext,
  withStyleContext,
} from '@gluestack-ui/utils/nativewind-utils';
import React from 'react';
import { Text, View } from 'react-native';

const SCOPE = 'BADGE';

const badgeStyle = tva({
  base: 'flex-row items-center justify-center rounded-sm px-2 py-0.5',
  variants: {
    action: {
      error: 'bg-background-error border-error-300',
      warning: 'bg-background-warning border-warning-300',
      success: 'bg-background-success border-success-300',
      info: 'bg-background-info border-info-300',
      muted: 'bg-background-muted border-background-300',
    },
    variant: {
      default: 'bg-primary',
      secondary: 'bg-secondary',
      destructive: 'bg-destructive dark:bg-destructive/60',
      outline: 'border border-border dark:border-border/90 bg-transparent',
    },
  },
});

const badgeTextStyle = tva({
  base: 'text-xs font-medium tracking-normal uppercase',
  parentVariants: {
    variant: {
      default: 'text-primary-foreground',
      secondary: 'text-secondary-foreground',
      destructive: 'text-white',
      outline: 'text-foreground',
    },
  },
});

const ContextView = withStyleContext(View, SCOPE);

type IBadgeProps = React.ComponentPropsWithoutRef<typeof ContextView> &
  VariantProps<typeof badgeStyle>;
function Badge({
  children,
  variant = 'default',
  className,
  ...props
}: { className?: string } & IBadgeProps) {
  return (
    <ContextView
      className={badgeStyle({ variant, class: className })}
      {...props}
      context={{ variant }}
    >
      {children}
    </ContextView>
  );
}

type IBadgeTextProps = React.ComponentPropsWithoutRef<typeof Text> &
  VariantProps<typeof badgeTextStyle>;

const BadgeText = React.forwardRef<
  React.ComponentRef<typeof Text>,
  IBadgeTextProps
>(function BadgeText({ children, className, ...props }, ref) {
  const { variant: parentVariant } = useStyleContext(SCOPE);
  return (
    <Text
      ref={ref}
      className={badgeTextStyle({
        parentVariants: {
          variant: parentVariant,
        },
        class: className,
      })}
      {...props}
    >
      {children}
    </Text>
  );
});

Badge.displayName = 'Badge';
BadgeText.displayName = 'BadgeText';

export { Badge, BadgeText };
