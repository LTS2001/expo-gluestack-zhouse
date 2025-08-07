import { Icon, Input, InputField, View } from '@/components/ui';
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
            <View
              onTouchEnd={() => {
                setIsSearchFocused(false);
                onChangeFocus(false);
              }}
              className='px-2'
            >
              <Icon as='AntDesign' name='close' size={20} />
            </View>
          </Input>
        </View>
      ) : (
        <View
          className='p-4'
          onTouchEnd={() => {
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
        </View>
      )}
    </View>
  );
}
