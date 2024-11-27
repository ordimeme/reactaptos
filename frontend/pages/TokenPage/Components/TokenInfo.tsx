import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MarketItem } from "@/data/marketData";
import { Copy, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { FaDiscord, FaTelegram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { truncateAddress, getFullAddress } from "@/utils/truncateAddress";

interface TokenInfoProps {
  token: MarketItem;
}

export function TokenInfo({ token }: TokenInfoProps) {
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleHolders = token.holders.slice(0, 20);

  // 处理复制地址
  const handleCopyCA = async (address: string) => {
    try {
      await navigator.clipboard.writeText(getFullAddress(address));
      toast({
        title: "Success",
        description: "Address has been copied to clipboard",
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

  return (
    <Card className="border-muted/40 dark:border-muted/20">
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-4">
          {/* Creator Address */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Creator</h3>
            <div className="flex items-center gap-2 bg-muted/20 rounded px-2 py-1">
              <span className="text-sm font-mono">{truncateAddress(token.creator)}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 hover:bg-muted"
                onClick={() => handleCopyCA(token.creator)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* About */}
          <div>
            <h3 className="text-sm font-semibold mb-2">About</h3>
            <div className="relative">
              <p className={`text-sm text-muted-foreground ${!isExpanded ? "line-clamp-4" : ""}`}>
                {token.description}
              </p>
              {token.description && token.description.length > 240 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-xs px-2 py-1 h-6 absolute -bottom-6 left-0"
                >
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 mr-1" />
                  ) : (
                    <ChevronDown className="h-4 w-4 mr-1" />
                  )}
                  {isExpanded ? "Show Less" : "Show More"}
                </Button>
              )}
            </div>
          </div>

          {/* Social Media */}
          {(token.twitter || token.discord || token.telegram) && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Social Media</h3>
              <div className="flex gap-4">
                {token.twitter && (
                  <a 
                    href={token.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <FaXTwitter className="h-5 w-5" />
                  </a>
                )}
                {token.discord && (
                  <a 
                    href={token.discord} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <FaDiscord className="h-5 w-5" />
                  </a>
                )}
                {token.telegram && (
                  <a 
                    href={token.telegram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <FaTelegram className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Progress Bars */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Bonding Curve Progress: {token.bondingProgress}%
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
              Graduate This Coin To Raydium At ${token.marketCap.toLocaleString()} Market Cap
            </p>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                King Of The Hill Progress: {token.kingProgress}%
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
              Dethrone The Current King At ${token.dethroneCap.toLocaleString()} Market Cap
            </p>
          </div>
        </div>

        {/* Holder Distribution */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Holder Distribution</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              Generate Bubble Map
            </Button>
          </div>
          <div className="space-y-2">
            {visibleHolders.map((holder, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span>{index + 1}.</span>
                  <span className="font-mono">{truncateAddress(holder.address)}</span>
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