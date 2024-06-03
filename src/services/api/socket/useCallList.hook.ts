import { isMock } from 'config';
import { NavigationEnum } from 'navigation';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { addNotification, useAppDispatch } from 'store';
import { CallStats, CallStatuses, TimeoutId } from 'types';
import { useSocket } from 'utils/hooks/useSocket.ts';
import logger from 'utils/logger.ts';
import { mockCalls } from './mock.ts';
import { CALLS } from './socket.constants.ts';

const SERVER_URL = CALLS;

export const useCallList = () => {
  const dispatch = useAppDispatch();
  const [calls, setCalls] = useState<CallStats[]>(isMock() ? mockCalls : []);
  // const socketRef = useRef<WebSocket | null>(null);
  const location = useLocation();
  const timerRef = useRef<TimeoutId | null>(null);

  const { socketRef, retryConnect, connectSocket } = useSocket({
    url: SERVER_URL,
    initOnLoad: false,
    onClose: () => {
      if (isMock()) return;
      logger.info(`WebSocket connection closed to ${SERVER_URL}`);
      setCalls([]);
      timerRef.current = setTimeout(retryConnect, 5000);
    },
    onOpen: () => {
      logger.info(`open WebSocket connection to ${SERVER_URL}`);
    },
    onError: (msg) => {
      logger.error('WebSocket connection error');
      logger.debug(msg);
      dispatch(addNotification({ type: 'error', title: 'Get interactions error', message: msg }));
    },
    onConnect: () => {},
    onMessage: (event: any) => {
      if (isMock()) return;

      const data = JSON.parse(event.data) as CallStatuses;
      const result = Object.entries(data).reduce((acc: any[], [key, value]) => {
        if (key !== 'event' && key !== 'message') {
          acc.push({ ...value, id: key });
        }
        return acc;
      }, []);

      setCalls(result);
    },
  });

  useEffect(() => {
    if (!location.pathname.includes(NavigationEnum.INTERACTIONS)) {
      return;
    }
    connectSocket();
    return () => {
      socketRef.current?.close();
      timerRef.current && clearTimeout(timerRef.current);
    };
  }, [location.pathname]);

  // close
  useEffect(() => {
    if (!location.pathname.includes(NavigationEnum.INTERACTIONS)) {
      timerRef.current && clearTimeout(timerRef.current);
      socketRef.current?.close();
      return;
    }
  }, [location.pathname, timerRef.current, socketRef.current]);

  const sendMsg = (args: object) => {
    socketRef.current?.send(JSON.stringify(args));
  };
  const getById = (id: string) => {
    return calls.find((call) => call.id === id);
  };
  const cleanUp = () => {
    timerRef.current && clearTimeout(timerRef.current);
    socketRef.current?.close();
  };
  return {
    cleanUp,
    calls,
    getById,
    sendMsg,
  };
};
