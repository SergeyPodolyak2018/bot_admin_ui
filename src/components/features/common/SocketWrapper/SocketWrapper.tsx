import { createContext, FC, PropsWithChildren } from 'react';
import { useCallList } from 'services/api';

export const SocketContext = createContext({});
export const SocketWrapper: FC<PropsWithChildren> = ({ children }) => {
  const calls = useCallList();

  return <SocketContext.Provider value={calls}>{children}</SocketContext.Provider>;
};
