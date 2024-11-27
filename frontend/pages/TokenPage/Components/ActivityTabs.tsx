import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MarketItem } from "@/data/marketData"

interface ActivityTabsProps {
  token: MarketItem;
  activeTab: "comments" | "trades";
  setActiveTab: (tab: "comments" | "trades") => void;
  commentContent: string;
  setCommentContent: (content: string) => void;
  visibleComments: number;
  visibleTrades: number;
  handleLoadMore: () => void;
  handleLoadMoreTrades: () => void;
  handleSubmitComment: () => void;
  formatTime: (timestamp: string) => string;
}

export function ActivityTabs({
  token,
  activeTab,
  setActiveTab,
  commentContent,
  setCommentContent,
  visibleComments,
  visibleTrades,
  handleLoadMore,
  handleLoadMoreTrades,
  handleSubmitComment,
  formatTime
}: ActivityTabsProps) {
  // 生成随机地址的函数
  const generateRandomAddress = () => {
    return `0x${Math.random().toString(36).substring(2, 8)}...${Math.random().toString(36).substring(2, 8)}`;
  };

  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "comments" | "trades")}>
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="comments" className="relative">
            Comments
            <span className="ml-2 text-xs text-muted-foreground">
              ({token.comments.length})
            </span>
          </TabsTrigger>
          <TabsTrigger value="trades" className="relative hidden lg:inline-flex">
            Trades
            <span className="ml-2 text-xs text-muted-foreground">
              ({token.trades.length})
            </span>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="comments" className="space-y-4">
        {/* 评论输入框 */}
        <div className="flex gap-2">
          <Input
            placeholder="Write a comment..."
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
          />
          <Button onClick={handleSubmitComment}>Send</Button>
        </div>

        {/* 评论列表 */}
        <div className="space-y-4">
          {token.comments.slice(0, visibleComments).map((comment, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between">
                    <span className="font-mono text-sm text-muted-foreground">
                      {generateRandomAddress()}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {formatTime(comment.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              </div>
            </Card>
          ))}
          {token.comments.length > visibleComments && (
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleLoadMore}
            >
              Load More Comments
            </Button>
          )}
        </div>
      </TabsContent>

      {/* 更新 Trades Tab Content 样式 */}
      <TabsContent value="trades">
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

        {/* Load More 按钮 */}
        {token.trades.length > visibleTrades && (
          <Button 
            variant="outline" 
            className="w-full mt-4" 
            onClick={handleLoadMoreTrades}
          >
            Load More Trades
          </Button>
        )}
      </TabsContent>
    </Tabs>
  );
} 