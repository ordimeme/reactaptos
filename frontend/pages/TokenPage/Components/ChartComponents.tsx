import { Button } from "@/components/ui/button";
import { PriceData } from "@/types/market";

interface PriceDisplayProps {
  price: PriceData;
  className?: string;
}

// 价格显示组件
export const PriceDisplay = ({ price, className }: PriceDisplayProps) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    {/* OHLC 数据 */}
    <div className="grid grid-cols-4 text-[10px] sm:text-xs text-muted-foreground">
      <div className="flex flex-col min-w-0">
        <span>Open: <span className="font-mono truncate">{price.open}</span></span>
      </div>
      <div className="flex flex-col min-w-0">
        <span>High: <span className="font-mono truncate">{price.high}</span></span>
      </div>
      <div className="flex flex-col min-w-0">
        <span>Low: <span className="font-mono truncate">{price.low}</span></span>
      </div>
      <div className="flex items-center gap-1 min-w-0">
        <span>Close: <span className="font-mono truncate">{price.close}</span></span>
        <span className={`${
          parseFloat(price.changePercent) >= 0 ? "text-green-500" : "text-red-500"
        }`}>
          {parseFloat(price.changePercent) >= 0 ? "+" : ""}
          {price.changePercent}%
        </span>
      </div>
    </div>
  </div>
);

// 时间间隔选择器组件
export const IntervalSelector = ({ 
  selectedInterval, 
  onIntervalChange 
}: { 
  selectedInterval: string;
  onIntervalChange: (interval: string) => void;
}) => {
  const intervals = [
    { value: "5s", label: "5S" },
    { value: "30s", label: "30S" },
    { value: "5m", label: "5M" },
    { value: "15m", label: "15M" },
    { value: "1h", label: "1H" },
    { value: "4h", label: "4H" },
    { value: "1d", label: "1D" },
    { value: "1w", label: "1W" },
    { value: "1mo", label: "1M" },
    { value: "1y", label: "1Y" },
  ];

  return (
    <div className="flex justify-start">
      <div className="flex flex-wrap gap-0.5 sm:gap-1">
        {intervals.map(({ value, label }) => (
          <Button
            key={value}
            variant={selectedInterval === value ? "default" : "ghost"}
            size="sm"
            className={`
              h-5 sm:h-7 
              px-1 sm:px-3
              text-[9px] sm:text-xs 
              font-mono font-medium
              transition-colors
              min-w-[28px] sm:min-w-[36px]
              ${selectedInterval === value 
                ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                : 'hover:bg-muted/50'
              }
            `}
            onClick={() => onIntervalChange(value)}
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
};

// 加载视图组件
export const LoadingView = () => (
  <div className="flex items-center justify-center h-[300px] sm:h-[600px]">
    <div className="animate-pulse-subtle">loading...</div>
  </div>
);

interface TimeDisplayProps {
  time: string;
  className?: string;
}

// 时间显示组件
export const TimeDisplay = ({ time, className }: TimeDisplayProps) => (
  <div className={`text-[10px] sm:text-sm text-muted-foreground py-2 px-4 text-center border-t border-muted/10 ${className}`}>
    {time.replace(' (UTC+8)', '')} (UTC+8)
  </div>
); 