import { useEffect, useRef } from 'react';

export type UseClickOutsideArgs = {
  cb: () => void;
};
export const useClickOutside = ({ cb }: UseClickOutsideArgs) => {
  const ref = useRef<any>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        cb();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return {
    ref,
  };
};
