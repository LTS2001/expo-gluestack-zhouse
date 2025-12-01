import { ITencentMapLocation } from '@/global';
import mitt from 'mitt';

export enum EEventNameEnum {
  GetLocation = 'GetLocation',
  /**
   * webrtc create answer
   */
  WebrtcAnswer = 'WebrtcAnswer',
  /**
   * webrtc offer ice
   */
  WebrtcOfferIce = 'WebrtcOfferIce',
  /**
   * webrtc answer ice
   */
  WebrtcAnswerIce = 'WebrtcAnswerIce',
}

const emitter = mitt<{
  [EEventNameEnum.GetLocation]: ITencentMapLocation;
  [EEventNameEnum.WebrtcOfferIce]: string;
  [EEventNameEnum.WebrtcAnswer]: string;
  [EEventNameEnum.WebrtcAnswerIce]: string;
}>();

export default emitter;
