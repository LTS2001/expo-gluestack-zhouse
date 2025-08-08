import { ISocketMessage } from '@/global';
import { socketStore } from '@/stores';

/**
 * send message (with queue mechanism)
 */
export const sendMessage = (message: ISocketMessage) => {
  const { addToMessageQueue, socketInstance: ws } = socketStore;
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
    return true;
  } else {
    // if connection not established, add message to queue
    addToMessageQueue(message);
    console.log('websocket: message queued, waiting for connection');
    return false;
  }
};
