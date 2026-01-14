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
    urls: 'turn:your-server-ip:3478',
    username: '*',
    credential: '*',
  },
  {
    urls: 'turns:your-server-ip:5349',
    username: '*',
    credential: '*',
  },
];
