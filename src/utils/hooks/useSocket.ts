import { isWsUseProxy } from 'config';
import { RefObject, useEffect, useMemo, useRef } from 'react';
import { SOCKET_MESSAGE_EVENT } from 'services/api/socket/socket.types.ts';

export type UseSocketArgs = {
  onOpen?: (wsSend: SendFn) => void;
  onError?: (msg: any) => void;
  onClose?: () => void;
  onConnect?: (wsSend: SendFn) => void;
  onMessage?: <T = DefaultMessage>(message: MessageEvent<T>) => void;
  url: string;
  cleanup?: () => void;
  initOnLoad?: boolean;
};

export type UseSocket = {
  socketRef: RefObject<WebSocket | null>;
  wsSend: SendFn;
  connectSocket: () => void;
  retryConnect: () => void;
  isConnected: boolean;
  close: () => void;
};

export type SendFn = (...args: any[]) => void;

export type DefaultMessage = MessageEvent<{
  event: SOCKET_MESSAGE_EVENT;
}>;

/**
 * Example
 *   const { socketRef, connectSocket, wsSend } = useSocket({
 *    url: SERVER_URL,
 *    onOpen: () => handleOpenWsConnection(),
 *    onConnect: (send) => {
 *        send({data});
 *      },
 *     onError: () => handleErrorWsConnection(),
 *     onClose: () => handleCloseWsConnection(),
 *     onMessage: (message) => handleWsMessage(message),
 *    });
 */
export const useSocket = ({
  onOpen,
  onError,
  onClose,
  onMessage,
  url,
  onConnect,
  initOnLoad = false,
  cleanup,
}: UseSocketArgs): UseSocket => {
  const socketRef = useRef<WebSocket | null>(null);

  const isConnected = useMemo(() => {
    return socketRef.current?.readyState === 1;
  }, [socketRef.current?.readyState]);

  useEffect(() => {
    initOnLoad && connectSocket();

    return () => {
      socketRef.current?.close();
      cleanup && cleanup();
    };
  }, [initOnLoad]);

  // useEffect(() => {
  //   if (!socketRef.current) return;
  //   addListeners();
  // }, [socketRef.current, socketRef.current?.readyState]);

  useEffect(() => {
    !isWsUseProxy() && isConnected && onConnect && onConnect(wsSend);
  }, [isConnected]);

  const connectSocket = () => {
    socketRef.current = new WebSocket(url);
    addListeners();
  };

  const addListeners = () => {
    if (!socketRef.current) return;
    socketRef.current.addEventListener('open', () => {
      !isWsUseProxy() && onOpen && onOpen(wsSend);
    });
    onError && socketRef.current.addEventListener('error', (err: any) => onError(err?.message));
    socketRef.current.addEventListener('close', () => {
      socketRef.current = null;
      onClose && onClose();
    });
    socketRef.current.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.event === 'connected' && onOpen && isWsUseProxy()) onOpen(wsSend);
      if (data.event === 'error') {
        onError && onError(data);
      }

      onMessage && onMessage(message);
    };
  };

  const wsSend = (args: any[]) => {
    socketRef.current?.send(JSON.stringify(args));
  };

  const retryConnect = () => {
    connectSocket();
  };

  const close = () => {
    socketRef.current?.close();
  };

  return { socketRef, wsSend, connectSocket, retryConnect, isConnected, close };
};
