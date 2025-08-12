import { IPendingLease } from '@/global';
import { makePhoneCall } from '@/utils';
import React, { ReactNode } from 'react';
import { Icon, Image, showToast, Text, TouchableOpacity, View } from '../ui';

interface Props {
  lease: IPendingLease;
  bottomNode?: ReactNode;
  msgItemNode?: ReactNode;
}
const TenantCard = (props: Props & React.PropsWithChildren) => {
  const { lease, bottomNode, msgItemNode } = props;
  /**
   * make phone call to tenant
   */
  const phoneTenant = (phone: string) => {
    if (phone) {
      makePhoneCall(phone);
    } else {
      showToast({
        title: '租客电话信息不可用',
        action: 'error',
      });
    }
  };

  /**
   * to chat
   */
  const toChat = () => {
    // if (!currentLandlord) return;
    // setChatReceiver(currentLandlord);
    // router.push('/chat-message');
  };

  return (
    <View className='bg-background-0 m-4 rounded-xl p-4' needShadow>
      <Text className='font-bold text-xl'>{lease.houseName}</Text>
      <View className='mt-2'>
        <View className='flex-row items-center'>
          <Text>地址：</Text>
          <Text>{lease.houseAddress}</Text>
        </View>
        <View className='flex-row items-center justify-between mt-2 bg-secondary-200 p-2 rounded-md'>
          <View className='flex-row items-center gap-3'>
            <Image src={lease.tenantHeadImg} size='sm' />
            <View>
              <Text>{lease.tenantName}</Text>
              <Text>{lease.tenantPhone}</Text>
            </View>
          </View>
          <View className='flex-row gap-4'>
            <TouchableOpacity onPress={() => phoneTenant(lease.tenantPhone)}>
              <Icon as='AntDesign' name='phone' />
            </TouchableOpacity>
            <TouchableOpacity onPress={toChat}>
              <Icon as='AntDesign' name='message1' size={22} />
            </TouchableOpacity>
          </View>
        </View>
        {msgItemNode}
      </View>
      {bottomNode}
    </View>
  );
};
export default TenantCard;
