import { GluestackUIProvider, Toast } from '@/components/ui';
import {
  COMPLAINT_LIST_HREF,
  COMPLAINT_LIST_TEXT,
  LANDLORD_REPAIR_HREF,
  LANDLORD_REPAIR_TEXT,
  LEASE_NOTICE_HREF,
  LEASE_NOTICE_TEXT,
  SELF_INFO_HREF,
  SELF_INFO_TEXT,
  TENANT_COLLECT_HREF,
  TENANT_COLLECT_TEXT,
  TENANT_HISTORY_HREF,
  TENANT_HISTORY_TEXT,
  TENANT_REPAIR_HREF,
  TENANT_REPAIR_TEXT,
} from '@/constants';
import '@/global.css';
import { useInitialization } from '@/hooks';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import 'react-native-reanimated';

export default function RootLayout() {
  useInitialization();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <GluestackUIProvider mode={colorScheme ?? 'light'}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack
          initialRouteName='identity'
          screenOptions={{ headerTitleAlign: 'center' }}
        >
          <Stack.Screen name='identity' options={{ headerShown: false }} />
          <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
          <Stack.Screen name='login' options={{ headerShown: false }} />
          <Stack.Screen
            name={SELF_INFO_HREF}
            options={{ title: SELF_INFO_TEXT }}
          />
          <Stack.Screen
            name={TENANT_REPAIR_HREF}
            options={{ title: TENANT_REPAIR_TEXT }}
          />
          <Stack.Screen
            name={TENANT_COLLECT_HREF}
            options={{ title: TENANT_COLLECT_TEXT }}
          />
          <Stack.Screen
            name={TENANT_HISTORY_HREF}
            options={{ title: TENANT_HISTORY_TEXT }}
          />
          <Stack.Screen
            name={COMPLAINT_LIST_HREF}
            options={{ title: COMPLAINT_LIST_TEXT }}
          />
          <Stack.Screen
            name={LANDLORD_REPAIR_HREF}
            options={{ title: LANDLORD_REPAIR_TEXT }}
          />
          <Stack.Screen
            name={LEASE_NOTICE_HREF}
            options={{ title: LEASE_NOTICE_TEXT }}
          />
          <Stack.Screen
            name='identity-verify'
            options={{ title: '实名认证' }}
          />
          <Stack.Screen
            name='choose-location'
            options={{
              title: '选择位置',
            }}
          />
          <Stack.Screen name='add-edit-house' />
          <Stack.Screen name='landlord-look-house' />
          <Stack.Screen
            name='tenant-report-for-repair'
            options={{ title: '房屋报修' }}
          />
          <Stack.Screen name='+not-found' />
        </Stack>
        <StatusBar style='auto' />
        <Toast />
      </ThemeProvider>
    </GluestackUIProvider>
  );
}
