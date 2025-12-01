/**
 * websocket heartbeat configuration
 */
export enum ESocketHeartbeatEnum {
  /**
   * 30 seconds send heartbeat
   */
  Interval = 30000,
  /**
   * 10 seconds no heartbeat response, consider disconnected
   */
  Timeout = 10000,
}

/**
 * reconnection configuration
 */
export enum ESocketReconnectionEnum {
  /**
   * maximum reconnection attempts
   */
  MaxReconnectionAttempts = 10,
  /**
   * maximum reconnection delay (milliseconds)
   */
  MaxReconnectionDelay = 30000,
  /**
   * base reconnection delay (milliseconds)
   */
  BaseReconnectionDelay = 1000,
}

/**
 * websocket message action enum
 */
export enum ESocketMessageActionEnum {
  Connect = 'Connect',
  Heartbeat = 'Heartbeat',
  GetPendingLease = 'GetPendingLease',
  GetLandlordRepair = 'GetLandlordRepair',
  GetTenantLeaseHouse = 'GetTenantLeaseHouse',
  GetTenantRepair = 'GetTenantRepair',
  GetChatMessage = 'GetChatMessage',
  WebrtcOffer = 'WebrtcOffer',
  WebrtcAnswer = 'WebrtcAnswer',
  WebrtcOfferIce = 'WebrtcOfferIce',
  WebrtcAnswerIce = 'WebrtcAnswerIce',
  WebrtcAnswerReject = 'WebrtcAnswerReject',
  WebrtcHangup = 'WebrtcHangup',
}

/**
 * websocket connection state enum
 */
export enum EConnectionStateEnum {
  Disconnected = 'disconnected',
  Connecting = 'connecting',
  Connected = 'connected',
}
