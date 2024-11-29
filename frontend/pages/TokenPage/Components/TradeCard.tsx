import { useCallback, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { MarketItem, PriceData } from "@/types/market";
import { formatTokenAmount } from "@/utils/clampNumber";
import { usePriceContext } from "@/context/PriceContext";
import { useWalletConnect } from "@/hooks/useWalletConnect";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ConnectWalletDialog } from "@/components/WalletSelector";

interface TradeCardProps {
  token: MarketItem & { imageUrl: string };
  currentPrice: PriceData;
  tradeType: "buy" | "sell";
  amount: string;
  setTradeType: (type: "buy" | "sell") => void;
  setAmount: (amount: string) => void;
  aptBalance?: number;
  tokenBalance?: number;
}

export function TradeCard({
  token,
  currentPrice,
  tradeType,
  amount,
  setTradeType,
  setAmount,
  aptBalance = 0,
  tokenBalance = 0,
}: TradeCardProps) {
  const { priceSimulator } = usePriceContext();
  const { connected } = useWalletConnect();
  const [maxSlippage, setMaxSlippage] = useState<number>(2);
  const [showSlippageSettings, setShowSlippageSettings] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 计算最大可交易数量
  const maxAmount = useMemo(() => {
    if (!priceSimulator) return 0;
    const poolState = priceSimulator.getPoolState();
    
    if (tradeType === "buy") {
      return Math.min(
        aptBalance / parseFloat(currentPrice.close),
        poolState.tokenReserve
      );
    } else {
      return Math.min(tokenBalance, poolState.tokenReserve);
    }
  }, [tradeType, aptBalance, tokenBalance, currentPrice, priceSimulator]);

  // 计算交易影响
  const { priceImpact, estimatedPrice } = useMemo(() => {
    if (!amount || !priceSimulator) {
      return { priceImpact: 0, estimatedPrice: parseFloat(currentPrice.close) };
    }
    
    const tradeAmount = parseFloat(amount);
    const calculation = tradeType === "buy" 
      ? priceSimulator.calculateBuyPrice(tradeAmount)
      : priceSimulator.calculateSellPrice(tradeAmount);
      
    return {
      priceImpact: calculation.slippage * 100,
      estimatedPrice: calculation.price
    };
  }, [amount, tradeType, priceSimulator, currentPrice]);

  // 处理快捷金额选择
  const handlePercentageClick = useCallback((percentage: number) => {
    const newAmount = (maxAmount * percentage / 100).toFixed(6);
    setAmount(newAmount);
  }, [maxAmount, setAmount]);

  const handleTrade = useCallback(async () => {
    if (!connected || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > maxAmount) {
      return;
    }
    // TODO: 实现交易逻辑
  }, [connected, amount, maxAmount]);

  return (
    <Card className="border-muted/40 dark:border-muted/20">
      <CardContent className="p-4 space-y-4">
        {/* 交易类型选择器 */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-muted/20 rounded-lg">
          {["buy", "sell"].map((type) => (
            <Button
              key={type}
              variant={tradeType === type ? "default" : "ghost"}
              onClick={() => setTradeType(type as "buy" | "sell")}
              className={cn(
                "w-full capitalize font-medium transition-colors",
                type === "buy" 
                  ? tradeType === type 
                    ? "bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-500" 
                    : "text-green-500/70 hover:bg-green-500/10 hover:text-green-500"
                  : tradeType === type 
                    ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-500" 
                    : "text-red-500/70 hover:bg-red-500/10 hover:text-red-500"
              )}
            >
              {type}
            </Button>
          ))}
        </div>

        {/* 金额输入区域 */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Amount</span>
            <span className="text-muted-foreground">
              Balance: {formatTokenAmount(tradeType === "buy" ? aptBalance : tokenBalance)}
            </span>
          </div>
          <div className="relative">
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full pl-10 pr-20" // 增加左右内边距以适应图标和符号
            />
            {/* Token 图标 */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4">
              <img 
                src={token.imageUrl}
                alt={token.symbol}
                className="w-full h-full rounded-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/tokens/default.svg';
                }}
              />
            </div>
            {/* Token 符号 */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <span className="text-sm text-muted-foreground">
                {token.symbol}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {[25, 50, 75].map((percent) => (
              <Button
                key={percent}
                variant="outline"
                size="sm"
                onClick={() => handlePercentageClick(percent)}
                className={cn(
                  "w-full text-xs font-medium",
                  tradeType === "buy" 
                    ? "hover:border-green-500/20 hover:text-green-500" 
                    : "hover:border-red-500/20 hover:text-red-500"
                )}
              >
                {percent}%
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePercentageClick(100)}
              className={cn(
                "w-full text-xs font-medium",
                tradeType === "buy" 
                  ? "hover:border-green-500/20 hover:text-green-500" 
                  : "hover:border-red-500/20 hover:text-red-500"
              )}
            >
              MAX
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAmount("")}
              className="w-full text-xs font-medium hover:bg-muted/50"
            >
              Reset
            </Button>
          </div>
        </div>

        {/* 交易信息 */}
        {amount && (
          <div className="rounded-lg border border-border/50 divide-y divide-border/50">
            <div className="px-3 py-2 flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Estimated Price</span>
              <span className="text-sm font-medium">${estimatedPrice.toFixed(6)}</span>
            </div>

            <div className="px-3 py-2 flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Price Impact</span>
              <span className={cn(
                "text-sm font-medium",
                priceImpact > maxSlippage ? "text-red-500" : ""
              )}>
                {priceImpact.toFixed(2)}%
              </span>
            </div>

            <div className="px-3 py-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Max Slippage</span>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-sm font-medium",
                    priceImpact > maxSlippage ? "text-red-500" : ""
                  )}>
                    {maxSlippage}%
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSlippageSettings(!showSlippageSettings)}
                    className="h-6 px-2 text-xs hover:bg-muted/50"
                  >
                    Edit
                  </Button>
                </div>
              </div>

              {/* 滑点设置面板 */}
              {showSlippageSettings && (
                <div className="mt-3 space-y-3">
                  <div className="grid grid-cols-4 gap-1.5">
                    {[0.5, 1, 2, 5].map((value) => (
                      <Button
                        key={value}
                        variant={maxSlippage === value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setMaxSlippage(value)}
                        className="w-full text-xs font-medium"
                      >
                        {value}%
                      </Button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={maxSlippage}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (!isNaN(value) && value >= 0 && value <= 100) {
                          setMaxSlippage(value);
                        }
                      }}
                      className="h-8 text-sm"
                      placeholder="Custom"
                    />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>

                  {(maxSlippage > 5 || priceImpact > maxSlippage) && (
                    <div className="text-xs space-y-1">
                      {maxSlippage > 5 && (
                        <p className="text-yellow-500">High slippage increases risk</p>
                      )}
                      {priceImpact > maxSlippage && (
                        <p className="text-red-500">Price impact exceeds slippage tolerance</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 交易按钮 */}
        {connected ? (
          <Button 
            className={cn(
              "w-full font-medium transition-colors",
              tradeType === "buy"
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-red-500 hover:bg-red-600 text-white",
              (priceImpact > maxSlippage || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > maxAmount) &&
                "opacity-50 cursor-not-allowed"
            )}
            onClick={handleTrade}
            disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > maxAmount || priceImpact > maxSlippage}
          >
            {priceImpact > maxSlippage 
              ? "Price Impact Too High"
              : `${tradeType === "buy" ? "Buy" : "Sell"} ${token.symbol}`
            }
          </Button>
        ) : (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full font-medium">Connect Wallet</Button>
            </DialogTrigger>
            <ConnectWalletDialog close={() => setIsDialogOpen(false)} />
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
} 