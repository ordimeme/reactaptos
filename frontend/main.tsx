import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";

import App from "@/App.tsx";
// Internal components
import { Toaster } from "@/components/ui/toaster.tsx";
import { TooltipProvider } from "@/components/ui/tooltip.tsx";
import { WalletProvider } from "@/components/WalletProvider.tsx";
import { WrongNetworkAlert } from "@/components/WrongNetworkAlert";
import { ThemeContextProvider } from './context/ThemeContext';
import { TokenDataContextProvider } from "@/providers/tokenData";
import { PoolDataContextProvider } from "@/providers/poolData";
import { AccountDataContextProvider } from "@/providers/accountData";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeContextProvider>
      <WalletProvider>
        <QueryClientProvider client={queryClient}>
          <TokenDataContextProvider>
            <PoolDataContextProvider>
              <AccountDataContextProvider>
                <TooltipProvider delayDuration={100}>
                  <App />
                  <WrongNetworkAlert />
                  <Toaster />
                </TooltipProvider>
              </AccountDataContextProvider>
            </PoolDataContextProvider>
         </TokenDataContextProvider>
        </QueryClientProvider>
      </WalletProvider>
    </ThemeContextProvider>
  </React.StrictMode>
);