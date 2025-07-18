import { ITencentMapLocation } from '@/global';
import mitt from 'mitt';
import { GET_LOCATION } from './event-name';

const emitter = mitt<{
  [GET_LOCATION]: ITencentMapLocation;
}>();

export default emitter;
