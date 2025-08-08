/**
 * websocket message types
 */
export const SOCKET_MESSAGES = {
  CONNECT: 'Connect',
  ALREADY_CONNECTED: 'AlreadyConnected',
  HEARTBEAT: 'Heartbeat',
  GET_PENDING_LEASE: 'GetPendingLease',
  GET_LANDLORD_REPORT: 'GetLandlordReport',
  GET_TENANT_LEASE_HOUSE: 'GetTenantLeaseHouse',
  GET_TENANT_REPORT: 'GetTenantReport',
  GET_CHAT_MESSAGE: 'GetChatMessage',
};

// for backward compatibility, keep the original exports
export const SOCKET_GET_PENDING_LEASE = SOCKET_MESSAGES.GET_PENDING_LEASE;
export const SOCKET_GET_LANDLORD_REPORT = SOCKET_MESSAGES.GET_LANDLORD_REPORT;
export const SOCKET_GET_TENANT_LEASE_HOUSE =
  SOCKET_MESSAGES.GET_TENANT_LEASE_HOUSE;
export const SOCKET_GET_TENANT_REPORT = SOCKET_MESSAGES.GET_TENANT_REPORT;
export const SOCKET_GET_CHAT_MESSAGE = SOCKET_MESSAGES.GET_CHAT_MESSAGE;
export const SOCKET_HEARTBEAT = SOCKET_MESSAGES.HEARTBEAT;
export const SOCKET_CONNECT = SOCKET_MESSAGES.CONNECT;
export const SOCKET_ALREADY_CONNECTED = SOCKET_MESSAGES.ALREADY_CONNECTED;
/**
 * heartbeat configuration
 */
export const SOCKET_HEARTBEAT_INTERVAL = 30000; // 30 seconds send heartbeat
export const SOCKET_HEARTBEAT_TIMEOUT = 10000; // 10 seconds no heartbeat response, consider disconnected

/**
 * reconnection configuration
 */
export const SOCKET_MAX_RECONNECT_ATTEMPTS = 10; // maximum reconnection attempts
export const SOCKET_BASE_RECONNECT_DELAY = 1000; // base reconnection delay (milliseconds)
export const SOCKET_MAX_RECONNECT_DELAY = 30000; // maximum reconnection delay (milliseconds)

/**
 * message queue configuration
 */
export const SOCKET_MAX_QUEUE_SIZE = 100; // maximum queue size
export const SOCKET_QUEUE_TIMEOUT = 60000; // message queue timeout (milliseconds)

/**
 * websocket connection state enum
 */
export enum ConnectionState {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  RECONNECTING = 'reconnecting',
}
