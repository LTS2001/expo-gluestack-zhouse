import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { ScrollView } from 'react-native';

export default function HouseAllComment() {
  return (
    <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
      <View>
        <Text>HouseAllComment</Text>
      </View>
    </ScrollView>
  );
}
