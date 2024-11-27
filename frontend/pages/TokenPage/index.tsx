import { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { marketData } from "@/data/marketData";
import { TokenInfo } from "./Components/TokenInfo";
import { TradeCard } from "./Components/TradeCard";
import { ActivityTabs } from "./Components/ActivityTabs";
import { SlippageDialog } from "./Components/SlippageDialog";
import { BottomNav } from "./Components/BottomNav";
import { ThemeContext } from "@/context/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { TradesView } from "./Components/TradesView";
import { ChartView } from "./Components/ChartView";
import { cn } from "@/lib/utils";

export default function TokenPage() {
  const { theme } = useContext(ThemeContext);
  const { id } = useParams();
  
  // 评论相关状态
  const [commentContent, setCommentContent] = useState("");
  const [visibleComments, setVisibleComments] = useState(20);
  const [activeTab, setActiveTab] = useState<"comments" | "trades">("comments");
  
  // 交易相关状态
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [tokenType, setTokenType] = useState<"APT" | "APT">("APT");
  const [amount, setAmount] = useState<string>("0.0");
  const [visibleTrades, setVisibleTrades] = useState(20);
  
  // 滑点设置相关状态
  const [isSlippageDialogOpen, setIsSlippageDialogOpen] = useState(false);
  const [slippage, setSlippage] = useState<string>("2");
  const [enableFrontRunning, setEnableFrontRunning] = useState(true);
  const [priorityFee, setPriorityFee] = useState<string>("0.01");

  // 添加移动端导航状态
  const [mobileTab, setMobileTab] = useState<"buy/sell" | "info" | "chart" | "txs">("buy/sell");

  const token = marketData.find(item => item.id === id);

  if (!token) {
    return <div className="container mx-auto px-4 py-8">Token not found</div>;
  }

  // 获取安全的图片URL
  const getSafeImageUrl = (symbol: string) => {
    const safeName = symbol.toLowerCase().replace(/[^a-z0-9]/g, '');
    return `/tokens/${safeName}.svg`;
  };

  // 格式化时间
  const formatTime = (timestamp: string) => {
    const minutes = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000 / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  // 处理快速选择按钮点击
  const handleQuickAmount = (amount: string) => {
    if (tradeType === "sell") {
      const percentage = parseFloat(amount.replace("%", "")) / 100;
      const userBalance = 1000; // 示例数值，实际应该从钱包获取
      setAmount((userBalance * percentage).toString());
    } else if (tradeType === "buy" && tokenType === "APT") {
      setAmount(amount.replace(" APT", ""));
    }
  };

  // Reset 功能
  const handleReset = () => {
    setAmount("0.0");
  };

  // 加载更多评论
  const handleLoadMore = () => {
    setVisibleComments(prev => Math.min(prev + 20, token.comments.length));
  };

  // 加载更多交易记录
  const handleLoadMoreTrades = () => {
    setVisibleTrades(prev => Math.min(prev + 20, token.trades.length));
  };

  // 提交评论
  const handleSubmitComment = () => {
    if (!commentContent.trim()) return;
    setCommentContent("");
  };

  // 计算24小时涨跌幅
  const getPriceChange = () => {
    const trades = token.trades;
    if (trades.length < 2) return 0;

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    // 找到24小时前最近的交易
    const oldTrade = trades.find(trade => new Date(trade.timestamp) < oneDayAgo);
    const latestTrade = trades[0];

    if (!oldTrade) return 0;

    const priceChange = ((latestTrade.aptAmount / latestTrade.tokenAmount) - 
                        (oldTrade.aptAmount / oldTrade.tokenAmount)) / 
                        (oldTrade.aptAmount / oldTrade.tokenAmount) * 100;

    return priceChange;
  };

  // 渲染移动端内容
  const renderMobileContent = () => {
    switch (mobileTab) {
      case "buy/sell":
        return (
          <div className="space-y-6">
            {/* Market Cap 和 CA 信息 */}
            <Card className="border-muted/40 dark:border-muted/20">
              <CardContent className="pt-6 space-y-6">
                {/* Market Cap 和 Bonding Progress */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    MCap: ${token.marketCap.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Bonding: {token.bondingProgress}%
                  </div>
                </div>

                {/* Contract Address - 使用 TokenInfo 样式 */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">ca:</span>
                    <div className="flex items-center gap-2 bg-muted/20 rounded px-2 py-1 flex-1">
                      <span className="text-sm font-mono truncate">{token.creator}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 hover:bg-muted"
                        onClick={() => navigator.clipboard.writeText(token.creator)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trade Card */}
            <TradeCard 
              token={{
                ...token,
                imageUrl: getSafeImageUrl(token.symbol)
              }}
              tradeType={tradeType}
              tokenType={tokenType}
              amount={amount}
              setTradeType={setTradeType}
              setTokenType={setTokenType}
              setAmount={setAmount}
              handleQuickAmount={handleQuickAmount}
              handleReset={handleReset}
              setIsSlippageDialogOpen={setIsSlippageDialogOpen}
            />

            {/* Comments Section */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-4">Comments</h2>
              <ActivityTabs 
                token={token}
                activeTab="comments"
                setActiveTab={() => {}}
                commentContent={commentContent}
                setCommentContent={setCommentContent}
                visibleComments={visibleComments}
                visibleTrades={visibleTrades}
                handleLoadMore={handleLoadMore}
                handleLoadMoreTrades={handleLoadMoreTrades}
                handleSubmitComment={handleSubmitComment}
                formatTime={formatTime}
              />
            </div>
          </div>
        );
      case "txs":
        return (
          <TradesView 
            token={token}
            visibleTrades={visibleTrades}
            handleLoadMoreTrades={handleLoadMoreTrades}
            formatTime={formatTime}
          />
        );
      case "info":
        return (
          <TokenInfo 
            token={{
              ...token,
              imageUrl: getSafeImageUrl(token.symbol)
            }} 
          />
        );
      case "chart":
        return <ChartView token={token} />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 pb-[140px] lg:pb-8">
      {/* Token Info Card - 在所有视图中都显示 */}
      <Card className="border-muted/40 dark:border-muted/20 mb-8">
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="w-16 h-16 overflow-hidden rounded-[10px] flex items-center justify-center bg-muted/50 dark:bg-muted/20">
            <img 
              src={getSafeImageUrl(token.symbol)}
              alt={token.name} 
              className="w-full h-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = getSafeImageUrl(token.symbol);
              }}
            />
          </div>
          <div className="flex-1">
            <CardTitle className="text-2xl font-bold">{token.name}</CardTitle>
            <div className="flex items-center gap-2">
              <p className="text-muted-foreground">{token.symbol}</p>
              <p className={cn(
                "text-sm font-medium",
                getPriceChange() >= 0 ? "text-green-500" : "text-red-500"
              )}>
                ({getPriceChange() >= 0 ? "+" : ""}{getPriceChange().toFixed(2)}% 24h)
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">${token.price.toFixed(2)}</p>
          </div>
        </CardHeader>
      </Card>

      {/* 桌面端布局 */}
      <div className="hidden lg:flex lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          {/* Price Chart Card */}
          <ChartView token={token} />

          {/* Activity Tabs */}
          <ActivityTabs 
            token={token}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            commentContent={commentContent}
            setCommentContent={setCommentContent}
            visibleComments={visibleComments}
            visibleTrades={visibleTrades}
            handleLoadMore={handleLoadMore}
            handleLoadMoreTrades={handleLoadMoreTrades}
            handleSubmitComment={handleSubmitComment}
            formatTime={formatTime}
          />
        </div>

        {/* Right Column */}
        <div className="lg:w-[400px] space-y-6">
          {/* Trade Card */}
          <TradeCard 
            token={{
              ...token,
              imageUrl: getSafeImageUrl(token.symbol) // 传递安全的图片URL
            }}
            tradeType={tradeType}
            tokenType={tokenType}
            amount={amount}
            setTradeType={setTradeType}
            setTokenType={setTokenType}
            setAmount={setAmount}
            handleQuickAmount={handleQuickAmount}
            handleReset={handleReset}
            setIsSlippageDialogOpen={setIsSlippageDialogOpen}
          />
          
          {/* Token Info */}
          <TokenInfo 
            token={{
              ...token,
              imageUrl: getSafeImageUrl(token.symbol) // 传递安全的图片URL
            }} 
          />
        </div>
      </div>

      {/* 移动端布局 */}
      <div className="lg:hidden">
        {renderMobileContent()}
      </div>

      {/* 底部导航 */}
      <BottomNav activeTab={mobileTab} setActiveTab={setMobileTab} />

      {/* Slippage Dialog */}
      <SlippageDialog 
        open={isSlippageDialogOpen}
        onOpenChange={setIsSlippageDialogOpen}
        slippage={slippage}
        setSlippage={setSlippage}
        enableFrontRunning={enableFrontRunning}
        setEnableFrontRunning={setEnableFrontRunning}
        priorityFee={priorityFee}
        setPriorityFee={setPriorityFee}
        theme={theme || "" }
      />
    </div>
  );
}
