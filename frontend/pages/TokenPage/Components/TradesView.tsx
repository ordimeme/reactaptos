import { Button } from "@/components/ui/button"
import { MarketItem, Trade } from "@/types/market"
import { truncateAddress, getFullAddress } from "@/utils/truncateAddress"
import { Copy } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useState, useRef, useEffect } from "react"
import { Pagination } from "@/components/Pagination"
import { formatRelativeTime } from "@/utils/formatDate"
import { usePriceContext } from "@/context/PriceContext"
import { Tag } from "@/components/ui/tag"
import { formatDisplayPrice } from "@/utils/format"

interface TradesViewProps {
  token: MarketItem;
}

const TRADES_PER_PAGE = 20;

export function TradesView({ token }: TradesViewProps) {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const tradesRef = useRef<HTMLDivElement>(null);
  const { tokenTrades, tokenPrices } = usePriceContext();
  
  // 添加更详细的日志
  useEffect(() => {
    console.log('TradesView mounted/updated:', {
      tokenId: token.id,
      hasTokenTrades: !!tokenTrades[token.id],
      tradesCount: tokenTrades[token.id]?.length || 0,
      trades: tokenTrades[token.id]?.slice(0, 3) || [] // 打印前3条用于调试
    });
  }, [token.id, tokenTrades]);

  // 获取当前代币的交易数据
  const trades = tokenTrades[token.id] || [];

  const currentPrice = tokenPrices[token.id] || {
    close: formatDisplayPrice(token.currentPrice)
  };

  // 当有新交易时自动跳转到第一页
  useEffect(() => {
    if (trades.length > 0) {
      console.log('New trades received:', trades.length);
      setCurrentPage(1);
      if (tradesRef.current) {
        tradesRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [trades.length]);

  // 计算当前页的交易数据
  const startIndex = (currentPage - 1) * TRADES_PER_PAGE;
  const currentTrades = [...trades]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(startIndex, startIndex + TRADES_PER_PAGE);

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

  const handleCopyTxHash = async (hash: string) => {
    try {
      await navigator.clipboard.writeText(hash);
      toast({
        title: "Success",
        description: "Transaction hash has been copied to clipboard",
      });
    } catch (err) {
      console.error('Failed to copy:', err);
      toast({
        title: "Failed",
        description: "Failed to copy transaction hash",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mx-0 sm:mx-0 space-y-4" ref={tradesRef}>
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="rounded-none sm:rounded-lg border-x-0 sm:border-x border-t border-b border-muted/40 dark:border-muted/20 overflow-hidden">
            {/* 表头 */}
            <div className="grid grid-cols-4 gap-0.5 md:gap-2 p-2 md:p-3 text-xs md:text-sm text-muted-foreground bg-muted/5">
              <div className="pl-4 sm:pl-2">Time/Type</div>
              <div>Account</div>
              <div>Amount</div>
              <div className="text-right pr-4 sm:pr-2">Transaction</div>
            </div>
            
            {/* 交易列表 */}
            <div className="divide-y divide-muted/20">
              {currentTrades.length > 0 ? (
                currentTrades.map((trade: Trade) => (
                  <div 
                    key={`${trade.txHash}-${trade.timestamp}`}
                    className="grid grid-cols-4 gap-0.5 md:gap-2 p-2 md:p-3 text-xs md:text-sm hover:bg-muted/5 transition-colors"
                  >
                    {/* 时间和交易类型 */}
                    <div className="flex flex-col gap-0.5 pl-4 sm:pl-2 justify-center">
                      <span className="font-mono text-[10px] md:text-xs text-muted-foreground">
                        {formatRelativeTime(trade.timestamp)}
                        <Tag variant={trade.type === 'buy' ? 'buy' : 'sell'} className="ml-2 w-fit">
                        {trade.type === 'buy' ? 'Buy' : 'Sell'}
                        </Tag>
                      </span>
                      
                    </div>

                    {/* 账户地址 */}
                    <div className="flex items-center gap-0.5 md:gap-1">
                      <span className="font-mono truncate">
                        {truncateAddress(trade.trader, 6, 4, true)}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-4 w-4 md:h-5 md:w-5 hover:bg-muted"
                        onClick={() => handleCopyAddress(trade.trader)}
                      >
                        <Copy className="h-2.5 w-2.5 md:h-3 md:w-3" />
                      </Button>
                    </div>
                    
                    {/* 交易金额 */}
                    <div className="flex flex-col gap-0.5">
                      <span className="font-mono">
                        {formatDisplayPrice(trade.tokenAmount)} {token.symbol}
                      </span>
                      <span className="font-mono text-[10px] md:text-xs text-muted-foreground">
                        {formatDisplayPrice(Math.abs(trade.aptAmount))} APT
                      </span>
                      <span className="font-mono text-[10px] md:text-xs text-muted-foreground">
                        ${formatDisplayPrice(Math.abs(trade.aptAmount) * parseFloat(currentPrice.close))}
                      </span>
                    </div>

                    {/* 交易哈希 */}
                    <div className="text-right font-mono flex items-center justify-end gap-0.5 md:gap-1 pr-4 sm:pr-2">
                      <a 
                        href={`https://explorer.aptoslabs.com/txn/${trade.txHash}?network=mainnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {truncateAddress(trade.txHash)}
                      </a>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-4 w-4 md:h-5 md:w-5 hover:bg-muted"
                        onClick={() => handleCopyTxHash(trade.txHash)}
                      >
                        <Copy className="h-2.5 w-2.5 md:h-3 md:w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  No trades available yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 分页器 */}
      {trades.length > TRADES_PER_PAGE && (
        <div className="px-4 sm:px-0">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(trades.length / TRADES_PER_PAGE)}
            onPageChange={setCurrentPage}
            scrollToRef={tradesRef}
          />
        </div>
      )}
    </div>
  );
} 