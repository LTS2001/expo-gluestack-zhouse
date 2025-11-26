import { IChatSession, TIdentity } from '@/global';
import { configure, makeAutoObservable } from 'mobx';
import { type MediaStream, type RTCPeerConnection } from 'react-native-webrtc';
configure({
  enforceActions: 'never',
});
class WebrtcStore {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  /**
   * role: offer | answer
   * @default offer
   */
  role: 'offer' | 'answer' = 'offer';

  /**
   * display floating window during video call
   */
  showFloatWindow: boolean = false;

  /**
   * mark whether it is a webrtc page
   */
  isWebrtcPage: boolean = false;

  /**
   * has it been connected?
   */
  isConnected: boolean = false;

  /**
   * webrtc connection state
   */
  connectionState: RTCPeerConnectionState | string = '';

  /**
   * webrtc connection state map to text
   */
  connectionStateText: string = '';

  /**
   * webrtc call session
   */
  webrtcSession: IChatSession | undefined = undefined;

  /**
   * webrtc offer identity
   */
  offerIdentity: TIdentity | undefined = undefined;

  /**
   * webrtc offer id
   */
  offerId: number | undefined = undefined;

  /**
   * webrtc offer
   */
  offer: any = undefined;

  /**
   * offer ice list
   */
  iceCandidateList: any[] | undefined = undefined;

  /**
   * webrtc answer identity
   */
  answerIdentity: TIdentity | undefined = undefined;

  /**
   * webrtc answer id
   */
  answerId: number | undefined = undefined;

  /**
   * webrtc answer
   */
  answer: any = undefined;

  /**
   * answer ice list
   */
  answerIceList: any[] | undefined = undefined;

  /**
   * large viewport and small viewport are transformed into each other
   * false: local media stream
   */
  viewportTurn: boolean = false;

  /**
   * "user" mode and  "environment" mode are transformed into each other
   * false: user mode
   */
  facingModeTurn: boolean = false;

  /**
   * local media stream
   */
  localMediaStream: MediaStream | undefined = undefined;

  /**
   * remote media stream
   */
  remoteMediaStream: MediaStream | undefined = undefined;

  /**
   * mark remote description has been set up (important)
   */
  hasRemoteDescription: boolean = false;

  /**
   * peer connection instance
   */
  peerConnection: RTCPeerConnection | undefined = undefined;

  /**
   * call duration
   */
  callDuration: number = 1;

  /**
   * call duration timer
   */
  callIntervalTimer: ReturnType<typeof setInterval> | undefined = undefined;

  /**
   * whether it is back camera
   */
  isBackCam: boolean = false;

  /**
   * whether it is camera off
   */
  isCameraOff: boolean = false;

  /**
   * whether it is microphone off
   */
  isMicOff: boolean = false;

  setIsBackCam(flag: boolean) {
    this.isBackCam = flag;
  }

  setIsCameraOff(flag: boolean) {
    this.isCameraOff = flag;
  }

  setIsMicOff(flag: boolean) {
    this.isMicOff = flag;
  }

  setCallDuration(duration: number) {
    this.callDuration = duration;
  }

  clearCallDuration() {
    this.callDuration = 1;
  }

  setCallIntervalTimer(timer: ReturnType<typeof setInterval>) {
    this.callIntervalTimer = timer;
  }

  clearCallIntervalTimer() {
    clearInterval(this.callIntervalTimer);
    this.callIntervalTimer = undefined;
  }

  setPeerConnection(peer: RTCPeerConnection) {
    this.peerConnection = peer;
  }

  clearPeerConnection() {
    this.peerConnection = undefined;
  }

  setRemoteMediaStream(remoteMediaStream: MediaStream) {
    this.remoteMediaStream = remoteMediaStream;
  }

  clearRemoteMediaStream() {
    this.remoteMediaStream = undefined;
  }

  setHasRemoteDescription(flag: boolean) {
    this.hasRemoteDescription = flag;
  }

  setLocalMediaStream(localMediaStream: MediaStream) {
    this.localMediaStream = localMediaStream;
  }

  clearLocalMediaStream() {
    this.localMediaStream = undefined;
  }

  setViewportTurn(viewportTurn: boolean) {
    this.viewportTurn = viewportTurn;
  }

  setFacingModeTurn(modeTurn: boolean) {
    this.facingModeTurn = modeTurn;
  }

  setConnectionState(state: RTCPeerConnectionState) {
    this.connectionState = state;
  }

  clearConnectionState() {
    this.connectionState = '';
  }

  setConnectionStateText(text: string) {
    this.connectionStateText = text;
  }

  setShowFloatWindow(flag: boolean) {
    this.showFloatWindow = flag;
  }

  setIsWebrtcPage(flag: boolean) {
    this.isWebrtcPage = flag;
  }

  setIsConnected(flag: boolean) {
    this.isConnected = flag;
  }

  /**
   * set webrtc session information
   */
  setWebrtcSession(chatSession: IChatSession) {
    this.webrtcSession = chatSession;
  }

  /**
   * clear webrtc session information
   */
  clearWebrtcSession() {
    this.webrtcSession = undefined;
  }

  /**
   * set role
   * @param role 'offer' | 'answer'
   */
  setRole(role: 'offer' | 'answer') {
    this.role = role;
  }

  /**
   * clear role
   */
  clearWebrtcRole() {
    this.role = 'offer';
  }

  /**
   * set webrtc offer
   * @param offer
   */
  setWebrtcOffer(offer: any) {
    this.offer = offer;
  }

  /**
   * clear webrtc offer
   */
  clearWebrtcOffer() {
    this.offer = undefined;
  }

  /**
   * set webrtc offer identity
   * @param identity
   */
  setWebrtcOfferIdentity(identity: TIdentity) {
    this.offerIdentity = identity;
  }

  /**
   * clear webrtc offer identity
   */
  clearWebrtcOfferIdentity() {
    this.offerIdentity = undefined;
  }

  /**
   * set webrtc offer id
   * @param id
   */
  setWebrtcOfferId(id: number) {
    this.offerId = id;
  }

  /**
   * clear webrtc offer id
   */
  clearWebrtcOfferId() {
    this.offerId = undefined;
  }

  /**
   * set webrtc answer identity
   * @param identity
   */
  setWebrtcAnswerIdentity(identity: TIdentity) {
    this.answerIdentity = identity;
  }

  /**
   * clear webrtc answer identity
   */
  clearWebrtcAnswerIdentity() {
    this.answerIdentity = undefined;
  }

  /**
   * set webrtc answer id
   * @param id
   */
  setWebrtcAnswerId(id: number) {
    this.answerId = id;
  }

  /**
   * clear webrtc answer id
   */
  clearWebrtcAnswerId() {
    this.answerId = undefined;
  }

  /**
   * set webrtc offer ice list
   * @param ices
   */
  setWebrtcIceCandidateList(ices: any[]) {
    this.iceCandidateList = ices;
  }

  /**
   * clear webrtc offer ice list
   */
  clearWebrtcIceCandidateList() {
    this.iceCandidateList = undefined;
  }

  /**
   * set webrtc answer
   * @param offer
   */
  setWebrtcAnswer(answer: any) {
    this.answer = answer;
  }

  /**
   * clear webrtc answer
   */
  clearWebrtcAnswer() {
    this.answer = undefined;
  }

  /**
   * set webrtc offer ice list
   * @param ices
   */
  setWebrtcAnswerIceList(ices: any[]) {
    this.answerIceList = ices;
  }

  /**
   * clear webrtc answer ice list
   */
  clearWebrtcAnswerIceList() {
    this.answerIceList = undefined;
  }
}
const webrtcStore = new WebrtcStore();
export default webrtcStore;
