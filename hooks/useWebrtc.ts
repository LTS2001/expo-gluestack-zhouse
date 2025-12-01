import {
  addChatSession,
  createOffer,
  getReceiverInfoListByIdList,
  sendMessage,
} from '@/business';
import {
  ESocketMessageActionEnum,
  EUserIdentityEnum,
  WEBRTC_ICE_SERVERS,
} from '@/constants';
import { IChatSessionUser } from '@/global';
import { chatStore, webrtcStore } from '@/stores';
import { useCallback, useEffect, useState } from 'react';
import { mediaDevices, RTCPeerConnection } from 'react-native-webrtc';
import useBackHandlers from './useBackHandlers';

/**
 * used under the watch of mobx
 */
export default function useWebrtc() {
  const [offerUser, setOfferUser] = useState<IChatSessionUser>();
  const [answerUser, setAnswerUser] = useState<IChatSessionUser>();

  const createPeerConnection = useCallback(() => {
    const { setPeerConnection, setRemoteMediaStream, setConnectionState } =
      webrtcStore;
    try {
      const pc = new RTCPeerConnection({
        iceServers: WEBRTC_ICE_SERVERS,
        iceTransportPolicy: 'all',
      }) as any;

      // listen for ice candidates, this event will not trigger until after setLocalDescription
      const iceCandidateHandler = (event: any) => {
        if (event.candidate) {
          const {
            role,
            offerIdentity,
            offerId,
            setWebrtcAnswerIdentity,
            setWebrtcAnswerId,
          } = webrtcStore;
          const { receiverId } = chatStore;
          if (role === 'offer') {
            const [toIdentity, _id] = receiverId.split(',');
            const toId = Number(_id);
            sendMessage({
              toIdentity,
              toId,
              active: ESocketMessageActionEnum.WebrtcOfferIce,
              data: JSON.stringify(event.candidate),
            });
            setWebrtcAnswerIdentity(toIdentity);
            setWebrtcAnswerId(toId);
          } else if (role === 'answer') {
            sendMessage({
              toIdentity: offerIdentity!,
              toId: offerId!,
              active: ESocketMessageActionEnum.WebrtcAnswerIce,
              data: JSON.stringify(event.candidate),
            });
          }
        }
      };
      pc.addEventListener('icecandidate', iceCandidateHandler);

      // listen for connection state changes
      const connectionStateHandler = () => {
        const state = pc.connectionState;
        setConnectionState(state);
      };
      pc.addEventListener('connectionstatechange', connectionStateHandler);

      // listening to remote streams
      const trackHandler = (event: any) => {
        if (event.streams && event.streams[0]) {
          setRemoteMediaStream(event.streams[0]);
        }
      };
      pc.addEventListener('track', trackHandler);

      setConnectionState(pc.connectionState);
      setPeerConnection(pc);
      return pc;
    } catch (error) {
      console.error('webrtc: failed to create peer connection', error);
      return null;
    }
  }, []);

  const initializeLocalStream = useCallback(async () => {
    const { peerConnection, setLocalMediaStream } = webrtcStore;
    try {
      const stream = await mediaDevices.getUserMedia({
        video: {
          width: 1280,
          height: 720,
          frameRate: 30,
        },
        audio: true,
      });
      setLocalMediaStream(stream);
      // add a local stream to a peer to peer connection
      if (peerConnection) {
        stream.getTracks().forEach((track) => {
          peerConnection?.addTrack(track, stream);
        });
      }
      return stream;
    } catch (error) {
      console.error('webrtc: failed to get user media', error);
      return null;
    }
  }, []);

  /**
   * webrtc init function
   */
  useEffect(() => {
    const { role, peerConnection, setIsWebrtcPage } = webrtcStore;
    const initWebRTC = async () => {
      if (peerConnection) return;
      // create peer to peer connection
      const pc = createPeerConnection();
      if (!pc) {
        console.error('webrtc: failed to create peer connection');
        return;
      }
      // initialize local stream
      const stream = await initializeLocalStream();
      if (!stream) {
        console.error('webrtc: failed to get user media');
        return;
      }
      if (role === 'offer') {
        createOffer();
      }
    };
    initWebRTC();
    setIsWebrtcPage(true);
  }, [initializeLocalStream, createPeerConnection]);

  /**
   * get offer/answer and session info
   */
  useEffect(() => {
    const initWebrtcInfo = async () => {
      const { role, offerId, offerIdentity, setWebrtcSession } = webrtcStore;
      const { receiverId } = chatStore;
      if (role === 'answer' && offerId && offerIdentity) {
        const res = await getReceiverInfoListByIdList([
          { identity: offerIdentity, id: offerId },
        ]);
        setOfferUser(res[0]);
        chatStore.setChatReceiver(res[0]);
        await addChatSession();
      } else if (role === 'offer' && receiverId) {
        const [_identity, _id] = receiverId.split(',');
        const identity = _identity as EUserIdentityEnum;
        const id = Number(_id);
        const res = await getReceiverInfoListByIdList([{ id, identity }]);
        setAnswerUser(res[0]);
      }
      if (chatStore.currentChatSession)
        setWebrtcSession(chatStore.currentChatSession);
      else console.error('webrtc: chat session is undefine');
    };
    initWebrtcInfo();
  }, []);

  useBackHandlers(() => {
    webrtcStore.setIsWebrtcPage(false);
    return false;
  });

  return {
    offerUser,
    answerUser,
  };
}
