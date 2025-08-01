import { SERVER_SOCKET_ROOT } from '@/constants';
import { LANDLORD, TENANT } from '@/constants/auth';
import {
  RECONNECT_INTERVAL,
  SOCKET_GET_CHAT_MESSAGE,
  SOCKET_GET_LANDLORD_REPORT,
  SOCKET_GET_PENDING_LEASE,
  SOCKET_GET_TENANT_LEASE_HOUSE,
  SOCKET_GET_TENANT_REPORT,
} from '@/constants/socket';
import emitter from '@/emitter';
import {
  GET_CURRENT_LAST_ONE_MESSAGE,
  GET_LANDLORD_REPORT,
  GET_PENDING_LEASE,
  GET_SESSION_VARIOUS,
  GET_TENANT_LEASE_HOUSE,
  GET_TENANT_REPORT,
} from '@/emitter/event-name';
import authStore from '@/stores/auth';
import socketStore from '@/stores/socket';
import userStore from '@/stores/user';
import { autorun } from 'mobx';
import { useEffect, useRef } from 'react';
import useLandlord from './useLandlord';
import useRepair from './useRepair';
// import useChat from './useChat';

export default function useSocket() {
  const reconnectTimer = useRef<number | undefined>(undefined);
  const { socketInstance, setWebsocketInstance, clearWebsocketInstance } =
    socketStore;
  const { user } = userStore;
  const { identity } = authStore;
  const { getLeaseRequestNeedProcessedByLandlord } = useLandlord();
  const { getLandlordRepairList } = useRepair();
  // const { getChatSessionList } = useChat();

  /**
   * connect to websocket
   * @param identity - user identity
   * @param userId - user id
   */
  const connect = (identity?: string, userId?: number) => {
    if (!identity || !userId) return;
    const ws = new WebSocket(`${SERVER_SOCKET_ROOT}?${identity}=${userId}`);
    setWebsocketInstance(ws);

    ws.onopen = () => {
      console.log('WebSocket connected');
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
        reconnectTimer.current = undefined;
      }
    };

    ws.onmessage = ({ data }) => {
      console.log('onmessage', data);
      try {
        const { active } = JSON.parse(data);
        switch (active) {
          // get tenant lease house
          case SOCKET_GET_TENANT_LEASE_HOUSE:
            emitter.emit(GET_TENANT_LEASE_HOUSE);
            break;
          // get tenant report
          case SOCKET_GET_TENANT_REPORT:
            emitter.emit(GET_TENANT_REPORT);
            break;
          // get landlord pending lease
          case SOCKET_GET_PENDING_LEASE:
            emitter.emit(GET_PENDING_LEASE);
            break;
          // get landlord report (tenant report application)
          case SOCKET_GET_LANDLORD_REPORT:
            emitter.emit(GET_LANDLORD_REPORT);
            break;
          // get chat message
          case SOCKET_GET_CHAT_MESSAGE:
            emitter.emit(GET_CURRENT_LAST_ONE_MESSAGE);
            emitter.emit(GET_SESSION_VARIOUS);
            break;
        }
      } catch (error) {
        console.log('onmessage error', error);
      }
    };

    ws.onclose = () => {
      clearWebsocketInstance();
      if (!reconnectTimer.current) {
        reconnectTimer.current = setTimeout(connect, RECONNECT_INTERVAL);
      }
    };

    ws.onerror = (e) => {
      console.log('WebSocket error:', e);
      ws.close(); // trigger onclose event
    };
  };

  /**
   * subscribe websocket event
   */
  const subscribeWebSocketEvent = () => {
    // cancel all websocket events
    emitter.off(GET_PENDING_LEASE);
    emitter.off(GET_LANDLORD_REPORT);
    emitter.off(GET_SESSION_VARIOUS);
    // tenant
    if (identity === TENANT) {
    }
    // landlord
    else if (identity === LANDLORD) {
      // get the lease request that needs to be processed by the landlord
      emitter.on(GET_PENDING_LEASE, () => {
        getLeaseRequestNeedProcessedByLandlord();
      });
      // get the repair request that needs to be processed by the landlord
      emitter.on(GET_LANDLORD_REPORT, () => {
        user?.id && getLandlordRepairList(user.id);
      });
    }
    // someone send message, need to get session list, latest message, other info
    emitter.on(GET_SESSION_VARIOUS, () => {
      // get session list
      // getChatSessionList();
    });
  };

  useEffect(() => {
    const disposer = autorun(() => {
      const id = userStore.user?.id;
      const identity = authStore.identity;
      connect(identity, id);
      subscribeWebSocketEvent();
    });
    return () => disposer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
