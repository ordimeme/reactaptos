import { Button } from "@/components/ui/button"
import { MarketItem } from "@/data/marketData"
import { truncateAddress, getFullAddress, formatTxHash } from "@/utils/truncateAddress"
import { Copy } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"

interface TradesViewProps {
  token: MarketItem;
  visibleTrades: number;
  handleLoadMoreTrades: () => void;
  formatTime: (timestamp: string) => string;
}

export function TradesView({
  token,
  visibleTrades,
  handleLoadMoreTrades,
  formatTime
}: TradesViewProps) {
  const { toast } = useToast();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-muted/40 dark:border-muted/20 overflow-hidden">
        {/* 表头 */}
        <div className="grid grid-cols-6 gap-1 md:gap-2 p-2 md:p-3 text-xs md:text-sm text-muted-foreground bg-muted/5">
          <div className="col-span-1">Account</div>
          <div className="col-span-1">Type</div>
          <div className="col-span-1 text-right">Amount ({token.symbol})</div>
          <div className="col-span-1 text-right">Amount (APT)</div>
          <div className="col-span-1 text-right">Time</div>
          <div className="col-span-1 text-right">{isMobile ? 'Txs' : 'Transaction'}</div>
        </div>
        
        {/* 交易列表 */}
        <div className="divide-y divide-muted/20">
          {token.trades.slice(0, visibleTrades).map((trade, index) => (
            <div 
              key={index} 
              className="grid grid-cols-6 gap-1 md:gap-2 p-2 md:p-3 text-xs md:text-sm hover:bg-muted/5 transition-colors"
            >
              {/* 账户地址 */}
              <div className="col-span-1 flex items-center gap-0.5 md:gap-1">
                <span className="font-mono truncate">
                  {truncateAddress(trade.account)}
                </span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 md:h-5 md:w-5 hover:bg-muted"
                  onClick={() => handleCopyAddress(trade.account)}
                >
                  <Copy className="h-2.5 w-2.5 md:h-3 md:w-3" />
                </Button>
              </div>
              
              {/* 交易类型 */}
              <div className="col-span-1">
                <span className={`px-1.5 md:px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium ${
                  trade.type === 'buy' 
                    ? 'bg-green-500/20 text-green-500' 
                    : 'bg-red-500/20 text-red-500'
                }`}>
                  {trade.type.toUpperCase()}
                </span>
              </div>
              
              {/* 代币数量 */}
              <div className="col-span-1 text-right font-mono">
                {trade.tokenAmount.toFixed(3)}
              </div>

              {/* APT 金额 */}
              <div className="col-span-1 text-right font-mono">
                {trade.aptAmount.toFixed(3)}
              </div>
              
              {/* 时间 */}
              <div className="col-span-1 text-right text-muted-foreground">
                {formatTime(trade.timestamp)}
              </div>

              {/* 交易哈希 */}
              <div className="col-span-1 text-right">
                <a 
                  href={`https://explorer.aptoslabs.com/txn/${trade.txHash}?network=mainnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-blue-500 hover:text-blue-600 truncate inline-block max-w-[60px] md:max-w-[100px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {formatTxHash(trade.txHash, isMobile)}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {token.trades.length > visibleTrades && (
        <Button 
          variant="outline" 
          className="w-full mt-4" 
          onClick={handleLoadMoreTrades}
        >
          Load More Trades
        </Button>
      )}
    </div>
  );
} 