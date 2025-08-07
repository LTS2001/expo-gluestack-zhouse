import { Text, View } from '@/components/ui';
import { ScrollView } from 'react-native';

export default function ChatMessage() {
  return (
    <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
      <View>
        <Text>ChatMessage</Text>
      </View>
    </ScrollView>
  );
}
