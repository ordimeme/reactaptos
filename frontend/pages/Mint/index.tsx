import { HeroSection } from "./components/HeroSection";
import { StatsSection } from "./components/StatsSection";
import { OurStorySection } from "./components/OurStorySection";
import { useGetAssetData } from "../../hooks/useGetAssetData";
import { ConnectWalletAlert } from "./components/ConnectWalletAlert";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function Mint() {
  const { data, isLoading } = useGetAssetData();

  const queryClient = useQueryClient();
  const { account } = useWallet();
  useEffect(() => {
    queryClient.invalidateQueries();
  }, [account, queryClient]);

  if (isLoading) {
    return (
      <div className="text-center p-8">
        <h1 className="title-md"> {data}Loading...</h1>
      </div>
    );
  }

  return (

      <div style={{ overflow: "hidden" }} className="overflow-hidden">
        <main className="flex flex-col gap-10 md:gap-16 mt-6">
          <ConnectWalletAlert />
          <HeroSection />
          <StatsSection />
          <OurStorySection />
        </main>
      </div>
  );
}
