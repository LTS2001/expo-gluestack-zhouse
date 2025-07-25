import { ITencentMapLocation } from '@/global';
import mitt from 'mitt';
import {
  GET_CHAT_MESSAGE,
  GET_CURRENT_LAST_ONE_MESSAGE,
  GET_LANDLORD_REPORT,
  GET_LOCATION,
  GET_PENDING_LEASE,
  GET_SESSION_VARIOUS,
  GET_TENANT_LEASE_HOUSE,
  GET_TENANT_REPORT,
} from './event-name';

const emitter = mitt<{
  [GET_LOCATION]: ITencentMapLocation;
  [GET_TENANT_LEASE_HOUSE]: void;
  [GET_TENANT_REPORT]: void;
  [GET_PENDING_LEASE]: void;
  [GET_LANDLORD_REPORT]: void;
  [GET_CHAT_MESSAGE]: void;
  [GET_CURRENT_LAST_ONE_MESSAGE]: void;
  [GET_SESSION_VARIOUS]: void;
}>();

export default emitter;
