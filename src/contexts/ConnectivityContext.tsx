import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { useNetInfo } from '../hooks/useNetInfo';

interface ConnectivityContextData {
  isConnected: boolean;
}

const ConnectivityContext = createContext<ConnectivityContextData>({} as ConnectivityContextData);

export const ConnectivityProvider = ({ children }: { children: ReactNode }) => {
  const { isConnected } = useNetInfo();

  const contextValue = useMemo(() => ({ isConnected }), [isConnected]);

  return (
    <ConnectivityContext.Provider value={contextValue}>
      {children}
    </ConnectivityContext.Provider>
  );
};

export const useConnectivity = () => {
  const context = useContext(ConnectivityContext);

  if (!context) {
    throw new Error('useConnectivity must be used within a ConnectivityProvider');
  }

  return context;
};
