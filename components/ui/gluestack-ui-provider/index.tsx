import { OverlayProvider } from '@gluestack-ui/core/overlay/creator';
import { ToastProvider } from '@gluestack-ui/core/toast/creator';
import React, { useEffect } from 'react';
import { Appearance, ColorSchemeName, View, ViewProps } from 'react-native';

export function GluestackUIProvider({
  mode = 'light',
  ...props
}: {
  mode?: ColorSchemeName;
  children?: React.ReactNode;
  style?: ViewProps['style'];
}) {
  useEffect(() => {
    Appearance.setColorScheme(mode);
  }, [mode]);

  return (
    <View style={[{ flex: 1, height: '100%', width: '100%' }, props.style]}>
      <OverlayProvider>
        <ToastProvider>{props.children}</ToastProvider>
      </OverlayProvider>
    </View>
  );
}
