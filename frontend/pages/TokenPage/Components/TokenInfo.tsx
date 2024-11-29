import { Pool, MarketItem } from "@/types/market";
import { formatDisplayPrice, format } from "@/utils/format";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, ChevronUp, Copy } from "lucide-react";
import { useState, useMemo } from "react";
import { truncateAddress, getFullAddress } from "@/utils/truncateAddress";
import { Pagination } from "@/components/Pagination";
import { useToast } from "@/components/ui/use-toast";
import { Tag } from "@/components/ui/tag";
import { usePriceContext } from "@/context/PriceContext";

interface TokenInfoProps {
  token: MarketItem & { 
    imageUrl: string;
    poolState?: Pool;
  };
}

interface Holder {
  address: string;
  balance: number;
  percentage: number;
  isBondingCurve?: boolean;
}

const HOLDERS_PER_PAGE = 10;
const TOTAL_HOLDERS = 100;

export function TokenInfo({ token }: TokenInfoProps) {
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { liquidity } = usePriceContext();

  // 生成并排序 holders 数据
  const holders: Holder[] = useMemo(() => {
    const totalSupply = token.poolState?.totalSupply || 10000000;
    
    const percentages = [
      15.00, // Bonding Curve
      12.50,
      10.00,
      8.50,
      7.00,
      6.00,
      5.00,
      4.50,
      4.00,
      3.50,
      3.00,
      2.50,
      2.00,
      1.75,
      1.50,
      ...Array(85).fill(0).map(() => (10.25 / 85))
    ].slice(0, TOTAL_HOLDERS);

    return percentages.map((percentage, index): Holder => ({
      address: `0x${(index + 1).toString().padStart(40, '0')}`,
      balance: Math.floor(totalSupply * (percentage / 100)),
      percentage: percentage,
      isBondingCurve: index === 0
    }));
  }, [token.poolState?.totalSupply]);

  const totalPages = Math.ceil(Math.min(holders.length, TOTAL_HOLDERS) / HOLDERS_PER_PAGE);
  
  const getCurrentPageHolders = () => {
    const startIndex = (currentPage - 1) * HOLDERS_PER_PAGE;
    const endIndex = Math.min(startIndex + HOLDERS_PER_PAGE, TOTAL_HOLDERS);
    return holders.slice(startIndex, endIndex);
  };

  // 添加复制地址函数
  const handleCopyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(getFullAddress(address));
      toast({
        title: "Success",
        description: "Address has been copied to clipboard",
      });
    } catch (err) {
      console.error('Failed to copy:', err);
      toast({
        title: "Failed",
        description: "Failed to copy address",
        variant: "destructive",
      });
    }
  };

  // 获取最新流动性
  const aptLiquidity = liquidity[token.id] || token.liquidity;

  return (
    <div className="rounded-lg border border-muted/40 dark:border-muted/20 bg-card">
      <div className="p-6 space-y-6">
        <h2 className="text-lg font-semibold">{token.name} Info</h2>

                {/* About */}
                <div>
          <h3 className="text-sm font-semibold mb-2">About {token.symbol}</h3>
          <div className="relative">
            <p className={`text-sm text-muted-foreground ${!isExpanded ? "line-clamp-4" : ""}`}>
              {token.description}
            </p>
            {token.description && token.description.length > 240 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs px-2 py-1 h-6 absolute -bottom-6 left-0"
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 mr-1" />
                ) : (
                  <ChevronDown className="h-4 w-4 mr-1" />
                )}
                {isExpanded ? "Show Less" : "Show More"}
              </Button>
            )}
          </div>
                  {/* Social Links */}
        {(token.twitter || token.discord || token.telegram) && (
          <div className="pt-4 border-t border-muted/20">
            <div className="flex gap-4">
              {token.twitter && (
                <a 
                  href={token.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline"
                >
                  Twitter
                </a>
              )}
              {token.discord && (
                <a 
                  href={token.discord} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline"
                >
                  Discord
                </a>
              )}
              {token.telegram && (
                <a 
                  href={token.telegram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline"
                >
                  Telegram
                </a>
              )}
            </div>
          </div>
        )}
        </div>
        
        {/* Token Metrics */}
        <div className="grid grid-cols-2 gap-3">
          {/* Market Cap Card */}
          <div className="rounded-lg border border-muted/40 dark:border-muted/20 p-3">
            <div className="text-center mb-1">
              <span className="text-xs text-muted-foreground">Market Cap</span>
            </div>
            <div className="font-semibold text-center group/price">
              <span className="text-base sm:text-lg block group-hover/price:hidden">
                {format.marketCap(token.marketCap)}
              </span>
              <span className="text-base sm:text-lg hidden group-hover/price:block">
                {format.aptMarketCap(token.marketCap)} APT
              </span>
            </div>
          </div>

          {/* Liquidity Card */}
          <div className="rounded-lg border border-muted/40 dark:border-muted/20 p-3">
            <div className="text-center mb-1">
              <span className="text-xs text-muted-foreground">Liquidity</span>
            </div>
            <div className="font-semibold text-center">
              <span className="text-base sm:text-lg">
                {format.liquidity(aptLiquidity)}
              </span>
            </div>
          </div>
        </div>

        {/* Pool Info */}
        {token.poolState && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Current Supply</p>
              <p className="font-medium">{formatDisplayPrice(token.poolState.currentSupply)} {token.symbol}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Supply</p>
              <p className="font-medium">{formatDisplayPrice(token.poolState.totalSupply)} {token.symbol}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">APT Reserve</p>
              <p className="font-medium">{formatDisplayPrice(token.poolState.aptReserve)} APT</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Token Reserve</p>
              <p className="font-medium">{formatDisplayPrice(token.poolState.tokenReserve)} {token.symbol}</p>
            </div>
          </div>
        )}

        {/* Progress Bars */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Bonding Curve Progress: {format.percentage(token.bondingProgress)}
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-5 w-5 hover:bg-muted"
              >
                <span className="text-xs">ⓘ</span>
              </Button>
            </div>
            <Progress 
              value={token.bondingProgress} 
              className="h-2 bg-muted/20" 
            />
            <p className="text-sm text-muted-foreground mt-1">
              Graduate {token.symbol} To Raydium At {format.marketCap(token.marketCap)} Market Cap
            </p>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                King Of The Hill Progress: {format.percentage(token.kingProgress ?? 0)}
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-5 w-5 hover:bg-muted"
              >
                <span className="text-xs">ⓘ</span>
              </Button>
            </div>
            <Progress 
              value={token.kingProgress ?? 0} 
              className="h-2 bg-muted/20"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Dethrone The Current King At {format.marketCap(token.dethroneCap ?? 0)} Market Cap
            </p>
          </div>
        </div>

        {/* Holder Distribution */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">
              Holder Distribution
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              Generate Bubble Map
            </Button>
          </div>

          <div className="rounded-lg border border-muted/40 dark:border-muted/20 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-[2fr,1.5fr,1fr] gap-4 py-2 px-4 text-sm bg-muted/5 border-b border-muted/20">
              <div className="text-muted-foreground">Address</div>
              <div className="text-right text-muted-foreground">Balance</div>
              <div className="text-right text-muted-foreground">Share</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-muted/20">
              {getCurrentPageHolders().map((holder, index) => (
                <div 
                  key={index}
                  className="grid grid-cols-[2fr,1.5fr,1fr] gap-4 py-3 px-4 text-sm hover:bg-muted/5 transition-colors"
                >
                  {/* Holder Address */}
                  <div className="flex items-center gap-2">
                    <span className="font-mono truncate">
                      {truncateAddress(holder.address, 6, 4, true)}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 md:h-5 md:w-5 hover:bg-muted"
                      onClick={() => handleCopyAddress(holder.address)}
                    >
                      <Copy className="h-2.5 w-2.5 md:h-3 md:w-3" />
                    </Button>
                    {holder.isBondingCurve && (
                      <Tag variant="bonding">BC</Tag>
                    )}
                  </div>

                  {/* Balance */}
                  <div className="text-right font-mono">
                    {holder.balance.toLocaleString()} {token.symbol}
                  </div>

                  {/* Percentage */}
                  <div className="text-right font-mono">
                    {holder.percentage.toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="border-t border-muted/20 p-2 bg-muted/5">
                <div className="flex items-center justify-center px-2">
                  <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
