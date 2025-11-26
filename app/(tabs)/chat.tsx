import { Empty } from '@/components';
import { Image, Text, TouchableOpacity, View } from '@/components/ui';
import { ECHAT_MESSAGE_TYPE } from '@/constants';
import { IChatSessionUser } from '@/global';
import { chatStore } from '@/stores';
import { formatChatDate } from '@/utils';
import cls from 'classnames';
import { router } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { ScrollView } from 'react-native';
function Chat() {
  const {
    chatSessionList,
    senderId,
    chatSessionLastOneMessageList,
    chatReceiverInfoList,
    setChatReceiver,
  } = chatStore;

  return (
    <ScrollView
      contentContainerClassName='flex-grow'
      showsVerticalScrollIndicator={false}
    >
      {chatSessionList?.length ? (
        chatSessionList?.map((chatSession) => {
          let receiver: IChatSessionUser | undefined;
          if (chatSession.senderId === senderId) {
            receiver = chatReceiverInfoList?.find(
              (c) => c.receiverId === chatSession.receiverId
            );
          } else {
            receiver = chatReceiverInfoList?.find(
              (c) => c.receiverId === chatSession.senderId
            );
          }
          const lastMessage = chatSessionLastOneMessageList?.find((c) => {
            const { senderId, receiverId } = chatSession;
            return (
              (c.senderId === senderId && c.receiverId === receiverId) ||
              (c.senderId === receiverId && c.receiverId === senderId)
            );
          });
          const _unread = chatSession.unread;
          return (
            <TouchableOpacity
              key={chatSession.id}
              className='flex-row gap-4 px-5 py-3 bg-background-0 border-b-[0.5px] border-background-200'
              onPress={() => {
                if (!receiver) return;
                setChatReceiver(receiver);
                router.push('/chat-message');
              }}
            >
              <View className='relative'>
                <Image src={receiver?.headImg} size='sm' />
                {_unread ? (
                  <Text
                    className={cls([
                      'absolute -top-2 -right-2 text-sm bg-red-600 rounded-full text-white px-2 py-1 leading-none',
                      {
                        '-right-3': _unread > 9 && _unread < 100,
                        '-right-4': _unread >= 100,
                      },
                    ])}
                  >
                    {_unread < 100 ? _unread : `99+`}
                  </Text>
                ) : null}
              </View>
              <View className='flex-1 justify-center'>
                <View className='flex-row justify-between items-center'>
                  <Text className='text-xl font-semibold'>
                    {receiver?.name}
                  </Text>
                  <Text className='text-primary-300'>
                    {formatChatDate(lastMessage?.updatedAt!, {
                      isSession: true,
                    })}
                  </Text>
                </View>
                <Text className='text-primary-50 text-base'>
                  {lastMessage?.type === ECHAT_MESSAGE_TYPE.TEXT
                    ? lastMessage?.content
                    : lastMessage?.type === ECHAT_MESSAGE_TYPE.IMAGE
                    ? '[图片]'
                    : lastMessage?.type === ECHAT_MESSAGE_TYPE.VIDEO
                    ? '[视频]'
                    : '[视频通话]'}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })
      ) : (
        <Empty text='暂无消息' />
      )}
    </ScrollView>
  );
}

export default observer(Chat);
