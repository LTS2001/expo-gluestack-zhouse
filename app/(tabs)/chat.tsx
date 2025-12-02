import { Empty } from '@/components';
import { Image, Text, TouchableOpacity, View } from '@/components/ui';
import { EChatMessageTypeEnum } from '@/constants';
import { IChatSessionUser } from '@/global';
import { chatStore } from '@/stores';
import { formatChatDate } from '@/utils';
import cls from 'classnames';
import { router } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { ScrollView } from 'react-native';
function Chat() {
  const {
    chatSessionList,
    senderId,
    chatSessionLastOneMessageList,
    chatReceiverInfoList,
    setChatReceiver,
  } = chatStore;

  const getSessionContectText = useCallback(
    ({ type, content }: { type?: EChatMessageTypeEnum; content?: string }) => {
      switch (type) {
        case EChatMessageTypeEnum.Text:
          return JSON.parse(content || '""');
        case EChatMessageTypeEnum.Image:
          return '[图片]';
        case EChatMessageTypeEnum.Video:
          return '[视频]';
        case EChatMessageTypeEnum.WebrtcVideo:
          return '[视频通话]';
        default:
          return '';
      }
    },
    []
  );

  return (
    <ScrollView
      contentContainerClassName='flex-grow'
      showsVerticalScrollIndicator={false}
    >
      {chatSessionList?.length ? (
        chatSessionList?.map((session) => {
          let receiver: IChatSessionUser | undefined;
          if (session.senderId === senderId) {
            receiver = chatReceiverInfoList?.find(
              (c) => c.receiverId === session.receiverId
            );
          } else {
            receiver = chatReceiverInfoList?.find(
              (c) => c.receiverId === session.senderId
            );
          }
          const { updatedAt, content, type } =
            chatSessionLastOneMessageList?.find((c) => {
              const { senderId, receiverId } = session;
              return (
                (c.senderId === senderId && c.receiverId === receiverId) ||
                (c.senderId === receiverId && c.receiverId === senderId)
              );
            }) || {};
          const _unread = session.unread;
          return (
            <TouchableOpacity
              key={session.id}
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
                    {formatChatDate(updatedAt!, {
                      isSession: true,
                    })}
                  </Text>
                </View>
                <Text className='text-primary-50 text-base'>
                  {getSessionContectText({ type, content })}
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
