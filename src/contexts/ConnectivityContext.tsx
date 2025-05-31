import React, { createContext, useContext, ReactNode } from 'react';
import { useNetInfo } from '../hooks/useNetInfo';

interface ConnectivityContextData {
  isConnected: boolean;
}

const ConnectivityContext = createContext<ConnectivityContextData>({} as ConnectivityContextData);

export const ConnectivityProvider = ({ children }: { children: ReactNode }) => {
  const { isConnected } = useNetInfo();

  return (
    <ConnectivityContext.Provider value={{ isConnected }}>
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
