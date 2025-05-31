import { FC } from "react";
import { ConnectivityProvider } from "./ConnectivityContext";
import { FavoriteProvider } from "./FavoriteContext";

const ProviderContexts: FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <ConnectivityProvider>
        <FavoriteProvider>

      {children}
        </FavoriteProvider>
    </ConnectivityProvider>
  );
}

export default ProviderContexts;