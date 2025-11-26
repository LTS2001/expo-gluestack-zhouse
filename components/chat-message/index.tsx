import { ECHAT_MESSAGE_TYPE } from '@/constants';
import { TMessageModel } from '@/global';
import { formatChatDate } from '@/utils';
import cls from 'classnames';
import { memo, useMemo, useState } from 'react';
import {
  Icon,
  Image,
  Text,
  TouchableOpacity,
  UploadProgress,
  View,
} from '../ui';
import VideoThumbnailImage from '../video-thumbnail-image';

interface IMessageProps {
  id: number | string;
  model: TMessageModel;
  identity: 'sender' | 'receiver';
  headImg: string;
  messageTime: Date;
  index: number;
  uploadStatus?: 'pending' | 'uploading' | 'success' | 'failed';
  uploadProgress?: number;
  handleImagePress?: (model: IMessageProps['model']) => void;
  handleVideoPress?: (model: IMessageProps['model']) => void;
  onRetry?: () => void;
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
      uploadStatus,
      uploadProgress,
      onRetry,
    } = props;
    const { type, content } = model;
    const [showMessageBottomTimeIdx, setShowMessageBottomTimeIdx] =
      useState(-1);
    const isUploading =
      uploadStatus === 'uploading' || uploadStatus === 'pending';
    const isFailed = uploadStatus === 'failed';

    const getMessageStructure = useMemo(
      () => {
        switch (type) {
          case ECHAT_MESSAGE_TYPE.TEXT:
            return (
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
            );
          case ECHAT_MESSAGE_TYPE.IMAGE:
            return (
              <View
                className={cls([
                  'relative',
                  { 'self-end': identity === 'sender' },
                ])}
              >
                <Image
                  src={content.path}
                  style={{ width: content.width, height: content.height }}
                />
                {isUploading && uploadProgress !== undefined ? (
                  <View
                    className='absolute inset-0 bg-black/50 flex items-center justify-center rounded'
                    style={{
                      width: content.width,
                      height: content.height,
                    }}
                  >
                    <UploadProgress progress={uploadProgress} color='white' />
                  </View>
                ) : !isFailed ? (
                  <TouchableOpacity
                    className='absolute inset-0'
                    onPress={() => handleImagePress?.(model)}
                  />
                ) : null}
              </View>
            );
          case ECHAT_MESSAGE_TYPE.VIDEO:
            return (
              <View className={cls([{ 'self-end': identity === 'sender' }])}>
                <View className='relative'>
                  <VideoThumbnailImage
                    uploaded={!isUploading && !isFailed}
                    width={content.thumbnail.width}
                    height={content.thumbnail.height}
                    path={content.thumbnail.path}
                    videoDuration={content.duration}
                    handlePress={() => {
                      if (!isUploading && !isFailed) {
                        handleVideoPress?.(model);
                      }
                    }}
                  />
                  {isUploading && uploadProgress !== undefined ? (
                    <View
                      className='absolute inset-0 bg-black/50 flex items-center justify-center rounded'
                      style={{
                        width: content.thumbnail.width,
                        height: content.thumbnail.height,
                      }}
                    >
                      <UploadProgress progress={uploadProgress} color='white' />
                    </View>
                  ) : null}
                </View>
              </View>
            );

          case ECHAT_MESSAGE_TYPE.WEBRTC_VIDEO:
            return (
              <View
                className={cls([
                  'bg-background-0 rounded-md py-2 px-3 self-start border-[1px] border-background-100 flex-row items-center gap-2',
                  { 'bg-background-800 self-end': identity === 'sender' },
                ])}
              >
                <Icon
                  as='Ionicons'
                  name='videocam-outline'
                  lightColor={identity === 'sender' ? 'white' : 'black'}
                  darkColor={identity === 'sender' ? 'white' : 'black'}
                />
                <Text
                  className={cls([
                    'text-xl text-background-900',
                    { 'text-background-0': identity === 'sender' },
                  ])}
                >
                  {content}
                </Text>
              </View>
            );
          default:
            return null;
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [type, content, identity, isUploading, uploadProgress, isFailed, model]
    );

    return (
      <View className='px-4 py-2'>
        <View
          className={cls([
            'flex-row gap-2',
            { 'flex-row-reverse': identity === 'sender' },
          ])}
        >
          <Image src={headImg} size='xs' />
          <View
            className={cls([
              'flex-1 max-w-[70%] flex-row items-end gap-1',
              { 'flex-row-reverse': identity === 'sender' },
            ])}
          >
            <View
              className={cls([
                'flex-1 gap-4 flex-row items-center',
                { 'flex-row-reverse': identity === 'sender' },
              ])}
            >
              <TouchableOpacity
                onPress={() => setShowMessageBottomTimeIdx(index)}
                disabled={isUploading || isFailed}
              >
                {getMessageStructure}
              </TouchableOpacity>
              {isFailed && onRetry && identity === 'sender' ? (
                <TouchableOpacity onPress={onRetry} className='mb-1 mr-1'>
                  <Icon
                    as='AntDesign'
                    name='exclamationcircle'
                    size={20}
                    color='red'
                  />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>
        {showMessageBottomTimeIdx === index ? (
          <Text
            className={cls([
              'text-sm text-gray-500 mx-14 mt-1',
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
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.uploadStatus === nextProps.uploadStatus &&
      prevProps.uploadProgress === nextProps.uploadProgress
    );
  }
);

Message.displayName = 'Message';

export default Message;
