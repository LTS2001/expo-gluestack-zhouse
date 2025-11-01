import {
  getChatSessionLastOneMessageList,
  getChatSessionList,
  getLeasePendingListByLandlord,
  getRepairListLandlord,
  sendMessage,
} from '@/business';
import {
  ConnectionState,
  LANDLORD,
  SERVER_SOCKET_ROOT,
  SOCKET_ALREADY_CONNECTED,
  SOCKET_BASE_RECONNECT_DELAY,
  SOCKET_CONNECT,
  SOCKET_GET_CHAT_MESSAGE,
  SOCKET_GET_LANDLORD_REPORT,
  SOCKET_GET_PENDING_LEASE,
  SOCKET_GET_TENANT_LEASE_HOUSE,
  SOCKET_GET_TENANT_REPORT,
  SOCKET_HEARTBEAT,
  SOCKET_HEARTBEAT_INTERVAL,
  SOCKET_HEARTBEAT_TIMEOUT,
  SOCKET_MAX_RECONNECT_ATTEMPTS,
  SOCKET_MAX_RECONNECT_DELAY,
  TENANT,
} from '@/constants';
import emitter from '@/emitter';
import {
  GET_CHAT_MESSAGE,
  GET_LANDLORD_REPORT,
  GET_PENDING_LEASE,
  GET_TENANT_LEASE_HOUSE,
  GET_TENANT_REPORT,
} from '@/emitter/event-name';
import { TIdentity } from '@/global';
import { authStore, chatStore, socketStore, userStore } from '@/stores';
import { autorun } from 'mobx';
import { useCallback, useEffect, useRef } from 'react';
import { AppState } from 'react-native';

export default function useSocket() {
  const reconnectTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const heartbeatTimer = useRef<ReturnType<typeof setInterval>>(undefined);
  const heartbeatTimeoutTimer =
    useRef<ReturnType<typeof setTimeout>>(undefined);

  // reconnect counts
  const reconnectAttempts = useRef(0);
  const connectionState = useRef<ConnectionState>(ConnectionState.DISCONNECTED);
  const isManualDisconnect = useRef(false);
  // debounce: delay connection, aggregate multiple changes in a short time
  const autorunDebounceTimer = useRef<
    ReturnType<typeof setTimeout> | undefined
  >(undefined);

  const {
    setWebsocketInstance,
    clearWebsocketInstance,
    setConnectionState,
    setReconnectAttempts,
    setLastConnectedAt,
    clearMessageQueue,
  } = socketStore;

  /**
   * calculate exponential backoff reconnect delay
   */
  const getReconnectDelay = useCallback(() => {
    const delay = Math.min(
      SOCKET_BASE_RECONNECT_DELAY * Math.pow(2, reconnectAttempts.current),
      SOCKET_MAX_RECONNECT_DELAY
    );
    // add random jitter to avoid multiple clients reconnecting at the same time
    return delay + Math.random() * 1000;
  }, []);

  /**
   * start heartbeat detection
   */
  const startHeartbeat = useCallback((ws: WebSocket) => {
    // clear previous heartbeat timer
    if (heartbeatTimer.current) {
      clearInterval(heartbeatTimer.current);
    }
    heartbeatTimer.current = setInterval(() => {
      // send heartbeat
      if (ws.readyState === WebSocket.OPEN) {
        const currentIdentity = authStore.identity;
        const currentUserId = userStore.user?.id;
        if (currentIdentity && currentUserId) {
          sendMessage({
            toIdentity: currentIdentity,
            toId: currentUserId,
            active: SOCKET_HEARTBEAT,
          });

          // set heartbeat timeout detection
          heartbeatTimeoutTimer.current = setTimeout(() => {
            console.log('websocket: heartbeat timeout, reconnecting...');
            ws.close();
          }, SOCKET_HEARTBEAT_TIMEOUT);
        }
      }
    }, SOCKET_HEARTBEAT_INTERVAL);
  }, []);

  /**
   * stop heartbeat detection
   */
  const stopHeartbeat = useCallback(() => {
    if (heartbeatTimer.current) {
      clearInterval(heartbeatTimer.current);
      heartbeatTimer.current = undefined;
    }
    if (heartbeatTimeoutTimer.current) {
      clearTimeout(heartbeatTimeoutTimer.current);
      heartbeatTimeoutTimer.current = undefined;
    }
  }, []);

  /**
   * process message queue
   */
  const processMessageQueue = useCallback(
    (ws: WebSocket) => {
      if (ws.readyState === WebSocket.OPEN) {
        const queue = socketStore.messageQueue;
        if (queue.length > 0) {
          console.log(`websocket: processing ${queue.length} queued messages`);
          /**
           * todo:
           * 后续优化
           * 清空队列，这样子一瞬间清空，后端nodejs服务器可以处理的完吗？会不会丢失
           */
          while (queue.length > 0) {
            const message = queue.shift();
            if (message) {
              ws.send(JSON.stringify(message));
            }
          }
          clearMessageQueue();
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  /**
   * reset reconnect state
   */
  const resetReconnectState = useCallback(
    () => {
      reconnectAttempts.current = 0;
      setReconnectAttempts(0);
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
        reconnectTimer.current = undefined;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  /**
   * listen to app state changes (for network reconnection)
   */
  const handleAppStateChange = useCallback(
    (nextAppState: string) => {
      console.log('websocket: app state changed to ', nextAppState);
      if (
        nextAppState === 'active' &&
        connectionState.current === ConnectionState.DISCONNECTED
      ) {
        console.log('websocket: app became active, attempting to reconnect...');
        resetReconnectState();
        // delay connection to avoid calling connect function before it's defined
        setTimeout(() => {
          connect();
        }, 1000);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  /**
   * reconnect logic
   */
  const reconnect = useCallback(
    () => {
      if (isManualDisconnect.current) return;

      if (reconnectAttempts.current >= SOCKET_MAX_RECONNECT_ATTEMPTS) {
        console.log('websocket: max reconnection attempts reached');
        connectionState.current = ConnectionState.DISCONNECTED;
        setConnectionState(ConnectionState.DISCONNECTED);
        return;
      }

      if (connectionState.current === ConnectionState.RECONNECTING) return;

      connectionState.current = ConnectionState.RECONNECTING;
      setConnectionState(ConnectionState.RECONNECTING);
      reconnectAttempts.current++;
      setReconnectAttempts(reconnectAttempts.current);

      const delay = getReconnectDelay();
      console.log(
        `websocket: reconnecting in ${delay}ms (attempt ${reconnectAttempts.current}/${SOCKET_MAX_RECONNECT_ATTEMPTS})`
      );
      // clear previous reconnect timer
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
        reconnectTimer.current = undefined;
      }
      reconnectTimer.current = setTimeout(() => {
        connect();
      }, delay);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  /**
   * connect to websocket
   */
  const connect = useCallback(
    () => {
      const currentIdentity = authStore.identity;
      const currentUserId = userStore.user?.id;
      isManualDisconnect.current = false;
      if (!currentIdentity || !currentUserId) return;

      // if already connecting, don't reconnect
      if (
        [
          ConnectionState.CONNECTING,
          ConnectionState.CONNECTED,
          ConnectionState.RECONNECTING,
        ].includes(connectionState.current)
      )
        return;

      connectionState.current = ConnectionState.CONNECTING;

      const ws = new WebSocket(
        `${SERVER_SOCKET_ROOT}?${currentIdentity}=${currentUserId}`
      );
      setWebsocketInstance(ws);

      ws.onopen = () => {
        connectionState.current = ConnectionState.CONNECTED;
        setConnectionState(ConnectionState.CONNECTED);
        setLastConnectedAt(new Date());
        resetReconnectState();
        startHeartbeat(ws);
        processMessageQueue(ws);
      };

      ws.onmessage = ({ data }) => {
        console.log(
          `websocket: message received ${data} ${new Date().toLocaleTimeString()}`
        );
        try {
          const parsedData = JSON.parse(data);
          // process business message
          const { active } = parsedData;
          switch (active) {
            case SOCKET_CONNECT:
              console.log('websocket: connected successfully');
              break;
            case SOCKET_ALREADY_CONNECTED:
              console.log('websocket: already connected');
              break;
            case SOCKET_HEARTBEAT:
              if (heartbeatTimeoutTimer.current) {
                clearTimeout(heartbeatTimeoutTimer.current);
                heartbeatTimeoutTimer.current = undefined;
              }
              break;
            case SOCKET_GET_TENANT_LEASE_HOUSE:
              emitter.emit(GET_TENANT_LEASE_HOUSE);
              break;
            case SOCKET_GET_TENANT_REPORT:
              emitter.emit(GET_TENANT_REPORT);
              break;
            case SOCKET_GET_PENDING_LEASE:
              emitter.emit(GET_PENDING_LEASE);
              break;
            case SOCKET_GET_LANDLORD_REPORT:
              emitter.emit(GET_LANDLORD_REPORT);
              break;
            case SOCKET_GET_CHAT_MESSAGE:
              emitter.emit(GET_CHAT_MESSAGE);
              break;
          }
        } catch (error) {
          console.log('websocket: error parsing message ', error);
        }
      };

      ws.onclose = (event) => {
        console.log(`websocket: closed ${event.code} ${event.reason}`);
        connectionState.current = ConnectionState.DISCONNECTED;
        setConnectionState(ConnectionState.DISCONNECTED);
        clearWebsocketInstance();
        stopHeartbeat();

        // if not manually disconnect, try to reconnect
        if (!isManualDisconnect.current && event.code !== 1000) {
          reconnect();
        }
      };

      ws.onerror = (error) => {
        console.log('websocket: error ', error);
        connectionState.current = ConnectionState.DISCONNECTED;
        setConnectionState(ConnectionState.DISCONNECTED);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  /**
   * manually disconnect
   */
  const disconnect = useCallback(
    () => {
      isManualDisconnect.current = true;
      const ws = socketStore.socketInstance;
      if (ws) {
        ws.close(1000, 'Manual disconnect');
      }
      stopHeartbeat();
      resetReconnectState();
      clearWebsocketInstance();
      connectionState.current = ConnectionState.DISCONNECTED;
      setConnectionState(ConnectionState.DISCONNECTED);
      emitter.all.clear();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  /**
   * subscribe websocket event
   */
  const subscribeWebSocketEvent = useCallback(
    (currentIdentity: TIdentity, currentUserId: number) => {
      // cancel all websocket events
      emitter.off(GET_PENDING_LEASE);
      emitter.off(GET_LANDLORD_REPORT);
      emitter.off(GET_CHAT_MESSAGE);

      // tenant
      if (currentIdentity === TENANT) {
      }
      // landlord
      else if (currentIdentity === LANDLORD) {
        // get the lease request that needs to be processed by the landlord
        emitter.on(GET_PENDING_LEASE, () => {
          getLeasePendingListByLandlord();
        });
        // get the repair request that needs to be processed by the landlord
        emitter.on(GET_LANDLORD_REPORT, () => {
          getRepairListLandlord(currentUserId);
        });
      }
      // someone send message, need to get session list, latest message, other info
      emitter.on(GET_CHAT_MESSAGE, async () => {
        // get session list
        await getChatSessionList();
        // get the latest one message in the chat session list
        await getChatSessionLastOneMessageList();

        /**
         * The logic of "setchatMessageList" inside is specifically for chat pages
         */
        // start region
        const {
          currentChatSession: c,
          chatMessageList,
          setChatMessageList,
          chatSessionLastOneMessageList,
        } = chatStore;
        const lastOneMessage = chatSessionLastOneMessageList?.find(
          (i) =>
            (i?.senderId === c?.senderId && i?.receiverId === c?.receiverId) ||
            (i?.senderId === c?.receiverId && i?.receiverId === c?.senderId)
        );
        if (
          lastOneMessage?.id &&
          !chatMessageList?.find((chat) => chat.id === lastOneMessage.id)
        ) {
          setChatMessageList([lastOneMessage, ...(chatMessageList ?? [])]);
        }
        // start region
      });
    },
    []
  );

  useEffect(() => {
    // listen to app state changes
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );
    const disposer = autorun(() => {
      const { identity } = authStore;
      const userId = userStore.user?.id;
      const { socketInstance } = socketStore;

      if (identity && userId && !socketInstance) {
        // debounce: delay connection, aggregate multiple changes in a short time
        if (autorunDebounceTimer.current) {
          clearTimeout(autorunDebounceTimer.current);
        }
        autorunDebounceTimer.current = setTimeout(() => {
          subscribeWebSocketEvent(identity, userId);
          connect();
        }, 100);
      }
    });
    return () => {
      subscription?.remove();
      disconnect();
      if (autorunDebounceTimer.current) {
        clearTimeout(autorunDebounceTimer.current);
        autorunDebounceTimer.current = undefined;
      }
      disposer();
    };
  }, [connect, subscribeWebSocketEvent, disconnect, handleAppStateChange]);

  return {
    disconnect,
  };
}
