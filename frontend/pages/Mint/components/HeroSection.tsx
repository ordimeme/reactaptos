import { FC, FormEvent, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
// Internal utils
import { truncateAddress } from "@/utils/truncateAddress";
// Internal components
import { Image } from "@/components/ui/image";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Socials } from "@/pages/Mint/components/Socials";
// Internal hooks
import { useGetAssetData } from "../../../hooks/useGetAssetData";
// Internal utils
import { aptosClient } from "@/utils/aptosClient";
// Internal constants
import { NETWORK } from "@/constants";
// Internal assets
import ExternalLink from "@/assets/icons/external-link.svg";
import Copy from "@/assets/icons/copy.svg";
// Internal config
import { config } from "@/config";
// Internal entry functions
import { mintAsset } from "@/entry-functions/mint_asset";

export function HeroSection() {
  const { data } = useGetAssetData();
  const queryClient = useQueryClient();
  const { account, signAndSubmitTransaction } = useWallet();
  const [assetCount, setAssetCount] = useState<string>("10000");
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  const { asset, userMintBalance = 0, yourBalance = 0, maxSupply = 0, currentSupply = 0 } = data ?? {};

  const getSafeImageUrl = (symbol: string) => {
    if (imageError) {
      return '/tokens/default.svg';
    }
    try {
      return `/tokens/${symbol.toLowerCase()}.svg`;
    } catch {
      return '/tokens/default.svg';
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const mintFA = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!account) {
      return setError("Please connect your wallet");
    }

    if (!asset) {
      return setError("Asset not found");
    }

    if (!data?.isMintActive) {
      return setError("Minting is not available");
    }

    const amount = parseFloat(assetCount);
    if (Number.isNaN(amount) || amount <= 0) {
      return setError("Invalid amount");
    }

    const response = await signAndSubmitTransaction(
      mintAsset({
        assetType: asset.asset_type,
        amount,
        decimals: asset.decimals,
      }),
    );
    await aptosClient().waitForTransaction({ transactionHash: response.hash });
    queryClient.invalidateQueries();
    setAssetCount("1");
  };

  return (
    <section className="hero-container flex flex-col md:flex-row gap-6 px-4 max-w-screen-xl mx-auto w-full">
      <div className="w-full md:w-1/3 aspect-square md:aspect-auto bg-muted/20 rounded-lg overflow-hidden">
        <div className="relative w-full h-full min-h-[300px] flex items-center justify-center">
          <div className="absolute inset-0 bg-muted/20" />
          <img
            src={asset?.symbol ? getSafeImageUrl(asset.symbol) : '/tokens/default.svg'}
            alt={asset?.name ?? config.defaultAsset?.name}
            className="relative z-10 w-full h-full object-contain p-4 transition-opacity duration-300"
            onError={handleImageError}
            loading="lazy"
            style={{ opacity: 0 }}
            onLoad={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.opacity = '1';
            }}
          />
        </div>
      </div>
      <div className="basis-4/5 flex flex-col gap-4">
        <h1 className="title-md">{asset?.name ?? config.defaultAsset?.name}</h1>
        <Socials />

        <Card className="relative overflow-hidden">
          <CardContent
            className="flex flex-col md:flex-row gap-4 md:justify-between items-start md:items-center p-6"
          >
            <form onSubmit={mintFA} className="flex flex-col md:flex-row gap-4 w-full md:basis-1/4">
              <Input
                type="text"
                name="amount"
                value={assetCount}
                onChange={(e) => {
                  setAssetCount(e.target.value);
                }}
              />
              <Button className="h-16 md:h-auto" type="submit">
                Mint
              </Button>
            </form>

            <div className="flex flex-col basis-1/3">
              <p className="label-sm">You can mint up to</p>
              <p className="body-md">
                {Math.min(userMintBalance, maxSupply - currentSupply)} {asset?.symbol}
              </p>
            </div>

            <div className="flex flex-col basis-1/3">
              <p className="label-sm">Your Balance</p>
              <p className="body-md">
                {yourBalance} {asset?.symbol}
              </p>
            </div>
          </CardContent>
        </Card>

        {error && <p className="body-sm text-destructive">{error}</p>}

        <div className="flex gap-x-2 items-center flex-wrap justify-between">
          <p className="whitespace-nowrap body-sm-semibold">Address</p>

          <div className="flex gap-x-2">
            <AddressButton address={asset?.asset_type ?? ""} />
            <a
              className={buttonVariants({ variant: "link" })}
              target="_blank"
              href={`https://explorer.aptoslabs.com/account/${asset?.asset_type}?network=${NETWORK}`}
            >
              View on Explorer <Image src={ExternalLink} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

const AddressButton: FC<{ address: string }> = ({ address }) => {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    if (copied) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }

  return (
    <Button onClick={onCopy} className="whitespace-nowrap flex gap-1 px-0 py-0" variant="link">
      {copied ? (
        "Copied!"
      ) : (
        <>
          {truncateAddress(address)}
          <Image src={Copy} className="dark:invert" />
        </>
      )}
    </Button>
  );
};
