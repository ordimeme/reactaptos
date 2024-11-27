import { Button } from "@/components/ui/button"
import { MarketItem } from "@/data/marketData"
import { truncateAddress, getFullAddress } from "@/utils/truncateAddress"
import { Copy } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useState, useRef } from "react"
import { Pagination } from "@/components/Pagination"
import { formatRelativeTime } from "@/utils/formatDate"

interface TradesViewProps {
  token: MarketItem;
}

const TRADES_PER_PAGE = 20;

export function TradesView({ token }: TradesViewProps) {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const tradesRef = useRef<HTMLDivElement>(null);
  const totalPages = Math.ceil(token.trades.length / TRADES_PER_PAGE);

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

  // 计算当前页的交易数据
  const startIndex = (currentPage - 1) * TRADES_PER_PAGE;
  const currentTrades = token.trades.slice(startIndex, startIndex + TRADES_PER_PAGE);

  return (
    <div className="-mx-2 sm:mx-0 space-y-4" ref={tradesRef}>
      {/* 页码信息显示 - 调整内边距 */}
      <div className="text-sm text-muted-foreground px-4 sm:px-0">
        Showing {startIndex + 1} to {Math.min(startIndex + TRADES_PER_PAGE, token.trades.length)} of {token.trades.length} trades
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="rounded-none sm:rounded-lg border-x-0 sm:border-x border-t border-b border-muted/40 dark:border-muted/20 overflow-hidden">
            {/* 表头 */}
            <div className="grid grid-cols-[2fr,2fr,1.5fr] gap-0.5 md:gap-2 p-2 md:p-3 text-xs md:text-sm text-muted-foreground bg-muted/5">
              <div className="pl-4 sm:pl-2">Account</div>
              <div>Amount</div>
              <div className="text-right pr-4 sm:pr-2">Transaction</div>
            </div>
            
            {/* 交易列表 */}
            <div className="divide-y divide-muted/20">
              {currentTrades.map((trade, index) => (
                <div 
                  key={index} 
                  className="grid grid-cols-[2fr,2fr,1.5fr] gap-0.5 md:gap-2 p-2 md:p-3 text-xs md:text-sm hover:bg-muted/5 transition-colors"
                >
                  {/* 账户地址 */}
                  <div className="flex items-center gap-0.5 md:gap-1 pl-4 sm:pl-2">
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
                  
                  {/* 交易金额 */}
                  <div className="flex flex-col gap-1">
                    <span className="font-mono">
                      {trade.tokenAmount.toFixed(3)} {token.symbol}
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-muted-foreground">
                        {trade.aptAmount.toFixed(3)} APT
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(trade.timestamp)}
                      </span>
                      <span className={`px-1.5 py-0.5 text-[9px] leading-[10px] font-medium whitespace-pre ${
                        trade.type === 'buy' 
                          ? 'bg-green-500/20 text-green-500' 
                          : 'bg-red-500/20 text-red-500'
                      }`}>
                        {trade.type === 'buy' ? 'BUY' : 'SELL'}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">
                      ${(trade.aptAmount * token.price).toFixed(2)}
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
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 分页器 - 调整内边距 */}
      {totalPages > 1 && (
        <div className="px-4 sm:px-0">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            scrollToRef={tradesRef}
          />
        </div>
      )}
    </div>
  );
} 