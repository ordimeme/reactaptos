import { useWallet, WalletName } from "@aptos-labs/wallet-adapter-react";
import { useToast } from "@/components/ui/use-toast";

export function useWalletConnect() {
  const { connect, connected, account, disconnect, wallets } = useWallet();
  const { toast } = useToast();

  const connectWallet = async (walletName?: WalletName) => {
    if (connected) return true;
    
    try {
      await connect(walletName || "petra" as WalletName);
      return true;
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Please install a supported wallet",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    connectWallet,
    connected,
    account,
    disconnect,
    wallets
  };
} 