import { getPingTimeOut } from 'config';
import { useEffect, useRef, useState } from 'react';
import { ping } from 'services/api';
import { TimeoutId } from 'types';

export const usePing = () => {
  const [started, setStarted] = useState(false);
  const timerRef = useRef<TimeoutId | null>(null);

  const start = () => {
    if (timerRef.current) return;
    ping();
    setStarted(true);
    window.removeEventListener('mousemove', start);
    window.removeEventListener('keydown', start);

    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      window.addEventListener('mousemove', start);
      window.addEventListener('keydown', start);
    }, getPingTimeOut());
  };
  useEffect(() => {
    if (!started) {
      window.addEventListener('mousemove', start);
      window.addEventListener('keydown', start);
    }
  }, []);
};
