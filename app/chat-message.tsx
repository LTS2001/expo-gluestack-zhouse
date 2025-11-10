import { getChatMessageList } from '@/business';
import { ImagePreview, VideoPreview } from '@/components';
import Message from '@/components/chat-message';
import {
  Button,
  ButtonText,
  Icon,
  Text,
  Textarea,
  TextareaInput,
  TouchableOpacity,
  View,
} from '@/components/ui';
import {
  CHAT_INPUT_MAX_HEIGHT,
  ECHAT_MESSAGE_TYPE,
  SERVER_IMAGE_ROOT,
} from '@/constants';
import { IChatMessage, IVideo } from '@/global';
import { useMediaPreview } from '@/hooks';
import useChatMessage from '@/hooks/useChatMessage';
import { chatStore } from '@/stores';
import { formatChatDate, isCertainMinuteAge } from '@/utils';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import Animated from 'react-native-reanimated';

const ChatMessage = () => {
  const { chatSender, chatReceiver, chatMessageList, senderId } = chatStore;

  const {
    chatAreaScrollViewRef,
    inputHeight,
    setInputHeight,
    composedHeight,
    fakeView,
    showControlPanel,
    handleChatInputFocus,
    handleToggleControlPanel,
    handleHideControlPanel,
    chatInputVal,
    setChatInputVal,
    handleSendMessage,
    handleSelectMediumFile,
    handleTakePhoto,
    handleRetryMessage,
  } = useChatMessage({
    title: chatReceiver?.name ?? '',
  });

  const {
    videoPreviewVisible,
    setVideoPreviewVisible,
    imagePreviewVisible,
    setImagePreviewVisible,
    imagePreviewIndex,
    setImagePreviewIndex,
  } = useMediaPreview();
  const [images, setImages] = useState<string[]>([]);
  const [video, setVideo] = useState<IVideo | null>(null);
  return (
    <KeyboardAvoidingView className='flex-1' style={fakeView}>
      <Animated.FlatList<IChatMessage>
        inverted
        ref={chatAreaScrollViewRef}
        contentContainerClassName='flex-grow pt-4'
        showsVerticalScrollIndicator={false}
        data={chatMessageList}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={getChatMessageList}
        onEndReachedThreshold={0.5}
        onScroll={handleHideControlPanel}
        renderItem={({ item: chatMessage, index: idx }) => {
          const { type, content, createdAt, uploadStatus, uploadProgress } =
            chatMessage;
          const nextDate = chatMessageList?.[idx + 1]?.createdAt;
          const identity =
            senderId === chatMessage.senderId ? 'sender' : 'receiver';
          return (
            <View>
              <View className='flex-row justify-center pt-2'>
                {isCertainMinuteAge(
                  createdAt,
                  nextDate ?? createdAt,
                  3 * 60 * 1000
                ) || idx === (chatMessageList?.length ?? 0) - 1 ? (
                  <Text>{formatChatDate(createdAt)}</Text>
                ) : null}
              </View>
              <Message
                id={chatMessage.id}
                model={{
                  type,
                  content:
                    type === ECHAT_MESSAGE_TYPE.TEXT
                      ? content
                      : JSON.parse(content),
                }}
                identity={identity}
                index={idx}
                headImg={
                  identity === 'sender'
                    ? chatSender?.headImg!
                    : chatReceiver?.headImg!
                }
                messageTime={createdAt}
                uploadStatus={uploadStatus}
                uploadProgress={uploadProgress}
                handleImagePress={(m) => {
                  if (m.type === ECHAT_MESSAGE_TYPE.IMAGE) {
                    setImages([m.content.path]);
                    setImagePreviewVisible(true);
                    setImagePreviewIndex(0);
                  }
                }}
                handleVideoPress={(m) => {
                  if (m.type === ECHAT_MESSAGE_TYPE.VIDEO) {
                    setVideo(m.content);
                    setVideoPreviewVisible(true);
                  }
                }}
                onRetry={() => handleRetryMessage(chatMessage.id)}
              />
            </View>
          );
        }}
      />
      <View className='bg-background-50 pb-6 pt-3 px-4 flex-row items-center justify-between gap-4 border-t-[1px] border-background-200'>
        <Textarea
          className='flex-1 h-auto border-[1px] rounded-md data-[focus=true]:border-primary-50'
          style={{ height: composedHeight + 2 }}
        >
          <TextareaInput
            className='outline-none border-none px-4'
            value={chatInputVal}
            onChangeText={setChatInputVal}
            placeholder='请输入消息'
            multiline
            numberOfLines={1}
            onContentSizeChange={(e) =>
              setInputHeight(e.nativeEvent.contentSize.height)
            }
            onFocus={handleChatInputFocus}
            scrollEnabled={inputHeight > CHAT_INPUT_MAX_HEIGHT}
            style={{
              height: composedHeight,
              textAlignVertical: 'top',
            }}
          />
        </Textarea>
        {chatInputVal ? (
          <Button onPress={() => handleSendMessage()}>
            <ButtonText>发送</ButtonText>
          </Button>
        ) : (
          <TouchableOpacity onPress={handleToggleControlPanel}>
            <Icon as='Feather' name='plus-circle' size={28} />
          </TouchableOpacity>
        )}
      </View>
      {showControlPanel && (
        <View className='h-60 border-t-[1px] border-background-200 bg-background-50 -mt-3 py-6 px-8 flex-row gap-8 items-start'>
          <TouchableOpacity
            className='bg-background-0 rounded-md p-3'
            onPress={handleTakePhoto}
          >
            <Icon as='MaterialIcons' name='photo-camera' size={28} />
          </TouchableOpacity>
          <TouchableOpacity
            className='bg-background-0 rounded-md p-3'
            onPress={handleSelectMediumFile}
          >
            <Icon as='FontAwesome' name='photo' size={28} />
          </TouchableOpacity>
        </View>
      )}
      <ImagePreview
        srcs={images}
        visible={imagePreviewVisible}
        index={imagePreviewIndex}
        onClose={() => setImagePreviewVisible(false)}
      />
      {videoPreviewVisible ? (
        <VideoPreview
          source={SERVER_IMAGE_ROOT + video?.path}
          aspectRatio={video?.thumbnail.aspectRatio ?? 1}
          isOpen={videoPreviewVisible}
        />
      ) : null}
    </KeyboardAvoidingView>
  );
};

export default observer(ChatMessage);
