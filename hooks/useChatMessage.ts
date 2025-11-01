import {
  addChatMessage,
  addChatSession,
  generateVideoThumbnail,
  getChatMessageList,
  getChatSessionLastOneMessageList,
  getChatSessionList,
  pickMediumFile,
  sendMessage,
  takeMediumFile,
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
import { handleMediumThumbnail } from '@/utils';
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
   * @description handle send message
   */
  const handleSendMessage = useCallback(
    async (messageModel?: TMessageModel) => {
      console.log('messageModel', messageModel);

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

      const [identity, id] = receiverId.split(',');
      // send message to receiver via websocket
      sendMessage({
        toIdentity: identity === CHAT_SIGN_TENANT ? TENANT : LANDLORD,
        toId: Number(id),
        active: SOCKET_GET_CHAT_MESSAGE,
      });
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
    ]
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
    // 处理所有选中的文件（并发上传）
    const uploadPromises = assets.map(
      async (asset): Promise<IMediumThumbnail | IVideo | null> => {
        const assetType = asset.type;
        const { uri, width, height, duration } = asset;
        if (assetType === 'image') {
          const imageUrl = await uploadImageToServer({ uri });
          return handleMediumThumbnail({
            path: imageUrl,
            width,
            height,
            aspectRatio: Number((width / height).toFixed(2)),
          });
        } else if (assetType === 'video') {
          const [thumbnail, videoUrl] = await Promise.all([
            generateVideoThumbnail(uri),
            uploadVideoToServer({ uri }),
          ]);
          return {
            thumbnail: handleMediumThumbnail(thumbnail),
            path: videoUrl,
            width,
            height,
            aspectRatio: Number((width / height).toFixed(2)),
            duration: duration ?? 0,
          };
        }
        return null;
      }
    );
    const mediumContents = (await Promise.all(uploadPromises)).filter(
      Boolean
    ) as (IMediumThumbnail | IVideo)[];
    mediumContents.forEach((content) => {
      // is video
      if ('thumbnail' in content && content.thumbnail)
        handleSendMessage({
          content,
          type: ECHAT_MESSAGE_TYPE.VIDEO,
        });
      // is image
      else
        handleSendMessage({
          content,
          type: ECHAT_MESSAGE_TYPE.IMAGE,
        });
    });

    setTimeout(() => {
      handleChatAreaScrollToBottom();
    }, 100);
  }, [handleChatAreaScrollToBottom, handleSendMessage]);

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
  };
}
