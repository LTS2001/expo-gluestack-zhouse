import { Button, ButtonIcon, ButtonText } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { View } from '@/components/ui/view'
import React from 'react'

export default function Index() {
  return (
    <View>


      <Text>我是首页</Text>
      <Button>
        <ButtonIcon name='home' color='white' />
        <ButtonText>我是按钮</ButtonText>
      </Button>
    </View>
  )
}
