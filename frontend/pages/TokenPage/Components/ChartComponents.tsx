import { Button } from "@/components/ui/button";
import { PriceData } from "@/types/market";
import { formatUSDPrice, formatAPTPrice } from "@/utils/format";
import { useMemo } from "react";

interface PriceDisplayProps {
  price: PriceData;
  className?: string;
  showUSD?: boolean;
  hoveredPrice?: {
    open: number;
    high: number;
    low: number;
    close: number;
    changePercent: number;
  } | null;
  latestCandle?: {
    open: number;
    high: number;
    low: number;
    close: number;
  } | null;
}

// 价格显示组件
export const PriceDisplay = ({ 
  price, 
  className,
  showUSD = true,
  hoveredPrice = null,
  latestCandle = null
}: PriceDisplayProps) => {
  // 使用悬停价格、最新K线或当前价格，并确保格式化一致
  const displayData = useMemo(() => {
    // 如果有悬停数据，优先使用悬停的K线数据
    if (hoveredPrice) {
      const candleData = {
        open: hoveredPrice.open,
        high: hoveredPrice.high,
        low: hoveredPrice.low,
        close: hoveredPrice.close,
        changePercent: hoveredPrice.changePercent
      };

      console.log('Using hover candle data:', candleData);
      return candleData;
    }
    
    // 如果有最新K线数据，使用最新K线数据
    if (latestCandle) {
      const candleData = {
        open: latestCandle.open,
        high: latestCandle.high,
        low: latestCandle.low,
        close: latestCandle.close,
        changePercent: ((latestCandle.close - latestCandle.open) / latestCandle.open) * 100
      };

      console.log('Using latest candle data:', candleData);
      return candleData;
    }
    
    // 否则使用当前价格数据
    const currentData = {
      open: Number(price.open),
      high: Number(price.high),
      low: Number(price.low),
      close: Number(price.close),
      changePercent: parseFloat(price.changePercent)
    };

    console.log('Using current price data:', currentData);
    return currentData;
  }, [hoveredPrice, latestCandle, price]);


  return (
    <div className={`flex flex-col ${className}`}>
      {/* OHLC 数据 */}
      <div className="grid grid-cols-4 text-[10px] sm:text-xs text-muted-foreground">
        <div className="flex flex-col min-w-0">
          <span>Open</span>
          <span className="font-mono truncate">
            {showUSD ? formatUSDPrice(displayData.open) : formatAPTPrice(displayData.open)}
          </span>
        </div>
        <div className="flex flex-col min-w-0">
          <span>High</span>
          <span className="font-mono truncate text-green-500">
            {showUSD ? formatUSDPrice(displayData.high) : formatAPTPrice(displayData.high)}
          </span>
        </div>
        <div className="flex flex-col min-w-0">
          <span>Low</span>
          <span className="font-mono truncate text-red-500">
            {showUSD ? formatUSDPrice(displayData.low) : formatAPTPrice(displayData.low)}
          </span>
        </div>
        <div className="flex flex-col min-w-0">
          <span>Close</span>
          <div className="flex items-center gap-1">
            <span className={`font-mono truncate ${
              displayData.close >= displayData.open ? 'text-green-500' : 'text-red-500'
            }`}>
              {showUSD ? formatUSDPrice(displayData.close) : formatAPTPrice(displayData.close)}
            </span>
            {hoveredPrice && (
              <span className={`text-xs ${
                displayData.changePercent >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                ({displayData.changePercent >= 0 ? '+' : ''}
                {displayData.changePercent.toFixed(2)}%)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// 时间间隔选择器
export const IntervalSelector = ({ 
  selectedInterval, 
  onIntervalChange 
}: { 
  selectedInterval: string; 
  onIntervalChange: (interval: string) => void;
}) => {
  const intervals = useMemo(() => [
    { value: '5s', label: '5S' },
    { value: '30s', label: '30S' },
    { value: '5m', label: '5M' },
    { value: '15m', label: '15M' },
    { value: '1h', label: '1H' },
    { value: '4h', label: '4H' },
    { value: '1d', label: '1D' },
    { value: '1w', label: '1W' },
    { value: '1mo', label: '1M' },
  ], []);

  return (
    <div className="flex flex-wrap gap-1">
      {intervals.map(({ value, label }) => (
        <Button
          key={value}
          variant={selectedInterval === value ? "default" : "outline"}
          size="sm"
          onClick={() => onIntervalChange(value)}
          className="text-xs"
        >
          {label}
        </Button>
      ))}
    </div>
  );
};

// 加载视图
export const LoadingView = () => (
  <div className="h-[500px] flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

// 时间显示组件
export const TimeDisplay = ({ time }: { time: string }) => (
  <div className="p-4 text-xs text-muted-foreground">
    Last updated: {time}
  </div>
); 