import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: '页面未找到',
          headerTitleAlign: 'center',
        }}
      />
      <View style={styles.container}>
        <Text>抱歉，您访问的页面不存在。</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
