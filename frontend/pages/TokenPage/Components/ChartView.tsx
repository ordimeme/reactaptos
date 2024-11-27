import { useEffect, useContext, useState, useRef, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MarketItem } from "@/types/market";
import { ThemeContext } from "@/context/ThemeContext";
import { getPriceData } from "@/data/priceData";
import { createChart, UTCTimestamp } from 'lightweight-charts';

interface ChartViewProps {
  token: MarketItem;
}

// 定义时间间隔选项的类型
interface IntervalOption {
  value: string;
  label: string;
}

export function ChartView({ token }: ChartViewProps) {
  const { theme } = useContext(ThemeContext);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [interval, setInterval] = useState("1h");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const getTimeStepAndCount = useCallback((intervalValue: string) => {
    switch (intervalValue) {
      case "5m":
        return { timeStep: 5 * 60, count: 200 }; // 5分钟，200个数据点
      case "15m":
        return { timeStep: 15 * 60, count: 200 }; // 15分钟
      case "1h":
        return { timeStep: 60 * 60, count: 200 }; // 1小时
      case "4h":
        return { timeStep: 4 * 60 * 60, count: 200 }; // 4小时
      case "1d":
        return { timeStep: 24 * 60 * 60, count: 200 }; // 1天
      case "1w":
        return { timeStep: 7 * 24 * 60 * 60, count: 200 }; // 1周
      default:
        return { timeStep: 60 * 60, count: 200 }; // 默认1小时
    }
  }, []);

  // 现在可以安全地使用 getTimeStepAndCount
  const chartData = useMemo(() => {
    const { timeStep, count } = getTimeStepAndCount(interval);
    return getPriceData(token.symbol, token.price, timeStep, count);
  }, [token.symbol, token.price, interval, getTimeStepAndCount]);

  // 定义时间间隔选项
  const intervals: IntervalOption[] = useMemo(() => [
    { value: "5m", label: "5m" },
    { value: "15m", label: "15m" },
    { value: "1h", label: "1h" },
    { value: "4h", label: "4h" },
    { value: "1d", label: "1D" },
    { value: "1w", label: "1W" },
  ], []);

  const chartOptions = useMemo(() => ({
    layout: {
      background: { color: theme === 'dark' ? '#1a1b1e' : '#ffffff' },
      textColor: theme === 'dark' ? '#d1d4dc' : '#000000',
    },
    grid: {
      vertLines: { color: theme === 'dark' ? '#2B2B43' : '#e1e3eb' },
      horzLines: { color: theme === 'dark' ? '#2B2B43' : '#e1e3eb' },
    },
    timeScale: {
      timeVisible: true,
      secondsVisible: false,
      fixLeftEdge: true,
      fixRightEdge: true,
    },
    crosshair: {
      mode: 1,
    },
    handleScale: {
      axisPressedMouseMove: true,
    },
    handleScroll: {
      mouseWheel: true,
      pressedMouseMove: true,
    },
  }), [theme]);

  const initChart = useCallback(() => {
    if (!chartContainerRef.current) return;

    try {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }

      const width = chartContainerRef.current.clientWidth;
      const containerHeight = isMobile ? 300 : 600;

      const chart = createChart(chartContainerRef.current, {
        ...chartOptions,
        width,
        height: containerHeight,
      });

      chartRef.current = chart;

      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderUpColor: '#26a69a',
        borderDownColor: '#ef5350',
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
      });

      candlestickSeries.setData(chartData.map(item => ({
        ...item,
        time: item.time as UTCTimestamp,
      })));

      resizeObserverRef.current = new ResizeObserver(entries => {
        if (entries[0] && chartRef.current) {
          const { width } = entries[0].contentRect;
          const height = isMobile ? 300 : 600;
          chartRef.current.applyOptions({
            width,
            height,
          });
          chartRef.current.timeScale().fitContent();
        }
      });

      resizeObserverRef.current.observe(chartContainerRef.current);

      setIsLoading(false);

      return () => {
        if (resizeObserverRef.current) {
          resizeObserverRef.current.disconnect();
        }
        if (chartRef.current) {
          chartRef.current.remove();
          chartRef.current = null;
        }
      };
    } catch (err) {
      console.error('Chart initialization error:', err);
      setError('Failed to initialize chart');
      setIsLoading(false);
    }
  }, [chartOptions, isMobile, chartData]);

  useEffect(() => {
    const cleanup = initChart();
    return () => cleanup?.();
  }, [initChart]);

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 640;
      if (newIsMobile !== isMobile) {
        setIsMobile(newIsMobile);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  // 处理时间间隔变化
  const handleIntervalChange = useCallback((newInterval: string) => {
    setIsLoading(true);
    setInterval(newInterval);
  }, []);

  // 监听主题变化并更新图表
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.applyOptions({
        layout: {
          background: { color: theme === 'dark' ? '#1a1b1e' : '#ffffff' },
          textColor: theme === 'dark' ? '#d1d4dc' : '#000000',
        },
        grid: {
          vertLines: { color: theme === 'dark' ? '#2B2B43' : '#e1e3eb' },
          horzLines: { color: theme === 'dark' ? '#2B2B43' : '#e1e3eb' },
        },
      });
    }
  }, [theme]);

  return (
    <Card className="border-muted/40 dark:border-muted/20 w-full">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-base">Trading</CardTitle>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            <div className="grid grid-cols-3 sm:flex gap-1 w-full sm:w-auto">
              {intervals.map((item: IntervalOption) => (
                <Button
                  key={item.value}
                  variant={interval === item.value ? "default" : "ghost"}
                  size="sm"
                  className="h-7 px-2 text-xs font-mono"
                  onClick={() => handleIntervalChange(item.value)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
            <div className="text-sm text-muted-foreground font-mono w-full sm:w-auto text-center sm:text-right">
              ${token.price.toFixed(2)}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 sm:p-6">
        {isLoading && (
          <div className="flex items-center justify-center h-[300px] sm:h-[600px]">
            <div className="animate-pulse-subtle">加载中...</div>
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center h-[300px] sm:h-[600px] text-red-500">
            {error}
          </div>
        )}
        <div 
          ref={chartContainerRef}
          className="tradingview-chart-container"
          style={{ 
            display: isLoading || error ? 'none' : 'block',
          }}
        />
      </CardContent>
    </Card>
  );
} 