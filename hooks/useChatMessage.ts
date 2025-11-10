import {
  addChatMessage,
  addChatSession,
  generateVideoThumbnailLocal,
  getChatMessageList,
  getChatSessionLastOneMessageList,
  getChatSessionList,
  pickMediumFile,
  sendMessage as sendWebSocketMessage,
  takeMediumFile,
  updateChatMessageContent,
  updateChatMessageUploadProgress,
  uploadImageToServer,
  uploadVideoToServer,
} from '@/business';
import {
  CHAT_INPUT_MAX_HEIGHT,
  CHAT_INPUT_MIN_HEIGHT,
  CHAT_SIGN_TENANT,
  ECHAT_MESSAGE_TYPE,
  LANDLORD,
  SOCKET_GET_CHAT_MESSAGE,
  TENANT,
} from '@/constants';
import { IMediumThumbnail, IVideo, TMessageModel } from '@/global';
import { putLeaveChatMessageApi } from '@/request';
import { chatStore } from '@/stores';
import { handleMediumThumbnail, isLocalPath } from '@/utils';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Keyboard } from 'react-native';
import useBackHandlers from './useBackHandlers';
import useKeyboardHeight from './useKeyboardHeight';

interface IUseChatMessageProps {
  title: string;
}
export default function useChatMessage(props: IUseChatMessageProps) {
  const { clearChatMessageList, senderId, receiverId, currentChatSession } =
    chatStore;
  const { title } = props;
  const chatAreaScrollViewRef = useRef<FlatList>(null);
  const [inputHeight, setInputHeight] = useState(0);
  const [chatInputVal, setChatInputVal] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const [showControlPanel, setShowControlPanel] = useState(false);
  const navigation = useNavigation();
  const msgIdCount = useRef(0);
  /**
   * @description set the navigation title to the chat receiver
   */
  useEffect(() => {
    navigation.setOptions({
      title,
    });
  }, [title, navigation]);

  useEffect(
    () => {
      /**
       * Due to the reason of "emitter.emit(GET_CHAT_MESSAGE)", when a page is in a session page or a chat page,
       * it will be triggered by the acceptance of socket.
       * The logic of "setchatMessageList" inside is specifically for chat pages,
       * and it will also be triggered when it is in a session page,
       * so it is necessary to empty the "chatMessageList" before entering the chat page.
       */
      clearChatMessageList();
      addChatSession();
      getChatMessageList();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  /**
   * @description when leave chat, execute the following logic
   */
  useBackHandlers(() => {
    chatStore.setContinueGetMessage(true);
    clearChatMessageList();
    putLeaveChatMessageApi({
      sessionId: currentChatSession?.id!,
      senderId,
      receiverId,
    });
    getChatSessionLastOneMessageList();
    getChatSessionList();
    return false;
  });

  /**
   * @description chat area scroll to bottom (in inverted mode, offset 0 is the bottom)
   */
  const handleChatAreaScrollToBottom = useCallback(() => {
    chatAreaScrollViewRef.current?.scrollToOffset({
      offset: 0,
      animated: true,
    });
  }, []);

  /**
   * @description use keyboard height
   */
  const { fakeView } = useKeyboardHeight({
    handleKeyboardHeightChange: handleChatAreaScrollToBottom,
    offsetY: -10,
  });

  /**
   * @description chat message input area height
   */
  const composedHeight = useMemo(
    () =>
      Math.min(
        Math.max(inputHeight || CHAT_INPUT_MIN_HEIGHT, CHAT_INPUT_MIN_HEIGHT),
        CHAT_INPUT_MAX_HEIGHT
      ),
    [inputHeight]
  );

  /**
   * @description handle chat input focus
   */
  const handleChatInputFocus = useCallback(() => {
    setShowControlPanel(false); // 键盘弹出时隐藏控制面板
    setTimeout(() => {
      handleChatAreaScrollToBottom();
      setInputFocused(true);
    }, 100);
  }, [handleChatAreaScrollToBottom]);

  /**
   * @description handle chat input blur
   */
  const handleChatInputBlur = useCallback(() => {
    setInputFocused(false);
  }, []);

  /**
   * @description handle toggle control panel
   */
  const handleToggleControlPanel = useCallback(() => {
    Keyboard.dismiss(); // 隐藏键盘
    setShowControlPanel(true); // 显示控制面板
  }, []);

  /**
   * @description handle hide control panel
   */
  const handleHideControlPanel = useCallback(() => {
    setShowControlPanel(false);
  }, []);

  /**
   * @description send websocket message to receiver
   */
  const sendMessage = useCallback(() => {
    const [identity, id] = receiverId.split(',');
    sendWebSocketMessage({
      toIdentity: identity === CHAT_SIGN_TENANT ? TENANT : LANDLORD,
      toId: Number(id),
      active: SOCKET_GET_CHAT_MESSAGE,
    });
  }, [receiverId]);

  /**
   * @description handle send message
   */
  const handleSendMessage = useCallback(
    async (messageModel?: TMessageModel) => {
      setChatInputVal('');
      setInputHeight(CHAT_INPUT_MIN_HEIGHT);
      // Build the message data based on whether messageModel is provided
      if (messageModel)
        await addChatMessage(
          {
            sessionId: currentChatSession?.id!,
            senderId,
            receiverId,
            ...messageModel,
          },
          { msgIdCount: msgIdCount.current++ }
        );
      else
        await addChatMessage(
          {
            sessionId: currentChatSession?.id!,
            senderId,
            receiverId,
            type: ECHAT_MESSAGE_TYPE.TEXT,
            content: chatInputVal,
          },
          { msgIdCount: msgIdCount.current++ }
        );
      sendMessage();
      // scroll to bottom after sending message
      setTimeout(() => {
        handleChatAreaScrollToBottom();
      }, 100);
    },
    [
      currentChatSession,
      senderId,
      receiverId,
      chatInputVal,
      handleChatAreaScrollToBottom,
      sendMessage,
    ]
  );

  /**
   * @description upload image and update message content
   */
  const uploadImageAndUpdateMessage = useCallback(
    async (
      messageId: number | string,
      imageUri: string,
      initialContent: IMediumThumbnail
    ) => {
      try {
        const imageUrl = await uploadImageToServer({
          uri: imageUri,
          onProgress(progress) {
            updateChatMessageUploadProgress(messageId, progress, 'uploading');
          },
        });

        const finalContent = handleMediumThumbnail({
          ...initialContent,
          path: imageUrl,
        });
        await updateChatMessageContent(messageId, JSON.stringify(finalContent));
        sendMessage();
      } catch (error) {
        console.error('upload image failed:', error);
        updateChatMessageUploadProgress(messageId, 0, 'failed');
        throw error;
      }
    },
    [sendMessage]
  );

  /**
   * @description upload video (thumbnail and video file) and update message content
   */
  const uploadVideoAndUpdateMessage = useCallback(
    async (
      messageId: number | string,
      videoUri: string,
      thumbnailUri: string,
      initialContent: IVideo
    ) => {
      try {
        const [thumbnailUrl, videoUrl] = await Promise.all([
          uploadImageToServer({
            uri: thumbnailUri,
          }),
          uploadVideoToServer({
            uri: videoUri,
            onProgress(progress) {
              updateChatMessageUploadProgress(messageId, progress, 'uploading');
            },
          }),
        ]);
        const finalContent = {
          ...initialContent,
          path: videoUrl,
          thumbnail: {
            ...initialContent.thumbnail,
            path: thumbnailUrl,
          },
        };
        await updateChatMessageContent(messageId, JSON.stringify(finalContent));
        sendMessage();
      } catch (error) {
        console.error('upload video or thumbnail failed:', error);
        updateChatMessageUploadProgress(messageId, 0, 'failed');
        throw error;
      }
    },
    [sendMessage]
  );

  /**
   * @description handle select image or video from gallery
   */
  const handleSelectMediumFile = useCallback(async () => {
    const { canceled, assets } = await pickMediumFile({
      mediaTypes: ['images', 'videos'],
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 3,
    });
    if (canceled) return;

    // add messages to list and start uploading
    assets.map(async (asset) => {
      const { uri, width, height, duration, type: assetType } = asset;
      const rawContent: IMediumThumbnail = {
        path: uri,
        width,
        height,
        aspectRatio: Number((width / height).toFixed(2)),
      };

      let messageId: number | string;
      let messageType: ECHAT_MESSAGE_TYPE;
      let initialContent: IMediumThumbnail | IVideo;

      if (assetType === 'image') {
        messageType = ECHAT_MESSAGE_TYPE.IMAGE;
        initialContent = handleMediumThumbnail(rawContent);
        // add message to list with local path and uploading status
        messageId = await addChatMessage(
          {
            sessionId: currentChatSession?.id!,
            senderId,
            receiverId,
            type: messageType,
            content: initialContent,
          },
          {
            msgIdCount: msgIdCount.current++,
            skipApiCall: true, // call API after upload completes
          }
        );
        // set uploading status
        updateChatMessageUploadProgress(messageId, 0, 'uploading');

        // upload image and update message
        await uploadImageAndUpdateMessage(messageId, uri, initialContent);
      } else if (assetType === 'video') {
        messageType = ECHAT_MESSAGE_TYPE.VIDEO;
        let messageId: number | string | undefined;

        try {
          // generate video thumbnail local
          const localThumbnail = await generateVideoThumbnailLocal(uri, 3000);
          const thumbnailData = handleMediumThumbnail(localThumbnail);
          initialContent = {
            ...rawContent,
            thumbnail: thumbnailData,
            duration: duration ?? 0,
          };

          // add message to list with local thumbnail path
          messageId = await addChatMessage(
            {
              sessionId: currentChatSession?.id!,
              senderId,
              receiverId,
              type: messageType,
              content: initialContent,
            },
            {
              msgIdCount: msgIdCount.current++,
              skipApiCall: true,
            }
          );
          // set upload status
          updateChatMessageUploadProgress(messageId, 0, 'uploading');

          // upload video and update message
          await uploadVideoAndUpdateMessage(
            messageId,
            uri,
            localThumbnail.path,
            initialContent
          );
        } catch {
          // error already handled in uploadVideoAndUpdateMessage
          if (!messageId) {
            // if message wasn't created yet, try to create a failed message
            try {
              messageId = await addChatMessage(
                {
                  sessionId: currentChatSession?.id!,
                  senderId,
                  receiverId,
                  type: messageType,
                  content: {
                    ...rawContent,
                    thumbnail: {
                      path: '',
                      width: 0,
                      height: 0,
                      aspectRatio: 1,
                    },
                    duration: duration ?? 0,
                  },
                },
                {
                  msgIdCount: msgIdCount.current++,
                  skipApiCall: true,
                }
              );
              updateChatMessageUploadProgress(messageId, 0, 'failed');
            } catch (err) {
              console.error('add video message failed:', err);
            }
          }
        }
      }
    });

    setTimeout(() => {
      handleChatAreaScrollToBottom();
    }, 100);
  }, [
    currentChatSession,
    senderId,
    receiverId,
    handleChatAreaScrollToBottom,
    msgIdCount,
    uploadImageAndUpdateMessage,
    uploadVideoAndUpdateMessage,
  ]);

  /**
   * @description handle take photo or record video
   */
  const handleTakePhoto = useCallback(async () => {
    const result = await takeMediumFile({
      mediaTypes: ['images'],
      quality: 1,
    });
    if (result.canceled) return;
    const assetType = result.assets[0].type;
    const { uri, width, height } = result.assets[0];

    if (assetType === 'image') {
      const imageUrl = await uploadImageToServer({ uri });
      await handleSendMessage({
        content: handleMediumThumbnail({
          path: imageUrl,
          width,
          height,
          aspectRatio: Number((width / height).toFixed(2)),
        }),
        type: ECHAT_MESSAGE_TYPE.IMAGE,
      });
    }

    setTimeout(() => {
      handleChatAreaScrollToBottom();
    }, 100);
  }, [handleChatAreaScrollToBottom, handleSendMessage]);

  /**
   * @description handle retry failed message
   */
  const handleRetryMessage = useCallback(
    async (messageId: number | string) => {
      const { chatMessageList } = chatStore;
      if (!chatMessageList) return;

      const failedMessage = chatMessageList.find((msg) => msg.id === messageId);
      if (!failedMessage || failedMessage.uploadStatus !== 'failed') return;

      const { type, content } = failedMessage;
      const parsedContent =
        type === ECHAT_MESSAGE_TYPE.TEXT
          ? content
          : JSON.parse(content as string);

      // set uploading status to uploading
      updateChatMessageUploadProgress(messageId, 0, 'uploading');

      try {
        if (type === ECHAT_MESSAGE_TYPE.TEXT) {
          // text message, just resend
          await handleSendMessage({
            type: ECHAT_MESSAGE_TYPE.TEXT,
            content: parsedContent,
          });
        } else if (type === ECHAT_MESSAGE_TYPE.IMAGE) {
          const imagePath = parsedContent.path;
          const isImageLocal = isLocalPath(imagePath);
          if (isImageLocal) {
            // upload image and update message
            await uploadImageAndUpdateMessage(
              messageId,
              imagePath,
              parsedContent
            );
          } else {
            // send message to receiver via websocket
            sendMessage();
          }
        } else if (type === ECHAT_MESSAGE_TYPE.VIDEO) {
          const videoPath = parsedContent.path;
          const thumbnailPath = parsedContent.thumbnail?.path;
          // check if video and thumbnail are local paths
          const isVideoLocal = isLocalPath(videoPath);
          const isThumbnailLocal = isLocalPath(thumbnailPath);

          if (isVideoLocal || isThumbnailLocal) {
            // determine the URI to upload
            const finalVideoUri = isVideoLocal ? videoPath : undefined;
            const finalThumbnailUri = isThumbnailLocal
              ? thumbnailPath!
              : parsedContent.thumbnail?.path || '';

            if (finalVideoUri && finalThumbnailUri) {
              // both need to upload, use the unified upload function
              await uploadVideoAndUpdateMessage(
                messageId,
                finalVideoUri,
                finalThumbnailUri,
                parsedContent
              );
            } else if (finalVideoUri) {
              // only upload video (thumbnail is already server path)
              const videoUrl = await uploadVideoToServer({
                uri: finalVideoUri,
                onProgress(progress) {
                  updateChatMessageUploadProgress(
                    messageId,
                    progress,
                    'uploading'
                  );
                },
              });

              const finalContent = {
                ...parsedContent,
                path: videoUrl,
              };
              await updateChatMessageContent(
                messageId,
                JSON.stringify(finalContent)
              );

              sendMessage();
            } else if (
              finalThumbnailUri &&
              finalThumbnailUri !== thumbnailPath
            ) {
              // only upload thumbnail (video is already server path)
              const thumbnailUrl = await uploadImageToServer({
                uri: finalThumbnailUri,
              });

              const finalContent = {
                ...parsedContent,
                thumbnail: {
                  ...parsedContent.thumbnail,
                  path: thumbnailUrl,
                },
              };
              await updateChatMessageContent(
                messageId,
                JSON.stringify(finalContent)
              );

              sendMessage();
            }
          } else {
            // if neither are local paths, just resend
            await handleSendMessage({
              type: ECHAT_MESSAGE_TYPE.VIDEO,
              content: parsedContent,
            });
          }
        }
      } catch (error) {
        console.error('retry message failed:', error);
        updateChatMessageUploadProgress(messageId, 0, 'failed');
      }
    },
    [
      handleSendMessage,
      uploadImageAndUpdateMessage,
      uploadVideoAndUpdateMessage,
      sendMessage,
    ]
  );

  return {
    chatAreaScrollViewRef,
    // adaptive height of chat input box in bottom area
    composedHeight,
    // initial height of chat input box in bottom area
    inputHeight,
    setInputHeight,
    chatInputVal,
    setChatInputVal,
    // fake view for keyboard height
    fakeView,
    // whether the chat input box is focused
    inputFocused,
    showControlPanel,
    handleHideControlPanel,
    // handle chat input focus
    handleChatInputFocus,
    // handle chat input blur
    handleChatInputBlur,
    // handle toggle control panel
    handleToggleControlPanel,
    handleChatAreaScrollToBottom,
    handleSendMessage,
    handleSelectMediumFile,
    handleTakePhoto,
    handleRetryMessage,
  };
}
