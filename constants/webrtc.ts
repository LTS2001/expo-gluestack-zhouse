import { env } from '@/configs';

export const WEBRTC_ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
  { urls: 'stun:stun3.l.google.com:19302' },
  { urls: 'stun:stun4.l.google.com:19302' },
  /**
   * add the TURN server, because of the symmetric NAT,
   * the TURN server becomes an indispensable part,
   * and the probability of successful P2P connection with STUN alone is very small.
   *
   * 1. this is very important unless the devices are all in the same LAN.
   */
  {
    urls: `turn:${env.APP_WEBRTC_TURN_SERVER_IP}:3478`,
    username: env.APP_WEBRTC_TURN_USERNAME,
    credential: env.APP_WEBRTC_TURN_CREDENTIAL,
  },
  {
    urls: `turns:${env.APP_WEBRTC_TURN_SERVER_IP}:5349`,
    username: env.APP_WEBRTC_TURN_USERNAME,
    credential: env.APP_WEBRTC_TURN_CREDENTIAL,
  },
];
