import { useState, useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useParams } from "react-router-dom";
import { marketData } from "@/data/marketData";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Copy } from "lucide-react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"

// // 添加holder类型定义
// interface Holder {
//   address: string;
//   percentage: number;
//   type?: string;
// }

const TokenPage = () => {
  const { theme } = useContext(ThemeContext);
  const { id } = useParams();
  const [commentContent, setCommentContent] = useState("");
  const [visibleComments, setVisibleComments] = useState(20);
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [tokenType, setTokenType] = useState<"APT" | "APT">("APT");
  const [amount, setAmount] = useState<string>("0.0");
  const [isSlippageDialogOpen, setIsSlippageDialogOpen] = useState(false);
  const [slippage, setSlippage] = useState<string>("2");
  const [enableFrontRunning, setEnableFrontRunning] = useState(true);
  const [priorityFee, setPriorityFee] = useState<string>("0.01");
  const [visibleTrades, setVisibleTrades] = useState(20);
  const [activeTab, setActiveTab] = useState<"comments" | "trades">("comments");
  
  const token = marketData.find(item => item.id === id);

  if (!token) {
    return <div className="container mx-auto px-4 py-8">Token not found</div>;
  }

  // 获取前20个holders
  const visibleHolders = token.holders.slice(0, 20);

  const handleLoadMore = () => {
    setVisibleComments(prev => Math.min(prev + 20, token.comments.length));
  };

  const handleSubmitComment = () => {
    if (!commentContent.trim()) return;
    setCommentContent("");
  };

  // 处理快速选择按钮点击
  const handleQuickAmount = (amount: string) => {
    if (tradeType === "sell") {
      // 卖出时使用百分比
      const percentage = parseFloat(amount.replace("%", "")) / 100;
      // 这里可以添加获取用户持有代币数量的逻辑
      const userBalance = 1000; // 示例数值，实际应该从钱包获取
      setAmount((userBalance * percentage).toString());
    } else if (tradeType === "buy" && tokenType === "APT") {
      // 买入且使用APT时，直接设置APT数量
      setAmount(amount.replace(" APT", ""));
    }
  };

  // 获取快速选择按钮
  const getQuickAmountButtons = () => {
    if (tradeType === "sell") {
      return (
        <>
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1 bg-muted/20 hover:bg-muted"
            onClick={() => handleQuickAmount("25%")}
          >
            25%
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1 bg-muted/20 hover:bg-muted"
            onClick={() => handleQuickAmount("50%")}
          >
            50%
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1 bg-muted/20 hover:bg-muted"
            onClick={() => handleQuickAmount("75%")}
          >
            75%
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1 bg-muted/20 hover:bg-muted"
            onClick={() => handleQuickAmount("100%")}
          >
            100%
          </Button>
        </>
      );
    }

    if (tradeType === "buy" && tokenType === "APT") {
      return (
        <>
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1 bg-muted/20 hover:bg-muted"
            onClick={() => handleQuickAmount("1 APT")}
          >
            1 APT
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1 bg-muted/20 hover:bg-muted"
            onClick={() => handleQuickAmount("5 APT")}
          >
            5 APT
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1 bg-muted/20 hover:bg-muted"
            onClick={() => handleQuickAmount("20 APT")}
          >
            20 APT
          </Button>
        </>
      );
    }

    return null;
  };

  // Reset 功能
  const handleReset = () => {
    setAmount("0.0");
  };

  const handleLoadMoreTrades = () => {
    setVisibleTrades(prev => Math.min(prev + 20, token.trades.length));
  };

  // 格式化时间
  const formatTime = (timestamp: string) => {
    const minutes = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000 / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column */}
        <div className="flex-1">
          {/* Token Info Card */}
          <Card className="mb-8 border-muted/40 dark:border-muted/20">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="w-16 h-16 overflow-hidden rounded-[10px] flex items-center justify-center bg-muted/50 dark:bg-muted/20">
                <img src={token.imageUrl} alt={token.name} className="w-full h-full" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">{token.name}</CardTitle>
                <p className="text-muted-foreground">{token.symbol}</p>
              </div>
              <div className="ml-auto">
                <p className="text-2xl font-bold">${token.price.toFixed(2)}</p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{token.description}</p>
            </CardContent>
          </Card>

          {/* Price Chart Card */}
          <Card className="mb-8 border-muted/40 dark:border-muted/20">
            <CardHeader>
              <CardTitle>Price Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] bg-muted/20 rounded-lg flex items-center justify-center">
                Chart Component
              </div>
            </CardContent>
          </Card>

          {/* Comments and Trades Section */}
          <Card className="border-muted/40 dark:border-muted/20">
            <CardHeader className="border-b border-muted/40 dark:border-muted/20">
              <div className="flex gap-4">
                <Button 
                  variant="ghost"
                  onClick={() => setActiveTab("comments")}
                  className={cn(
                    "px-4 -mb-[1px] rounded-none border-b-2",
                    "hover:bg-transparent hover:text-foreground",
                    "focus:bg-transparent",
                    activeTab === "comments" 
                      ? "border-foreground text-foreground" 
                      : "border-transparent text-muted-foreground"
                  )}
                >
                  Comments
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => setActiveTab("trades")}
                  className={cn(
                    "px-4 -mb-[1px] rounded-none border-b-2",
                    "hover:bg-transparent hover:text-foreground",
                    "focus:bg-transparent",
                    activeTab === "trades" 
                      ? "border-foreground text-foreground" 
                      : "border-transparent text-muted-foreground"
                  )}
                >
                  Trades
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {activeTab === "comments" ? (
                // Comments Content
                <div className="space-y-4">
                  <div className="mb-6">
                    <Textarea
                      placeholder="Write a comment..."
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      className="mb-2 rounded-[10px]"
                    />
                    <Button onClick={handleSubmitComment} className="rounded-[10px]">
                      Post Comment
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {token.comments.slice(0, visibleComments).map((comment) => (
                      <div key={comment.id} className="flex gap-4 p-4 rounded-[10px] bg-muted/20">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={comment.avatar} />
                          <AvatarFallback>{comment.user[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">{comment.user}</h4>
                            <span className="text-sm text-muted-foreground">
                              {new Date(comment.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                    
                    {visibleComments < token.comments.length && (
                      <div className="text-center pt-4">
                        <Button variant="outline" onClick={handleLoadMore} className="rounded-[10px]">
                          Load More
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // Trades Content
                <div className="space-y-4">
                  <div className="grid grid-cols-5 text-sm text-muted-foreground mb-2">
                    <span>Account</span>
                    <span>Type</span>
                    <span>APT</span>
                    <span>{token.symbol}</span>
                    <span>Time</span>
                  </div>
                  {token.trades.slice(0, visibleTrades).map((trade) => (
                    <div key={trade.id} className="grid grid-cols-5 text-sm items-center">
                      <span className="font-mono">{trade.account}</span>
                      <span className={trade.type === "buy" ? "text-[#2ecc71]" : "text-[#e74c3c]"}>
                        {trade.type}
                      </span>
                      <span>{trade.aptAmount.toFixed(3)}</span>
                      <span>{trade.tokenAmount.toFixed(2)}m</span>
                      <span className="text-muted-foreground">{formatTime(trade.timestamp)}</span>
                    </div>
                  ))}
                  
                  {visibleTrades < token.trades.length && (
                    <div className="text-center pt-4">
                      <Button 
                        variant="outline" 
                        onClick={handleLoadMoreTrades}
                        className="rounded-[10px]"
                      >
                        Load More
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:w-[400px] space-y-6">
          {/* Trade Card */}
          <Card className="border-muted/40 dark:border-muted/20">
            <CardContent className="pt-6">
              {/* Buy/Sell Tabs */}
              <div className="flex w-full mb-6">
                <Button 
                  variant="ghost"
                  className={cn(
                    "flex-1 rounded-none border-b-2 text-lg font-medium",
                    "hover:bg-transparent",
                    "focus:bg-transparent",
                    tradeType === "buy" 
                      ? "border-[#2ecc71] text-[#2ecc71] hover:text-[#2ecc71]" 
                      : "border-transparent hover:text-foreground"
                  )}
                  onClick={() => setTradeType("buy")}
                >
                  Buy
                </Button>
                <Button 
                  variant="ghost"
                  className={cn(
                    "flex-1 rounded-none border-b-2 text-lg font-medium",
                    "hover:bg-transparent",
                    "focus:bg-transparent",
                    tradeType === "sell" 
                      ? "border-[#e74c3c] text-[#e74c3c] hover:text-[#e74c3c]" 
                      : "border-transparent hover:text-foreground"
                  )}
                  onClick={() => setTradeType("sell")}
                >
                  Sell
                </Button>
              </div>

              <div className="space-y-4">
                {/* Top Controls */}
                <div className="flex justify-between items-center gap-2">
                  {tradeType === "buy" && (
                    <Button 
                      variant="outline" 
                      className="text-sm bg-muted/50 hover:bg-muted"
                      onClick={() => setTokenType(tokenType === "APT" ? (token.symbol as "APT" | "APT") : "APT")}
                    >
                      Switch to {tokenType === "APT" ? token.symbol : "APT"}
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    className={cn(
                      "text-sm bg-muted/50 hover:bg-muted",
                      tradeType === "buy" ? "ml-auto" : "ml-0"
                    )}
                    onClick={() => setIsSlippageDialogOpen(true)}
                  >
                    Set Max Slippage
                  </Button>
                </div>

                {/* Input Amount Field */}
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="0.0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pr-24 text-xl h-14 bg-muted/20"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {tradeType === "buy" ? (
                      <>
                        <span>{tokenType}</span>
                        {tokenType === "APT" ? (
                          <img 
                            src={theme === 'dark' ? '/aptos-dark.svg' : '/aptos.png'} 
                            alt="APT"
                            className="w-6 h-6"
                          />
                        ) : (
                          <img 
                            src={token.imageUrl} 
                            alt={token.symbol}
                            className="w-6 h-6"
                          />
                        )}
                      </>
                    ) : (
                      <>
                        <span>{token.symbol}</span>
                        <img 
                          src={token.imageUrl} 
                          alt={token.symbol}
                          className="w-6 h-6"
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* Quick Amount Buttons */}
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1 bg-muted/20 hover:bg-muted"
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                  {getQuickAmountButtons()}
                </div>

                {/* Place Trade Button */}
                <Button 
                  className={cn(
                    "w-full text-white",
                    tradeType === "buy" 
                      ? "bg-[#2ecc71] hover:bg-[#2ecc71]/90" 
                      : "bg-[#e74c3c] hover:bg-[#e74c3c]/90"
                  )}
                >
                  Place Trade
                </Button>

                {/* Add Comment Checkbox */}
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    className="rounded border-muted-foreground/50"
                  />
                  <span className="text-muted-foreground">Add Comment</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Token Info Card */}
          <Card className="border-muted/40 dark:border-muted/20">
            <CardContent className="pt-6 space-y-6">
              {/* Contract Address */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">ca:</span>
                  <div className="flex items-center gap-2 bg-muted/20 rounded px-2 py-1 flex-1">
                    <span className="text-sm font-mono">{token.creator}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 hover:bg-muted"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Token Image and Name */}
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 overflow-hidden rounded-lg">
                    <img 
                      src={token.imageUrl} 
                      alt={token.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{token.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {token.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">bonding curve progress: {token.bondingProgress}%</span>
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
                    graduate this coin to raydium at ${token.marketCap.toLocaleString()} market cap
                  </p>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">king of the hill progress: {token.kingProgress}%</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5 hover:bg-muted"
                    >
                      <span className="text-xs">ⓘ</span>
                    </Button>
                  </div>
                  <Progress 
                    value={token.kingProgress} 
                    className="h-2 bg-muted/20"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    dethrone the current king at ${token.dethroneCap.toLocaleString()} market cap
                  </p>
                </div>
              </div>

              {/* Holder Distribution */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">holder distribution</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    generate bubble map
                  </Button>
                </div>
                <div className="space-y-2">
                  {visibleHolders.map((holder, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <span>{index + 1}.</span>
                        <span className="font-mono">{holder.address}</span>
                        {holder.type && (
                          <span className="text-muted-foreground text-xs">
                            {holder.type}
                          </span>
                        )}
                      </div>
                      <span>{holder.percentage.toFixed(2)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Set Max Slippage Dialog */}
      <AlertDialog open={isSlippageDialogOpen} onOpenChange={setIsSlippageDialogOpen}>
        <AlertDialogContent className="bg-[#1a1b1e] border border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl mb-4">
              Set Max. Slippage (%)
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              {/* Slippage Input */}
              <div className="space-y-2">
                <Input
                  type="number"
                  value={slippage}
                  onChange={(e) => setSlippage(e.target.value)}
                  className="text-xl h-14 bg-[#141517] border-gray-800"
                />
                <p className="text-gray-400 text-sm">
                  this is the maximum amount of slippage you are willing to accept when placing trades
                </p>
              </div>

              {/* Front-running Protection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>enable front-running protection:</span>
                  <Button
                    variant="outline"
                    onClick={() => setEnableFrontRunning(!enableFrontRunning)}
                    className={cn(
                      "px-3 py-1",
                      enableFrontRunning ? "bg-[#2ecc71] text-white" : "bg-transparent"
                    )}
                  >
                    {enableFrontRunning ? "On" : "Off"}
                  </Button>
                </div>
                <p className="text-[#2ecc71] text-sm">
                  front-running protection stops bots from front-running your buys. You can use high slippage with front-running protection turned on. We recommend setting a priority fee of at least 0.01 APT with front-running protection enabled.
                </p>
              </div>

              {/* Priority Fee */}
              <div className="space-y-2">
                <span>priority fee</span>
                <div className="relative">
                  <Input
                    type="number"
                    value={priorityFee}
                    onChange={(e) => setPriorityFee(e.target.value)}
                    className="text-xl h-14 bg-[#141517] border-gray-800 pr-16"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <span>APT</span>
                    <img 
                      src={theme === 'dark' ? '/aptos-dark.svg' : '/aptos.png'} 
                      alt="APT"
                      className="w-6 h-6"
                    />
                  </div>
                </div>
                <p className="text-gray-400 text-sm">
                  a higher priority fee will make your transactions confirm faster. This is the transaction fee that you pay to the aptos network on each trade.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => setIsSlippageDialogOpen(false)}
              className="w-full bg-transparent border-gray-800 hover:bg-gray-800"
            >
              [close]
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TokenPage;
