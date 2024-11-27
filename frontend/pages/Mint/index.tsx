import { HeroSection } from "./components/HeroSection";
import { StatsSection } from "./components/StatsSection";
import { OurStorySection } from "./components/OurStorySection";
import { useGetAssetData } from "../../hooks/useGetAssetData";
import { ConnectWalletAlert } from "./components/ConnectWalletAlert";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function Mint() {
  const { isLoading } = useGetAssetData();
  const queryClient = useQueryClient();
  const { account } = useWallet();

  useEffect(() => {
    queryClient.invalidateQueries();
  }, [account, queryClient]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    if (!target.src.includes('default.svg')) {
      target.src = '/tokens/default.svg';
      target.style.opacity = '1';
    }
    target.onerror = null;
  };

  const getSafeImageUrl = (symbol: string) => {
    if (!symbol) return '/tokens/default.svg';
    
    try {
      const safeName = symbol.toLowerCase().replace(/[^a-z0-9]/g, '');
      return `/tokens/${safeName}.svg`;
    } catch (error) {
      console.error('Error getting image URL:', error);
      return '/tokens/default.svg';
    }
  };

  if (isLoading) {
    return (
      <div className="text-center p-8">
        <h1 className="title-md">Loading...</h1>
      </div>
    );
  }

  return (
    <div style={{ overflow: "hidden" }} className="overflow-hidden">
      <main className="flex flex-col gap-10 md:gap-16 mt-6">
        <ConnectWalletAlert />
        <HeroSection 
          handleImageError={handleImageError}
          getSafeImageUrl={getSafeImageUrl}
        />
        <StatsSection />
        <OurStorySection />
      </main>
    </div>
  );
}
