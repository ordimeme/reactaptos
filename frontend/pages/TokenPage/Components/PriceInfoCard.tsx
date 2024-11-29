import { Card, CardContent } from "@/components/ui/card";
import { MarketItem } from "@/types/market";
import { usePriceContext } from "@/context/PriceContext";
import { calculatePriceChangeByInterval } from "@/utils/calculations";

interface PriceInfoCardProps {
  token: MarketItem;
}

export function PriceInfoCard({ token }: PriceInfoCardProps) {
  const { tokenPrices } = usePriceContext();

  // 使用当前价格或默认值
  const currentPrice = tokenPrices[token.id] || {
    change24h: '0.00',
    close: token.currentPrice.toFixed(2)
  };

  // 计算不同时间段的价格变化
  const priceChanges = {
    "5m": calculatePriceChangeByInterval("5m", token.currentPrice),
    "15m": calculatePriceChangeByInterval("15m", token.currentPrice),
    "1h": calculatePriceChangeByInterval("1h", token.currentPrice),
    "4h": calculatePriceChangeByInterval("4h", token.currentPrice),
    "1d": parseFloat(currentPrice.change24h),
    "1w": calculatePriceChangeByInterval("1w", token.currentPrice),
  };

  return (
    <Card className="border-muted/40 dark:border-muted/20">
      <CardContent className="p-4">
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(priceChanges).map(([interval, change]) => (
            <div key={interval} className="space-y-1">
              <p className="text-xs text-muted-foreground">{interval}</p>
              <p className={`text-sm font-medium ${
                change >= 0 ? "text-green-500" : "text-red-500"
              }`}>
                {change >= 0 ? "+" : ""}
                {change.toFixed(2)}%
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 