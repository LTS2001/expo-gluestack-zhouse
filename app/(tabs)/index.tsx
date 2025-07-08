import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { router } from 'expo-router';

export default function Index() {
  return (
    <View className='gap-3'>
      <Text>我是首页</Text>
      <Button>
        <ButtonIcon name='home' color='white' />
        <ButtonText>我是按钮</ButtonText>
      </Button>

      <Button onTouchEnd={() => router.push('/add-edit-house')}>
        <ButtonText>Add House</ButtonText>
      </Button>
    </View>
  );
}
