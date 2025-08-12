import {
  Icon,
  Input,
  InputField,
  TouchableOpacity,
  View,
} from '@/components/ui';
import { useState } from 'react';

interface IHeaderSearchProps {
  onChangeText: (text: string) => void;
  onChangeFocus: (isFocused: boolean) => void;
}

export default function HeaderSearch({
  onChangeText,
  onChangeFocus,
}: IHeaderSearchProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  return (
    <View className={isSearchFocused ? 'w-screen px-4' : ''}>
      {isSearchFocused ? (
        <View className='mr-2 w-full'>
          <Input className='w-full' variant='underlined'>
            <Icon as='FontAwesome6' name='magnifying-glass' size={20} />
            <InputField
              className='text-lg ml-4'
              placeholder='搜索房源'
              onChangeText={onChangeText}
              autoFocus={true}
            />
            <TouchableOpacity
              onPress={() => {
                setIsSearchFocused(false);
                onChangeFocus(false);
              }}
              className='px-2'
            >
              <Icon as='AntDesign' name='close' size={20} />
            </TouchableOpacity>
          </Input>
        </View>
      ) : (
        <TouchableOpacity
          className='p-4'
          onPress={() => {
            setIsSearchFocused(true);
            onChangeFocus(true);
          }}
        >
          <Icon
            as='FontAwesome6'
            name='magnifying-glass'
            size={20}
            lightColor='black'
            darkColor='white'
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
