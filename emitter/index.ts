import { ITencentMapLocation } from '@/global';
import mitt from 'mitt';
import * as EventName from './event-name';

const emitter = mitt<{
  [EventName.GET_LOCATION]: ITencentMapLocation;
  [EventName.GET_TENANT_LEASE_HOUSE]: void;
  [EventName.GET_TENANT_REPORT]: void;
  [EventName.GET_PENDING_LEASE]: void;
  [EventName.GET_LANDLORD_REPORT]: void;
  [EventName.GET_CHAT_MESSAGE]: void;
  [EventName.WEBRTC_OFFER]: void;
  [EventName.WEBRTC_OFFER_ICE]: void;
  [EventName.WEBRTC_ANSWER]: void;
  [EventName.WEBRTC_ANSWER_ICE]: void;
  [EventName.WEBRTC_ANSWER_REJECT]: void;
}>();

export default emitter;
