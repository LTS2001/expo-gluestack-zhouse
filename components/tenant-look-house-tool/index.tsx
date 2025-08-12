import { getCollectHouseStatus, updateCollectHouseStatus } from '@/business';
import { TENANT } from '@/constants';
import { IUser } from '@/global';
import { authStore, chatStore, houseStore, userStore } from '@/stores';
import { makePhoneCall } from '@/utils';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Icon, Image, showToast, Text, TouchableOpacity, View } from '../ui';

export default function TenantLookHouseTool({
  landlord,
  houseId,
  houseName,
}: {
  landlord?: IUser;
  houseName?: string;
  houseId?: number;
}) {
  const { identity } = authStore;
  const { updateHouseCollectList } = houseStore;
  const { setChatReceiver } = chatStore;
  const { currentLandlord } = userStore;

  // collect status
  const [collected, setCollected] = useState(false);

  /**
   * look house all comment
   */
  const lookHouseAllComment = () => {
    router.push({
      pathname: '/house-all-comment',
      params: {
        houseName,
        houseId,
      },
    });
  };

  /**
   * to chat
   */
  const toChat = () => {
    if (!currentLandlord) return;
    setChatReceiver(currentLandlord);
    router.push('/chat-message');
  };

  /**
   * make phone call to landlord
   */
  const phoneLandlord = async () => {
    if (landlord?.phone) {
      await makePhoneCall(landlord.phone);
    } else {
      showToast({
        title: '房东电话信息不可用',
        action: 'error',
      });
    }
  };

  /**
   * change house collect status
   */
  const toChangeHouseCollectStatus = async () => {
    const res = await updateCollectHouseStatus(
      houseId!,
      landlord?.id!,
      Number(!collected)
    );
    setCollected(!collected);
    updateHouseCollectList(res.houseId, res.status);
  };

  /**
   * get current house collect status
   */
  const getCurrentHouseCollectStatus = async () => {
    if (houseId) {
      const status = await getCollectHouseStatus(houseId);
      status && setCollected(Boolean(status));
    }
  };

  // tenant not login, click collect or lease
  useEffect(() => {
    getCurrentHouseCollectStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View>
      <View className='flex-row items-center justify-between'>
        <View className='flex-row items-center'>
          <Image src={landlord?.headImg} size='2xs' className='rounded-full' />
          <Text className='ml-2'>{landlord?.name}</Text>
        </View>
        <TouchableOpacity
          className='flex-row items-center gap-1 self-end'
          onPress={lookHouseAllComment}
        >
          <Text>查看房屋评论</Text>
          <Icon as='AntDesign' name='right' size={16} />
        </TouchableOpacity>
      </View>
      {identity === TENANT && (
        <View className='flex-row items-center gap-8 mt-3'>
          <TouchableOpacity onPress={toChangeHouseCollectStatus}>
            {collected ? (
              <Icon
                as='AntDesign'
                name='star'
                lightColor='#edb83b'
                darkColor='#edb83b'
              />
            ) : (
              <Icon as='AntDesign' name='staro' />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={phoneLandlord}>
            <Icon as='AntDesign' name='phone' />
          </TouchableOpacity>
          <TouchableOpacity onPress={toChat}>
            <Icon as='AntDesign' name='message1' size={22} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
