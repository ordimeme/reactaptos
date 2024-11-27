import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Copy } from "lucide-react";
import { MarketItem } from "@/data/marketData";

interface TokenInfoProps {
  token: MarketItem;
}

export function TokenInfo({ token }: TokenInfoProps) {
  const visibleHolders = token.holders.slice(0, 20);

  return (
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
        </div>

        {/* Progress Bars */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                bonding curve progress: {token.bondingProgress}%
              </span>
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
              <span className="text-sm text-muted-foreground">
                king of the hill progress: {token.kingProgress}%
              </span>
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
  );
} 