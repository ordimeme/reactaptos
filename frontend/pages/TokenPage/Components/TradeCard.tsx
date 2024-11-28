import { useContext, useCallback } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { MarketItem } from "@/data/marketData";
import { formatTokenAmount } from "@/utils/clampNumber";

interface TradeCardProps {
  token: MarketItem;
  tradeType: "buy" | "sell";
  tokenType: "APT" | "APT";
  amount: string;
  setTradeType: (type: "buy" | "sell") => void;
  setTokenType: (type: "APT" | "APT") => void;
  setAmount: (amount: string) => void;
  handleReset: () => void;
  setIsSlippageDialogOpen: (open: boolean) => void;
  isWalletConnected?: boolean;
  onConnectWallet?: () => void;
  aptBalance?: number;
  tokenBalance?: number;
}

export function TradeCard({
  token,
  tradeType,
  tokenType,
  amount,
  setTradeType,
  setTokenType,
  setAmount,
  handleReset,
  setIsSlippageDialogOpen,
  isWalletConnected = false,
  onConnectWallet,
  aptBalance = 0,
  tokenBalance = 0
}: TradeCardProps) {
  const { theme } = useContext(ThemeContext);

  const handleQuickSelect = useCallback((value: string) => {
    if (!isWalletConnected) {
      onConnectWallet?.();
      return;
    }

    if (tradeType === "sell") {
      const percentage = parseFloat(value.replace("%", "")) / 100;
      const balance = tokenBalance;
      const calculatedAmount = (balance * percentage).toFixed(8);
      setAmount(calculatedAmount);
    } else if (tradeType === "buy" && tokenType === "APT") {
      const aptAmount = parseFloat(value.replace(" APT", ""));
      if (aptAmount <= aptBalance) {
        setAmount(aptAmount.toString());
      } else {
        console.warn("Insufficient APT balance");
      }
    }
  }, [isWalletConnected, tradeType, tokenType, aptBalance, tokenBalance, onConnectWallet, setAmount]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setAmount("");
      return;
    }

    try {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) return;

      if (tradeType === "sell") {
        if (numValue > tokenBalance) {
          setAmount(tokenBalance.toString());
        } else {
          setAmount(value);
        }
      } else {
        if (tokenType === "APT" && numValue > aptBalance) {
          setAmount(aptBalance.toString());
        } else {
          setAmount(value);
        }
      }
    } catch (error) {
      console.error("Invalid input:", error);
    }
  }, [tradeType, tokenType, aptBalance, tokenBalance, setAmount]);

  return (
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
                onClick={() => setTokenType(tokenType === "APT" ? token.symbol as "APT" : "APT")}
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
              placeholder=""
              value={amount}
              onChange={handleInputChange}
              className="pr-24 text-xl h-14 bg-muted/20"
              disabled={!isWalletConnected}
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
              disabled={!isWalletConnected}
            >
              Reset
            </Button>
            {tradeType === "sell" ? (
              <>
                {[25, 50, 75, 100].map((percent) => (
                  <Button 
                    key={percent}
                    variant="outline" 
                    size="sm"
                    className="flex-1 bg-muted/20 hover:bg-muted"
                    onClick={() => handleQuickSelect(`${percent}%`)}
                    disabled={!isWalletConnected}
                  >
                    {percent}%
                  </Button>
                ))}
              </>
            ) : tokenType === "APT" && (
              <>
                {[1, 5, 20].map((aptAmount) => (
                  <Button 
                    key={aptAmount}
                    variant="outline" 
                    size="sm"
                    className="flex-1 bg-muted/20 hover:bg-muted"
                    onClick={() => handleQuickSelect(`${aptAmount} APT`)}
                    disabled={!isWalletConnected || aptAmount > aptBalance}
                  >
                    {aptAmount} APT
                  </Button>
                ))}
              </>
            )}
          </div>

          {/* Place Trade Button */}
          <Button 
            className={cn(
              "w-full text-white",
              !isWalletConnected 
                ? "bg-blue-500 hover:bg-blue-600"
                : tradeType === "buy" 
                  ? "bg-[#2ecc71] hover:bg-[#2ecc71]/90" 
                  : "bg-[#e74c3c] hover:bg-[#e74c3c]/90"
            )}
            onClick={!isWalletConnected ? onConnectWallet : undefined}
            disabled={isWalletConnected && amount === ""}
          >
            {!isWalletConnected ? "Connect Wallet" : "Place Trade"}
          </Button>

          {/* Add Comment Checkbox and Balances */}
          <div className="flex items-center justify-between">
            {isWalletConnected && (
              <div className="text-left text-xs text-muted-foreground">
                <div>APT: {formatTokenAmount(aptBalance)}</div>
                <div>{token.symbol}: {formatTokenAmount(tokenBalance)}</div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                className="rounded border-muted-foreground/50"
              />
              <span className="text-muted-foreground">Add Comment</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 