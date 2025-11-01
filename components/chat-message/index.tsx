import { ECHAT_MESSAGE_TYPE } from '@/constants';
import { TMessageModel } from '@/global';
import { formatChatDate } from '@/utils';
import cls from 'classnames';
import { memo, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from '../ui';
import VideoThumbnailImage from '../video-thumbnail-image';

interface IMessageProps {
  id: number | string;
  model: TMessageModel;
  identity: 'sender' | 'receiver';
  headImg: string;
  messageTime: Date;
  index: number;
  handleImagePress?: (model: IMessageProps['model']) => void;
  handleVideoPress?: (model: IMessageProps['model']) => void;
}
const Message = memo(
  (props: IMessageProps) => {
    const {
      model,
      identity,
      headImg,
      handleImagePress,
      handleVideoPress,
      messageTime,
      index,
    } = props;
    const { type, content } = model;
    const [showMessageBottomTimeIdx, setShowMessageBottomTimeIdx] =
      useState(-1);
    return (
      <View className='px-4 py-2'>
        <View
          className={cls([
            'flex-row gap-2',
            { 'flex-row-reverse': identity === 'sender' },
          ])}
        >
          <Image src={headImg} size='xs' />
          <View className='flex-1 max-w-[70%]'>
            <TouchableOpacity
              onPress={() => setShowMessageBottomTimeIdx(index)}
            >
              {type === ECHAT_MESSAGE_TYPE.TEXT ? (
                <View
                  className={cls([
                    'bg-background-0 rounded-md py-2 px-3 self-start border-[1px] border-background-100',
                    { 'bg-background-800 self-end': identity === 'sender' },
                  ])}
                >
                  <Text
                    className={cls([
                      'text-xl text-background-900',
                      { 'text-background-0': identity === 'sender' },
                    ])}
                  >
                    {content}
                  </Text>
                </View>
              ) : type === ECHAT_MESSAGE_TYPE.IMAGE ? (
                <TouchableOpacity
                  className={cls([{ 'self-end': identity === 'sender' }])}
                  onPress={() => handleImagePress?.(model)}
                >
                  <Image
                    src={content.path}
                    style={{ width: content.width, height: content.height }}
                  />
                </TouchableOpacity>
              ) : type === ECHAT_MESSAGE_TYPE.VIDEO ? (
                <View className={cls([{ 'self-end': identity === 'sender' }])}>
                  <VideoThumbnailImage
                    width={content.thumbnail.width}
                    height={content.thumbnail.height}
                    path={content.thumbnail.path}
                    videoDuration={content.duration}
                    handlePress={() => {
                      handleVideoPress?.(model);
                    }}
                  />
                </View>
              ) : null}
            </TouchableOpacity>
            {showMessageBottomTimeIdx === index ? (
              <Text
                className={cls([
                  'text-sm text-gray-500 mx-1 mt-1',
                  {
                    'self-end': identity === 'sender',
                  },
                ])}
              >
                {formatChatDate(messageTime, {
                  isShowSeconds: true,
                })}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    );
  },
  () => true
);

Message.displayName = 'Message';

export default Message;
