import { useEffect, useRef, useCallback } from 'react';

type TCallback = (time?: number) => void;

/**
 * A hook that calls a callback every x milliseconds.
 * 
 * Used in notifications.
 */
const useInterval = (callback: TCallback, timeout: number) => {
  const savedCallback = useRef(callback);

  const handler = useCallback(() => {
    savedCallback.current(new Date().getTime());
  }, []);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    if (timeout) {
      const id = window.setInterval(handler, timeout);
      return () => window.clearInterval(id);
    };
  }, [handler, timeout]);
};

export default useInterval;
