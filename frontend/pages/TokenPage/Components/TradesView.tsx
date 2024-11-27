import { Button } from "@/components/ui/button"
import { MarketItem } from "@/data/marketData"

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
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-muted/40 dark:border-muted/20 overflow-hidden">
        {/* 表头 */}
        <div className="grid grid-cols-6 gap-2 p-3 text-sm text-muted-foreground bg-muted/5">
          <div>Account</div>
          <div>Type</div>
          <div className="text-right">Amount ({token.symbol})</div>
          <div className="text-right">Amount (APT)</div>
          <div className="text-right">Time</div>
          <div className="text-right">Transaction</div>
        </div>
        
        {/* 交易列表 */}
        <div className="divide-y divide-muted/20">
          {token.trades.slice(0, visibleTrades).map((trade, index) => (
            <div 
              key={index} 
              className="grid grid-cols-6 gap-2 p-3 text-sm hover:bg-muted/5 transition-colors"
            >
              {/* 账户地址 */}
              <div className="font-mono text-xs truncate">
                {trade.account}
              </div>
              
              {/* 交易类型 */}
              <div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  trade.type === 'buy' 
                    ? 'bg-green-500/20 text-green-500' 
                    : 'bg-red-500/20 text-red-500'
                }`}>
                  {trade.type.toUpperCase()}
                </span>
              </div>
              
              {/* 代币数量 */}
              <div className="text-right font-mono">
                {trade.tokenAmount.toFixed(3)}
              </div>

              {/* APT 金额 */}
              <div className="text-right font-mono">
                {trade.aptAmount.toFixed(3)}
              </div>
              
              {/* 时间 */}
              <div className="text-right text-muted-foreground text-xs">
                {formatTime(trade.timestamp)}
              </div>

              {/* 交易哈希 */}
              <div className="text-right">
                <a 
                  href={`https://explorer.aptoslabs.com/txn/${trade.txHash}?network=mainnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-blue-500 hover:text-blue-600 truncate inline-block max-w-[100px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {trade.txHash.slice(0, 6)}...{trade.txHash.slice(-4)}
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