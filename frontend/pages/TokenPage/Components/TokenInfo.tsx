import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MarketItem } from "@/types/market";
import { ChevronDown, ChevronUp, Copy } from "lucide-react";
import { useState, useMemo } from "react";
import { FaDiscord, FaTelegram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { truncateAddress, getFullAddress } from "@/utils/truncateAddress";
import { Pagination } from "@/components/Pagination";
import { useToast } from "@/components/ui/use-toast";
import { Tag } from "@/components/ui/tag";
import { format } from "@/utils/format";
import { usePriceContext } from "@/context/PriceContext";

interface TokenInfoProps {
  token: MarketItem & { imageUrl: string };
}

interface Holder {
  address: string;
  balance: number;
  percentage: number;
  isBondingCurve?: boolean;
}

const HOLDERS_PER_PAGE = 20;

export function TokenInfo({ token }: TokenInfoProps) {
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { liquidity } = usePriceContext();

  // 生成并排序 holders 数据
  const holders: Holder[] = useMemo(() => {
    // 总供应量
    const totalSupply = 10000000;
    
    // 为确保总和为100%，预先计算每个持有者的百分比
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
      1.25,
      1.00,
      ...Array(33).fill(0).map(() => (10.00 / 33)) // 剩余10%平均分配给其他持有者
    ];

    const data = percentages.map((percentage, index): Holder => ({
      address: `0x${(index + 1).toString().padStart(40, '0')}`,
      balance: Math.floor(totalSupply * (percentage / 100)),
      percentage: percentage,
      isBondingCurve: index === 0
    }));

    return data;
  }, []);

  const totalPages = Math.ceil(holders.length / HOLDERS_PER_PAGE);
  
  const getCurrentPageHolders = () => {
    const startIndex = (currentPage - 1) * HOLDERS_PER_PAGE;
    const endIndex = startIndex + HOLDERS_PER_PAGE;
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

  // Holder Distribution 表格渲染函数
  const renderHolderDistribution = () => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Holder Distribution</span>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          Generate Bubble Map
        </Button>
      </div>

      <div className="rounded-lg border border-muted/40 dark:border-muted/20 overflow-hidden">

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
                {holder.balance.toLocaleString()}
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
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 px-4">
      {/* Token Metrics */}
      <div className="grid grid-cols-2 gap-3">
        {/* Market Cap Card */}
        <div className="rounded-lg border border-muted/40 dark:border-muted/20 p-3">
          <div className="text-center mb-1">
            <span className="text-xs text-muted-foreground">Market Cap</span>
          </div>
          <div className="font-semibold text-center group/price">
            <span className="text-base sm:text-lg block group-hover/price:hidden">
              ${format.marketCap(token.marketCap)}
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

      {/* About */}
      <div>
        <h3 className="text-sm font-semibold mb-2">About</h3>
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
      </div>

      {/* Social Media */}
      {(token.twitter || token.discord || token.telegram) && (
        <div>
          <h3 className="text-sm font-semibold mb-2">Social Media</h3>
          <div className="flex gap-4">
            {token.twitter && (
              <a 
                href={token.twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <FaXTwitter className="h-5 w-5" />
              </a>
            )}
            {token.discord && (
              <a 
                href={token.discord} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <FaDiscord className="h-5 w-5" />
              </a>
            )}
            {token.telegram && (
              <a 
                href={token.telegram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <FaTelegram className="h-5 w-5" />
              </a>
            )}
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
            Graduate This Coin To Raydium At {format.marketCap(token.marketCap)} Market Cap
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
      {renderHolderDistribution()}

    </div>
  );
} 
