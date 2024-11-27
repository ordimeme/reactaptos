import { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { marketData } from "@/data/marketData";
import { TokenInfo } from "./Components/TokenInfo";
import { TradeCard } from "./Components/TradeCard";
import { ActivityTabs } from "./Components/ActivityTabs";
import { SlippageDialog } from "./Components/SlippageDialog";
import { BottomNav } from "./Components/BottomNav";
import { ThemeContext } from "@/context/ThemeContext";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { TradesView } from "./Components/TradesView";
import { ChartView } from "./Components/ChartView";
import { useToast } from "@/components/ui/use-toast";
import { truncateAddress, getFullAddress } from "@/utils/truncateAddress";
import { Comments } from "./Components/Comments";

export default function TokenPage() {
  const { toast } = useToast();
  const { theme } = useContext(ThemeContext);
  const { id } = useParams();
  
  // 评论相关状态
  const [commentContent, setCommentContent] = useState("");
  const [activeTab, setActiveTab] = useState<"comments" | "trades">("comments");
  
  // 交易相关状态
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [tokenType, setTokenType] = useState<"APT" | "APT">("APT");
  const [amount, setAmount] = useState<string>("0.0");
  
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
    try {
      return `/tokens/${symbol.toLowerCase()}.svg`;
    } catch (error) {
      return '/tokens/default.svg';
    }
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

  // 提交评论
  const handleSubmitComment = () => {
    if (!commentContent.trim()) return;
    setCommentContent("");
  };

  // 计算24小时涨跌幅
  const priceChange = (() => {
    const trades = token.trades;
    if (trades.length < 2) return 0;

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const oldTrade = trades.find(trade => new Date(trade.timestamp) < oneDayAgo);
    const latestTrade = trades[0];

    if (!oldTrade) return 0;

    return ((latestTrade.aptAmount / latestTrade.tokenAmount) - 
            (oldTrade.aptAmount / oldTrade.tokenAmount)) / 
            (oldTrade.aptAmount / oldTrade.tokenAmount) * 100;
  })();

  // 添加复制函数
  const handleCopyCA = async (address: string) => {
    try {
      await navigator.clipboard.writeText(getFullAddress(address));
      toast({
        title: "Success",
        description: "Contract address has been copied to clipboard",
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

  // 渲染移动端内容
  const renderMobileContent = () => {
    switch (mobileTab) {
      case "buy/sell":
        return (
          <div className="space-y-4">
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
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-4">Comments</h2>
              <Comments 
                token={token}
                commentContent={commentContent}
                setCommentContent={setCommentContent}
                handleSubmitComment={handleSubmitComment}
              />
            </div>
          </div>
        );
      case "txs":
        return (
          <div className="-mx-2">
            <TradesView token={token} />
          </div>
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
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 pb-[140px] lg:pb-8">
      {/* Token Info Card */}
      <Card className="border-muted/40 dark:border-muted/20 mb-4 sm:mb-8">
        <CardHeader className="flex flex-col gap-4 p-3 sm:p-6">
          {/* 顶部区域：图标和价格 */}
          <div className="flex items-start justify-between gap-3">
            {/* 左侧图标和名称 */}
            <div className="flex gap-3 items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 overflow-hidden rounded-[10px] flex-shrink-0 flex items-center justify-center bg-muted/50 dark:bg-muted/20">
                <img 
                  src={getSafeImageUrl(token.symbol)}
                  alt={token.name} 
                  className="w-full h-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes('default.svg')) {
                      target.src = '/tokens/default.svg';
                    }
                    target.onerror = null;
                  }}
                />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold truncate">
                  {token.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{token.symbol}</p>
              </div>
            </div>

            {/* 右侧价格信息 */}
            <div className="text-right flex-shrink-0">
              <p className="text-lg sm:text-xl md:text-2xl font-bold">${token.price.toFixed(2)}</p>
              <p className={`text-xs sm:text-sm ${priceChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                ({priceChange >= 0 ? "+" : ""}{priceChange.toFixed(2)}% 24h)
              </p>
            </div>
          </div>

          {/* 底部区域：合约地址和创建者地址 */}
          <div className="flex flex-row md:flex-col gap-2 md:gap-3">
            {/* Contract 地址 */}
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                <span className="hidden md:inline">Contract Address:</span>
                <span className="md:hidden">CA:</span>
              </span>
              <div className="flex items-center gap-0 flex-1 min-w-0">
                <div className="flex items-center flex-1 min-w-0">
                  <span className="text-xs font-mono truncate md:text-sm">
                    <span className="md:hidden">{truncateAddress(token.creator)}</span>
                    <span className="hidden md:inline">{getFullAddress(token.creator)}</span>
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 hover:bg-muted/50 shrink-0 ml-0.5"
                    onClick={() => handleCopyCA(token.creator)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Creator 地址 - 移动端右对齐 */}
            <div className="flex items-center gap-1.5 flex-1 min-w-0 md:justify-start justify-end">
              <div className="flex items-center gap-0 flex-1 min-w-0 justify-end md:justify-start">
                <div className="flex items-center min-w-0 justify-end md:justify-start">
                  <span className="text-xs text-muted-foreground whitespace-nowrap mr-1.5">
                    <span className="hidden md:inline">Creator Address:</span>
                    <span className="md:hidden">CR:</span>
                  </span>
                  <span className="text-xs font-mono truncate md:text-sm">
                    <span className="md:hidden">{truncateAddress(token.creator)}</span>
                    <span className="hidden md:inline">{getFullAddress(token.creator)}</span>
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 hover:bg-muted/50 shrink-0 ml-0.5"
                    onClick={() => handleCopyCA(token.creator)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 桌面端布局 */}
      <div className="hidden lg:flex lg:flex-row gap-6">
        {/* 左侧列 */}
        <div className="w-[calc(100%-480px)] space-y-6">
          <ChartView token={token} />
          <ActivityTabs 
            token={token}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            commentContent={commentContent}
            setCommentContent={setCommentContent}
            handleSubmitComment={handleSubmitComment}
          />
        </div>

        {/* 右侧列 */}
        <div className="w-[460px] space-y-6">
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
          <TokenInfo 
            token={{
              ...token,
              imageUrl: getSafeImageUrl(token.symbol)
            }} 
          />
        </div>
      </div>

      {/* 移动端布局 */}
      <div className="lg:hidden space-y-4">
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
        theme={theme || ""}
      />
    </div>
  );
}
