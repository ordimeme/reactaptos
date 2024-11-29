import { useState, useContext, useCallback, useEffect } from "react";
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
import { PriceData } from "@/types/market";
import { useToast } from "@/components/ui/use-toast";
import { truncateAddress, getFullAddress } from "@/utils/truncateAddress";
import { Comments } from "./Components/Comments";
import { usePriceContext } from "@/context/PriceContext";

// 添加价格格式化函数
const formatPrice = (price: string | number): string => {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  const formatted = num.toFixed(4);
  return formatted.replace(/\.?0+$/, ''); // 移除末尾的零
};

export default function TokenPage() {
  const { toast } = useToast();
  const { theme } = useContext(ThemeContext);
  const { id } = useParams();
  const token = marketData.find(item => item.id === id);
  const { initializePrice } = usePriceContext();

  // 确保在组件挂载时初始化价格
  useEffect(() => {
    if (token) {
      console.log('Initializing price for token:', token.id);
      initializePrice(token);
    }
  }, [token, initializePrice]);

  // 评论相关状态
  const [commentContent, setCommentContent] = useState("");
  const [activeTab, setActiveTab] = useState<"comments" | "trades">("comments");
  
  // 交易相关状态
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState<string>("");
  
  // 滑点设置相关状态
  const [isSlippageDialogOpen, setIsSlippageDialogOpen] = useState(false);
  const [slippage, setSlippage] = useState<string>("2");
  const [enableFrontRunning, setEnableFrontRunning] = useState(true);
  const [priorityFee, setPriorityFee] = useState<string>("0.01");

  // 移动端导航状态
  const [mobileTab, setMobileTab] = useState<"buy/sell" | "info" | "txs">("buy/sell");

  // 钱包相关状态
  const [aptBalance, _setAptBalance] = useState<number>(0);
  const [tokenBalance, _setTokenBalance] = useState<number>(0);

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

  // 提交评论
  const handleSubmitComment = () => {
    if (!commentContent.trim()) return;
    setCommentContent("");
  };

  // 使用新的计算函数替换原来的计算逻辑
  // const priceChange = calculate24hPriceChange(token.trades);

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

  // 在组件顶部添加price状态
  const [currentPrice, setCurrentPrice] = useState<PriceData>({
    open: formatPrice(token?.currentPrice || 0),
    high: formatPrice(token?.currentPrice || 0),
    low: formatPrice(token?.currentPrice || 0),
    close: formatPrice(token?.currentPrice || 0),
    time: new Date().toLocaleString('en-US', { 
      timeZone: 'Asia/Shanghai',
      hour12: false 
    }),
    price24h: formatPrice(token?.currentPrice || 0),
    time24h: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString('en-US', {
      timeZone: 'Asia/Shanghai',
      hour12: false
    }),
    change24h: '0.00',
    changePercent: '0.00'
  });

  // 修改handlePriceUpdate函数
  const handlePriceUpdate = useCallback((newPrice: PriceData) => {
    console.log('TokenPage price update:', newPrice); // 添加日志
    setCurrentPrice(newPrice);
  }, []);

  // 处理图表hover价格更新（可选，如果需要在其他地方使用）
  const handleHoverPriceChange = useCallback(() => {
    // 如果不需要处理 hover 价格变化，可以保留一个空函数
  }, []);


  // 渲染移动端内容
  const renderMobileContent = () => {
    switch (mobileTab) {
      case "buy/sell":
        return (
          <div className="space-y-6">
            <ChartView 
              token={token} 
              onPriceUpdate={handlePriceUpdate}
              onHoverPriceChange={handleHoverPriceChange}
              initialPrice={currentPrice}
            />

            <TradeCard 
              token={{
                ...token,
                imageUrl: getSafeImageUrl(token.symbol)
              }}
              currentPrice={currentPrice}
              tradeType={tradeType}
              amount={amount}
              setTradeType={setTradeType}
              setAmount={setAmount}
              aptBalance={aptBalance}
              tokenBalance={tokenBalance}
            />

            <div className="px-2">
              <Comments 
                token={token}
                commentContent={commentContent}
                setCommentContent={setCommentContent}
                handleSubmitComment={handleSubmitComment}
              />
            </div>
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
      case "txs":
        return (
          <div className="-mx-2">
            <TradesView token={token} />
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 pb-[48px] lg:pb-8 max-w-[1440px]">
      {/* Token Info Card */}
      <Card className="border-muted/40 dark:border-muted/20 mb-4 overflow-hidden">
        <CardHeader className="flex flex-col gap-4 p-3 sm:p-6">
          {/* 顶部区域：图标和格 */}
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
              <p className="text-lg sm:text-xl md:text-2xl font-bold">
                ${formatPrice(currentPrice.close)}
              </p>
              <div className="flex items-center justify-end gap-2">
                <p className={`text-xs sm:text-sm ${
                  parseFloat(currentPrice.change24h) >= 0 ? "text-green-500" : "text-red-500"
                }`}>
                  ({parseFloat(currentPrice.change24h) >= 0 ? "+" : ""}
                  {currentPrice.change24h}% 24h)
                </p>
              </div>
            </div>
          </div>

          {/* 底部区域：合约地址和创建者地址 */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
            {/* Contract Address */}
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">CA:</span>
              <div className="flex items-center">
                <span className="font-mono">
                  {truncateAddress(token.contractAddress, 6, 4, true)}
                </span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 hover:bg-muted/50 ml-1"
                  onClick={() => handleCopyCA(token.contractAddress)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Creator Address */}
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">CR:</span>
              <div className="flex items-center">
                <span className="font-mono">
                  {truncateAddress(token.creator, 6, 4, true)}
                </span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 hover:bg-muted/50 ml-1"
                  onClick={() => handleCopyCA(token.creator)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 桌面端布局 */}
      <div className="hidden lg:flex lg:flex-row gap-6">
        {/* 左侧列 */}
        <div className="flex-1 min-w-0 space-y-6">
          <ChartView 
            token={token} 
            onPriceUpdate={handlePriceUpdate}
            onHoverPriceChange={handleHoverPriceChange}
            initialPrice={currentPrice}
          />
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
        <div className="w-[420px] flex-shrink-0 space-y-6">
          <TradeCard 
            token={{
              ...token,
              imageUrl: getSafeImageUrl(token.symbol)
            }}
            currentPrice={currentPrice}
            tradeType={tradeType}
            amount={amount}
            setTradeType={setTradeType}
            setAmount={setAmount}
            aptBalance={aptBalance}
            tokenBalance={tokenBalance}
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
      <div className="lg:hidden space-y-4 -mx-2 sm:mx-0">
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