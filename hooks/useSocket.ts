import {
  getChatMessage,
  getLeasePendingListByLandlord,
  getRepairListLandlord,
  sendMessage,
} from '@/business';
import { showToast } from '@/components/ui';
import {
  EConnectionStateEnum,
  ESocketHeartbeatEnum,
  ESocketMessageActionEnum,
  ESocketReconnectionEnum,
  SERVER_SOCKET_ROOT,
} from '@/constants';
import emitter, { EEventNameEnum } from '@/emitter';
import { ISocketMessage } from '@/global';
import {
  authStore,
  networkStore,
  socketStore,
  userStore,
  webrtcStore,
} from '@/stores';
import { router } from 'expo-router';
import { reaction } from 'mobx';
import { useCallback, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export default function useSocket() {
  const heartbeatIntervalTimer =
    useRef<ReturnType<typeof setInterval>>(undefined);
  const heartbeatTimeoutTimer =
    useRef<ReturnType<typeof setTimeout>>(undefined);
  const reconnectTimeoutTimer =
    useRef<ReturnType<typeof setTimeout>>(undefined);
  // store connect/reconnect function reference to avoid dependency issues
  const connectRef = useRef<() => void>(() => {});
  const reconnectRef = useRef<() => void>(() => {});
  // mark whether the websocket is closed manually
  const isManualDisconnect = useRef(false);

  /**
   * calculate exponential backoff reconnect delay
   */
  const getReconnectDelay = useCallback(() => {
    const delay = Math.min(
      ESocketReconnectionEnum.BaseReconnectionDelay *
        Math.pow(2, socketStore.reconnectAttempts),
      ESocketReconnectionEnum.MaxReconnectionDelay
    );
    // add random jitter to avoid multiple clients reconnecting at the same time
    return delay + Math.random() * 1000;
  }, []);

  /**
   * start heartbeat detection
   */
  const startHeartbeat = useCallback(() => {
    const { socketInstance: ws } = socketStore;
    // clear previous heartbeat interval timer
    if (heartbeatIntervalTimer.current) {
      clearInterval(heartbeatIntervalTimer.current);
    }
    heartbeatIntervalTimer.current = setInterval(() => {
      // send heartbeat
      if (ws?.readyState === WebSocket.OPEN) {
        const { identity } = authStore;
        const { id } = userStore.user || {};
        if (identity && id) {
          sendMessage({
            toIdentity: identity,
            toId: id,
            active: ESocketMessageActionEnum.Heartbeat,
          });
          if (heartbeatTimeoutTimer.current) {
            clearTimeout(heartbeatTimeoutTimer.current);
            heartbeatTimeoutTimer.current = undefined;
          }
          // set heartbeat timeout detection
          heartbeatTimeoutTimer.current = setTimeout(() => {
            console.log('websocket: heartbeat timeout, reconnecting...');
            ws.close();
          }, ESocketHeartbeatEnum.Timeout);
        }
      }
    }, ESocketHeartbeatEnum.Interval);
  }, []);

  /**
   * stop heartbeat detection
   */
  const stopHeartbeat = useCallback(() => {
    if (heartbeatIntervalTimer.current) {
      clearInterval(heartbeatIntervalTimer.current);
      heartbeatIntervalTimer.current = undefined;
    }
    if (heartbeatTimeoutTimer.current) {
      clearTimeout(heartbeatTimeoutTimer.current);
      heartbeatTimeoutTimer.current = undefined;
    }
  }, []);

  /**
   * process message queue
   */
  const processMessageQueue = useCallback(() => {
    const { socketInstance: ws } = socketStore;
    if (ws?.readyState === WebSocket.OPEN) {
      const { clearMessageQueue, messageQueue: queue } = socketStore;
      if (queue.length > 0) {
        console.log(`websocket: processing ${queue.length} queued messages`);
        queue.forEach((msg) => {
          if (msg) {
            ws.send(JSON.stringify(msg));
          }
        });
        clearMessageQueue();
      }
    }
  }, []);

  /**
   * reset reconnect state
   */
  const resetReconnectState = useCallback(() => {
    socketStore.setReconnectAttempts(0);
    if (reconnectTimeoutTimer.current) {
      clearTimeout(reconnectTimeoutTimer.current);
      reconnectTimeoutTimer.current = undefined;
    }
  }, []);

  /**
   * reconnect logic
   */
  const reconnect = useCallback(() => {
    if (isManualDisconnect.current) return;
    const { setConnectionState, reconnectAttempts, setReconnectAttempts } =
      socketStore;
    const handleConnect = (
      delay: number = ESocketReconnectionEnum.MaxReconnectionDelay
    ) => {
      // clear previous reconnect timer
      if (reconnectTimeoutTimer.current) {
        clearTimeout(reconnectTimeoutTimer.current);
        reconnectTimeoutTimer.current = undefined;
      }
      reconnectTimeoutTimer.current = setTimeout(() => {
        connectRef.current();
        setReconnectAttempts(reconnectAttempts + 1);
      }, delay);
    };
    if (reconnectAttempts >= ESocketReconnectionEnum.MaxReconnectionAttempts) {
      console.log('websocket: max reconnection attempts reached');
      setConnectionState(EConnectionStateEnum.Disconnected);
      handleConnect();
      return;
    }

    const delay = getReconnectDelay();
    handleConnect(delay);
    console.log(
      `websocket: reconnecting in ${delay.toFixed()}ms (attempt ${reconnectAttempts}/${
        ESocketReconnectionEnum.MaxReconnectionAttempts
      })`
    );
  }, [getReconnectDelay]);

  /**
   * connect to websocket
   */
  const connect = useCallback(() => {
    const { identity, isLogin } = authStore;
    const { id } = userStore.user || {};
    const {
      connectionState,
      setConnectionState,
      setWebsocketInstance,
      setLastConnectedAt,
    } = socketStore;
    isManualDisconnect.current = false;
    if (
      !isLogin ||
      !identity ||
      !id ||
      [
        EConnectionStateEnum.Connecting,
        EConnectionStateEnum.Connected,
      ].includes(connectionState)
    )
      return;

    const ws = new WebSocket(`${SERVER_SOCKET_ROOT}?${identity}=${id}`);
    setWebsocketInstance(ws);
    setConnectionState(EConnectionStateEnum.Connecting);

    ws.onopen = () => {
      setConnectionState(EConnectionStateEnum.Connected);
      setLastConnectedAt(new Date());
      resetReconnectState();
      startHeartbeat();
      processMessageQueue();
    };

    ws.onmessage = ({ data: $data }) => {
      console.log(
        `websocket: message received ${$data} ${new Date().toLocaleTimeString()}`
      );
      try {
        const parsedData = JSON.parse($data) as ISocketMessage;
        // process business message
        const { active, fromIdentity, fromId, data: _data } = parsedData;
        const data = _data as any;
        switch (active) {
          case ESocketMessageActionEnum.Connect:
            console.log('websocket: connected successfully');
            break;
          case ESocketMessageActionEnum.Heartbeat:
            if (heartbeatTimeoutTimer.current) {
              clearTimeout(heartbeatTimeoutTimer.current);
              heartbeatTimeoutTimer.current = undefined;
            }
            break;
          case ESocketMessageActionEnum.GetTenantLeaseHouse:
            break;
          case ESocketMessageActionEnum.GetTenantRepair:
            break;
          case ESocketMessageActionEnum.GetPendingLease:
            if (authStore.identity === 'landlord') {
              // get the lease request that needs to be processed by the landlord
              getLeasePendingListByLandlord();
            }
            break;
          case ESocketMessageActionEnum.GetLandlordRepair:
            if (authStore.identity === 'landlord') {
              // get the repair request that needs to be processed by the landlord
              getRepairListLandlord(id);
            }
            break;
          case ESocketMessageActionEnum.GetChatMessage:
            // someone send message, need to get session list, latest message, other info
            getChatMessage();
            break;
          case ESocketMessageActionEnum.WebrtcOffer:
            webrtcStore.setWebrtcOfferIdentity(fromIdentity!);
            webrtcStore.setWebrtcOfferId(fromId!);
            webrtcStore.setWebrtcOffer(JSON.parse(data));
            webrtcStore.setRole('answer');
            router.push('/chat-webrtc');
            break;
          case ESocketMessageActionEnum.WebrtcOfferIce:
            emitter.emit(EEventNameEnum.WebrtcOfferIce, data);
            break;
          case ESocketMessageActionEnum.WebrtcAnswer:
            emitter.emit(EEventNameEnum.WebrtcAnswer, data);
            break;
          case ESocketMessageActionEnum.WebrtcAnswerIce:
            emitter.emit(EEventNameEnum.WebrtcAnswerIce, data);
            break;
          case ESocketMessageActionEnum.WebrtcHangup:
            const { isConnected, role } = webrtcStore;
            showToast({
              title: isConnected
                ? '对方已挂断'
                : role === 'offer'
                ? '对方已拒绝'
                : '对方已取消',
            });
            webrtcStore.setConnectionState('closed');
            break;
        }
      } catch (error) {
        console.log('websocket: error parsing message ', error);
      }
    };

    const handleReconnect = () => {
      const { setConnectionState, clearWebsocketInstance } = socketStore;
      setConnectionState(EConnectionStateEnum.Disconnected);
      clearWebsocketInstance();
      stopHeartbeat();
      reconnectRef.current();
    };

    ws.onclose = (event) => {
      console.log(`websocket: closed ${event.code}`);
      handleReconnect();
    };

    ws.onerror = (error: any) => {
      console.log(`websocket: error ${error.message}`);
      handleReconnect();
    };
  }, [processMessageQueue, startHeartbeat, stopHeartbeat, resetReconnectState]);

  /**
   * manually disconnect
   */
  const disconnect = useCallback(() => {
    const { setConnectionState, clearWebsocketInstance, socketInstance } =
      socketStore;
    isManualDisconnect.current = true;
    socketInstance?.close();
    clearWebsocketInstance();
    setConnectionState(EConnectionStateEnum.Disconnected);
    stopHeartbeat();
    resetReconnectState();
  }, [resetReconnectState, stopHeartbeat]);

  /**
   * listen to app state changes
   */
  const handleAppStateChange = useCallback(
    (nextAppState: AppStateStatus) => {
      console.log(`websocket: app state changed to ${nextAppState}`);
      const { setConnectionState, socketInstance: ws } = socketStore;
      const isConnectionAlive = ws?.readyState === WebSocket.OPEN;
      if (nextAppState !== 'active') {
        isManualDisconnect.current = true;
        ws?.close();
        return;
      }
      if (isConnectionAlive) {
        // the connection is still alive, update the status and resume heartbeat
        console.log('websocket: connection still alive, resuming heartbeat...');
        setConnectionState(EConnectionStateEnum.Connected);
        startHeartbeat();
      } else {
        // the connection is lost, try to reconnect
        console.log(
          'websocket: app state change, connection lost, try to reconnect...'
        );
        resetReconnectState();

        // delay connection to avoid calling connect function before it's defined
        setTimeout(() => {
          connectRef.current();
        }, 1000);
      }
    },
    [resetReconnectState, startHeartbeat]
  );

  useEffect(() => {
    // listen to app state changes
    const changeSubscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );

    // user login is required to init the websocket, watch the isLogin field change
    const disposer = reaction(
      () => {
        const { user } = userStore;
        const { isConnected } = networkStore;
        return { user, networkIsConnected: isConnected };
      },
      () => {
        connect();
      },
      {
        fireImmediately: true,
      }
    );
    return () => {
      disposer();
      changeSubscription?.remove();
      disconnect();
    };
  }, [connect, disconnect, handleAppStateChange]);

  // store connect/reconnect function reference to avoid dependency issues
  useEffect(() => {
    connectRef.current = connect;
    reconnectRef.current = reconnect;
  }, [connect, reconnect]);

  return {
    disconnect,
    resetReconnectState,
  };
}
