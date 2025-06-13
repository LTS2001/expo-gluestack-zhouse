import { Button, ButtonText } from '@/components/ui/button'
import { Divider } from '@/components/ui/divider'
import { Image } from '@/components/ui/image'
import { View } from '@/components/ui/view'
import { LANDLORD, TENANT } from '@/constants/auth'
import { TIdentity } from '@/global'
import useLandlord from '@/hooks/useLandlord'
import useTenant from '@/hooks/useTenant'
import authStore from '@/stores/auth'
import { useRouter } from 'expo-router'
import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'

function Identity() {
  const { preIdentity, setIdentityState, isInitialized, identity } = authStore
  const [isShow, setIsShow] = useState(false)
  const router = useRouter()
  const { landlordLogout } = useLandlord()
  const { tenantLogout } = useTenant()
  /**
   * jump to home page
   * @param identity 
   */
  const toHome = (identity: TIdentity) => {
    /**
     * Judge before jumping
     * 1. if the selected identity is the same as the previous identity, the login status will not be cleared
     * 2. otherwise, it is cleared
     */
    if (preIdentity !== identity) {
      if (preIdentity === LANDLORD)
        landlordLogout();
      else if (preIdentity === TENANT)
        tenantLogout();
    }
    setIdentityState(identity)
    router.replace({
      pathname: '/(tabs)',
    })
  }

  useEffect(() => {
    if (isInitialized && identity) {
      router.replace('/(tabs)')
      return
    }
    setIsShow(true)
  }, [isInitialized, router, identity])

  return isShow && (
    <View className='flex-1 items-center justify-center gap-12 p-4 dark:bg-zinc-400'>
      <View>
        <Image source={require('@/assets/images/landlord.png')} alt='landlord' size='3xl' />
        <Button onPress={() => toHome('landlord')}>
          <ButtonText>我是房东</ButtonText>
        </Button>
      </View>
      <Divider />
      <View>
        <Image source={require('@/assets/images/tenant.png')} alt='tenant' size='3xl' />
        <Button onPress={() => toHome('tenant')}>
          <ButtonText>我是租客</ButtonText>
        </Button>
      </View>
    </View>
  )
}
export default observer(Identity)