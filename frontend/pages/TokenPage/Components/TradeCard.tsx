import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { MarketItem } from "@/data/marketData";

interface TradeCardProps {
  token: MarketItem;
  tradeType: "buy" | "sell";
  tokenType: "APT" | "APT";
  amount: string;
  setTradeType: (type: "buy" | "sell") => void;
  setTokenType: (type: "APT" | "APT") => void;
  setAmount: (amount: string) => void;
  handleQuickAmount: (amount: string) => void;
  handleReset: () => void;
  setIsSlippageDialogOpen: (open: boolean) => void;
}

export function TradeCard({
  token,
  tradeType,
  tokenType,
  amount,
  setTradeType,
  setTokenType,
  setAmount,
  handleQuickAmount,
  handleReset,
  setIsSlippageDialogOpen
}: TradeCardProps) {
  const { theme } = useContext(ThemeContext);

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
            {tradeType === "sell" ? (
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
            ) : tokenType === "APT" && (
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
            )}
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
  );
} 