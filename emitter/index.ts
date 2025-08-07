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
  [EventName.GET_CURRENT_LAST_ONE_MESSAGE]: void;
  [EventName.GET_SESSION_VARIOUS]: void;
}>();

export default emitter;
