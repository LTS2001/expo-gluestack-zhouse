import {
  CHAT_SIGN_TENANT,
  LANDLORD,
  SOCKET_WEBRTC_ANSWER,
  SOCKET_WEBRTC_OFFER,
  TENANT,
} from '@/constants';
import { chatStore, webrtcStore } from '@/stores';
import { sendMessage } from './chat';

/**
 * when dealing with ice candidates, there will be multiple ice candidates,
 * and the arrival time of each ice candidate is different.
 */
export const handleIceCandidate = (iceCandidate?: any) => {
  const {
    peerConnection,
    setWebrtcIceCandidateList,
    iceCandidateList = [],
    clearWebrtcIceCandidateList,
    hasRemoteDescription,
  } = webrtcStore;
  // ice candidates arriving after setting remote description.
  if (hasRemoteDescription && iceCandidate) {
    peerConnection?.addIceCandidate(iceCandidate);
  }
  // ice candidates arriving before setting remote description.
  else if (!hasRemoteDescription && iceCandidate) {
    setWebrtcIceCandidateList([...iceCandidateList, iceCandidate]);
  }
  // after setting the remote description, all the ice candidate lists will be added immediately.
  else if (iceCandidateList?.length && hasRemoteDescription && !iceCandidate) {
    iceCandidateList.forEach((iceCandidate) => {
      peerConnection?.addIceCandidate(iceCandidate);
    });
    clearWebrtcIceCandidateList();
  }
};

/**
 * the initiator creates offer(sdp)
 */
export const createOffer = async () => {
  const { receiverId, senderId } = chatStore;
  const { peerConnection, localMediaStream } = webrtcStore;
  if (!peerConnection || !localMediaStream) {
    console.error('webrtc: peer connection or local stream not initialized');
    return;
  }
  try {
    const offer = await peerConnection.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    });
    // setLocalDescription will trigger the collection of ice
    await peerConnection.setLocalDescription(offer);
    // send the offer(sdp) to the receiver through websocket
    sendMessage({
      toIdentity:
        receiverId.split(',')[0] === CHAT_SIGN_TENANT ? TENANT : LANDLORD,
      toId: Number(receiverId.split(',')[1]),
      fromIdentity:
        senderId.split(',')[0] === CHAT_SIGN_TENANT ? TENANT : LANDLORD,
      fromId: Number(senderId.split(',')[1]),
      active: SOCKET_WEBRTC_OFFER,
      data: JSON.stringify(offer),
    });
    return offer;
  } catch (error) {
    console.error('webrtc: failed to create offer', error);
  }
};

/**
 * the receiver creates answer(sdp)
 */
export const createAnswer = async (offer: any) => {
  const { peerConnection, setHasRemoteDescription } = webrtcStore;
  if (!peerConnection || !offer.sdp) {
    console.error('webrtc: peer connection not initialized or offer invalid');
    return;
  }
  try {
    const { offerId, offerIdentity } = webrtcStore;
    await peerConnection.setRemoteDescription(offer);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    // mark remote description has been set up
    setHasRemoteDescription(true);
    // ice collected before processing
    handleIceCandidate();
    sendMessage({
      toIdentity: offerIdentity!,
      toId: offerId!,
      active: SOCKET_WEBRTC_ANSWER,
      data: JSON.stringify(answer),
    });
    return answer;
  } catch (error) {
    console.error('webrtc: failed to create answer', error);
  }
};

/**
 * the initiator processes the received answer
 */
export const handleAnswer = async (answer: any) => {
  const { peerConnection, setHasRemoteDescription } = webrtcStore;
  if (!peerConnection || !answer.sdp) {
    console.error('webrtc: peer connection not initialized or answer invalid');
    return;
  }
  try {
    await peerConnection.setRemoteDescription(answer);
    // mark remote description has been set up
    setHasRemoteDescription(true);
    // ice collected before processing
    handleIceCandidate();
  } catch (error) {
    console.error('webrtc: failed to set remote description (answer):', error);
  }
};

/**
 * close webrtc connection
 */
export const closeConnection = () => {
  const {
    peerConnection,
    localMediaStream,
    clearLocalMediaStream,
    clearRemoteMediaStream,
    clearPeerConnection,
    clearWebrtcOffer,
    clearWebrtcRole,
    setShowFloatWindow,
    clearConnectionState,
    setIsBackCam,
    setIsCameraOff,
    setIsMicOff,
    clearCallDuration,
    setHasRemoteDescription,
    setViewportTurn,
    setFacingModeTurn,
    clearWebrtcSession,
  } = webrtcStore;
  // 1. clear the peer connection and local media stream
  if (peerConnection) {
    peerConnection.close();
    clearPeerConnection();
  }
  if (localMediaStream) {
    localMediaStream.getTracks().forEach((track) => track.stop());
    clearLocalMediaStream();
  }
  setHasRemoteDescription(false);
  clearLocalMediaStream();
  clearRemoteMediaStream();

  // 2. clear the call info
  setIsBackCam(false);
  setIsCameraOff(false);
  setIsMicOff(false);
  setShowFloatWindow(false);
  setViewportTurn(false);
  setFacingModeTurn(false);
  clearCallDuration();
  clearWebrtcSession();

  // 3. clear the offer and answer info
  clearWebrtcRole();
  clearWebrtcOffer();

  // reset the global connection status to prepare for the next call
  setTimeout(() => {
    clearConnectionState();
  }, 1000);
  console.log('webrtc: cleaning up webrtc');
};
