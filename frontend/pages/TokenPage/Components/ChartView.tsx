import { useEffect, useContext, useState, useRef, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MarketItem } from "@/data/marketData";
import { ThemeContext } from "@/context/ThemeContext";
import { getPriceData } from "@/data/priceData";
import { createChart, UTCTimestamp } from 'lightweight-charts';

interface ChartViewProps {
  token: MarketItem;
  onPriceUpdate?: (price: PriceData) => void;
  onHoverPriceChange?: (price: PriceData) => void;
  initialPrice?: PriceData;
}

// 定义时间间隔选项的类型
interface IntervalOption {
  value: string;
  label: string;
}

// 在 interface 部分添加新的数据类型
export interface PriceData {
  open: string;
  high: string;
  low: string;
  close: string;
  time: string;
  price24h: string;  // 24小时前的价格
  time24h: string;   // 24小时前的时间
  change24h: string; // 24小时涨跌幅
  changePercent: string;  // 添加单根K线涨跌幅
}

export function ChartView({ token, onPriceUpdate, onHoverPriceChange, initialPrice }: ChartViewProps) {
  const { theme } = useContext(ThemeContext);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [selectedInterval, setSelectedInterval] = useState("1h");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shouldAutoUpdate] = useState(true);
  const isHoveringRef = useRef(false);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const candlestickSeriesRef = useRef<any>(null);
  const [latestPrice] = useState<PriceData>(initialPrice || {
    open: token.price.toFixed(2),
    high: token.price.toFixed(2),
    low: token.price.toFixed(2),
    close: token.price.toFixed(2),
    time: new Date().toLocaleString('en-US', { 
      timeZone: 'Asia/Shanghai',
      hour12: false 
    }),
    price24h: token.price.toFixed(2),
    time24h: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString('en-US', {
      timeZone: 'Asia/Shanghai',
      hour12: false
    }),
    change24h: '0.00',
    changePercent: '0.00'
  });
  const [currentViewPrice, setCurrentViewPrice] = useState<PriceData>(initialPrice || {
    open: token.price.toFixed(2),
    high: token.price.toFixed(2),
    low: token.price.toFixed(2),
    close: token.price.toFixed(2),
    time: new Date().toLocaleString('en-US', { 
      timeZone: 'Asia/Shanghai',
      hour12: false 
    }),
    price24h: token.price.toFixed(2),
    time24h: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString('en-US', {
      timeZone: 'Asia/Shanghai',
      hour12: false
    }),
    change24h: '0.00',
    changePercent: '0.00'
  });

  const getTimeStepAndCount = useCallback((intervalValue: string) => {
    switch (intervalValue) {
      case "5s":
        return { timeStep: 5, count: 200 }; // 5秒
      case "30s":
        return { timeStep: 30, count: 200 }; // 30秒
      case "5m":
        return { timeStep: 5 * 60, count: 200 }; // 5分钟
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
      case "1mo":
        return { timeStep: 30 * 24 * 60 * 60, count: 200 }; // 1月
      case "1y":
        return { timeStep: 365 * 24 * 60 * 60, count: 200 }; // 1年
      default:
        return { timeStep: 60 * 60, count: 200 }; // 默认1小时
    }
  }, []);

  // 修改更新间隔为5秒
  const UPDATE_INTERVAL = 5000; // 5秒更新一次

  // 1. 先定义 chartData
  const chartData = useMemo(() => {
    const { timeStep, count } = getTimeStepAndCount(selectedInterval);
    return getPriceData(token.symbol, token.price, timeStep, count);
  }, [token.symbol, token.price, selectedInterval, getTimeStepAndCount]);

  // 2. 然后定义依赖 chartData 的函数
  const get24hData = useCallback((currentTimestamp: number) => {
    const timestamp24h = currentTimestamp - 24 * 60 * 60;
    const data24h = chartData.find(item => {
      const itemTime = typeof item.time === 'number' ? item.time : parseInt(String(item.time));
      return itemTime <= timestamp24h;
    });
    return data24h || chartData[0];
  }, [chartData]);

  const calculate24hChange = useCallback((currentPrice: number, price24h: number) => {
    return ((currentPrice - price24h) / price24h * 100).toFixed(2);
  }, []);

  const calculateChangePercent = useCallback((open: number, close: number) => {
    return ((close - open) / open * 100).toFixed(2);
  }, []);

  const handlePriceUpdate = useCallback((newPrice: PriceData) => {
    setCurrentViewPrice(newPrice);
    onPriceUpdate?.(newPrice);
  }, [onPriceUpdate]);

  // 3. 义更新价格数据的函数
  const updatePriceData = useCallback(() => {
    if (isHoveringRef.current) return;

    const latestData = chartData[chartData.length - 1];
    if (latestData) {
      const timestamp = Number(latestData.time);
      const data24h = get24hData(timestamp);
      const change24h = calculate24hChange(latestData.close, data24h.close);
      const changePercent = calculateChangePercent(latestData.open, latestData.close);

      const newPrice = {
        open: latestData.open.toFixed(2),
        high: latestData.high.toFixed(2),
        low: latestData.low.toFixed(2),
        close: latestData.close.toFixed(2),
        time: new Date(timestamp * 1000).toLocaleString('en-US', { 
          timeZone: 'Asia/Shanghai',
          hour12: false 
        }),
        price24h: data24h.close.toFixed(2),
        time24h: new Date(Number(data24h.time) * 1000).toLocaleString('en-US', {
          timeZone: 'Asia/Shanghai',
          hour12: false
        }),
        change24h,
        changePercent
      };
      
      // 只在非悬停状态更新当前视图价格
      setCurrentViewPrice(newPrice);
      // 始终更新最新价格
      onPriceUpdate?.(newPrice);
    }
  }, [chartData, get24hData, calculate24hChange, calculateChangePercent, onPriceUpdate]);

  // 4. 定义间隔变化处函数
  const handleIntervalChange = useCallback((newInterval: string) => {
    setIsLoading(true);
    setSelectedInterval(newInterval);
    
    // 使用单一更新流程
    const { timeStep, count } = getTimeStepAndCount(newInterval);
    const newChartData = getPriceData(token.symbol, token.price, timeStep, count);
    
    if (candlestickSeriesRef.current) {
      candlestickSeriesRef.current.setData(newChartData.map(item => ({
        ...item,
        time: item.time as UTCTimestamp,
      })));
    }

    // 获取最新数据并一次性更新所有价格
    const latestData = newChartData[newChartData.length - 1];
    if (latestData) {
      const timestamp = Number(latestData.time);
      const data24h = get24hData(timestamp);
      const change24h = calculate24hChange(latestData.close, data24h.close);
      const changePercent = calculateChangePercent(latestData.open, latestData.close);

      const newPrice = {
        open: latestData.open.toFixed(2),
        high: latestData.high.toFixed(2),
        low: latestData.low.toFixed(2),
        close: latestData.close.toFixed(2),
        time: new Date(timestamp * 1000).toLocaleString('en-US', { 
          timeZone: 'Asia/Shanghai',
          hour12: false 
        }),
        price24h: data24h.close.toFixed(2),
        time24h: new Date(Number(data24h.time) * 1000).toLocaleString('en-US', {
          timeZone: 'Asia/Shanghai',
          hour12: false
        }),
        change24h,
        changePercent
      };
      
      // 一次性更新所有状态
      setCurrentViewPrice(newPrice);
      onPriceUpdate?.(newPrice);
    }

    setIsLoading(false);
  }, [
    token.symbol, 
    token.price, 
    getTimeStepAndCount, 
    get24hData, 
    calculate24hChange, 
    calculateChangePercent, 
    onPriceUpdate
  ]);

  // 定义时间间隔选项
  const intervals: IntervalOption[] = useMemo(() => [
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

  useEffect(() => {
    handlePriceUpdate(currentViewPrice);
  }, []);

  // 更新图表数据的函数
  const updateChartData = useCallback(() => {
    if (!chartRef.current || !candlestickSeriesRef.current) return;

    const { timeStep, count } = getTimeStepAndCount(selectedInterval);
    const newChartData = getPriceData(token.symbol, token.price, timeStep, count);
    
    candlestickSeriesRef.current.setData(newChartData.map(item => ({
      ...item,
      time: item.time as UTCTimestamp,
    })));

    // 获取最新数据并更新价格
    const latestData = newChartData[newChartData.length - 1];
    if (latestData) {
      const timestamp = Number(latestData.time);
      const data24h = get24hData(timestamp);
      const change24h = calculate24hChange(latestData.close, data24h.close);
      const changePercent = calculateChangePercent(latestData.open, latestData.close);

      const newPrice = {
        open: latestData.open.toFixed(2),
        high: latestData.high.toFixed(2),
        low: latestData.low.toFixed(2),
        close: latestData.close.toFixed(2),
        time: new Date(timestamp * 1000).toLocaleString('en-US', { 
          timeZone: 'Asia/Shanghai',
          hour12: false 
        }),
        price24h: data24h.close.toFixed(2),
        time24h: new Date(Number(data24h.time) * 1000).toLocaleString('en-US', {
          timeZone: 'Asia/Shanghai',
          hour12: false
        }),
        change24h,
        changePercent
      };

      // 更新当前视图价格
      setCurrentViewPrice(newPrice);
      // 同时通知父组件更新价格
      onPriceUpdate?.(newPrice);
    }
  }, [
    selectedInterval, 
    token.symbol, 
    token.price, 
    getTimeStepAndCount, 
    get24hData, 
    calculate24hChange, 
    calculateChangePercent,
    onPriceUpdate
  ]);

  // 设置自动更新机制
  useEffect(() => {
    let intervalId: number;

    // 立即执行一次更新
    updateChartData();

    if (shouldAutoUpdate) {
      intervalId = window.setInterval(() => {
        updateChartData();
      }, UPDATE_INTERVAL);
    }

    return () => {
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [shouldAutoUpdate, updateChartData]);

  // 修改图表初始化
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

      // 保存 candlestickSeries 的引用
      candlestickSeriesRef.current = candlestickSeries;

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

      // 更新十字线移动事件处理
      chart.subscribeCrosshairMove((param) => {
        if (param.time) {
          isHoveringRef.current = true;
          const currentData = chartData.find(item => item.time === param.time);
          if (currentData) {
            const timestamp = typeof param.time === 'number' ? param.time : parseInt(String(param.time));
            const data24h = get24hData(timestamp);
            const change24h = calculate24hChange(currentData.close, data24h.close);
            const changePercent = calculateChangePercent(currentData.open, currentData.close);
            
            const newPrice = {
              open: currentData.open.toFixed(2),
              high: currentData.high.toFixed(2),
              low: currentData.low.toFixed(2),
              close: currentData.close.toFixed(2),
              time: new Date(timestamp * 1000).toLocaleString('en-US', { 
                timeZone: 'Asia/Shanghai',
                hour12: false 
              }),
              price24h: data24h.close.toFixed(2),
              time24h: new Date(Number(data24h.time) * 1000).toLocaleString('en-US', {
                timeZone: 'Asia/Shanghai',
                hour12: false
              }),
              change24h,
              changePercent
            };
            setCurrentViewPrice(newPrice);
            onHoverPriceChange?.(newPrice);
          }
        } else {
          isHoveringRef.current = false;
          updatePriceData();
        }
      });

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
  }, [chartOptions, isMobile, chartData, handlePriceUpdate, get24hData, calculate24hChange, calculateChangePercent, updatePriceData, latestPrice, onHoverPriceChange]);

  // 监听 token 价格变化
  useEffect(() => {
    updatePriceData();
  }, [token.price, updatePriceData]);

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

  // 修改时间间隔变化的 effect
  useEffect(() => {
    updateChartData(); // 立即更新一次数据
  }, [selectedInterval, updateChartData]);

  return (
    <Card className="border-muted/40 dark:border-muted/20 w-full">
      <CardHeader className="pb-2 px-4">
        <div className="flex flex-col gap-4">
          {/* 价格数据行 */}
          <div className="grid grid-cols-4 gap-1 sm:gap-8 text-[10px] sm:text-sm">
            <div className="flex flex-col min-w-0">
              <span className="text-muted-foreground">Open</span>
              <span className="font-mono truncate">{currentViewPrice.open}</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-muted-foreground">High</span>
              <span className="font-mono truncate">{currentViewPrice.high}</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-muted-foreground">Low</span>
              <span className="font-mono truncate">{currentViewPrice.low}</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-muted-foreground">Close</span>
              <div className="flex items-center gap-0.5 sm:gap-2">
                <span className="font-mono truncate">{currentViewPrice.close}</span>
                <span className={`text-[8px] sm:text-xs font-mono whitespace-nowrap ${
                  parseFloat(currentViewPrice.changePercent) >= 0 
                    ? "text-green-500" 
                    : "text-red-500"
                }`}>
                  ({parseFloat(currentViewPrice.changePercent) >= 0 ? "+" : ""}
                  {currentViewPrice.changePercent}% {selectedInterval})
                </span>
              </div>
            </div>
          </div>

          {/* 时间间隔按钮组 */}
          <div className="flex justify-start">
            <div className="flex flex-wrap gap-0.5 sm:gap-1">
              {intervals.map((item: IntervalOption) => (
                <Button
                  key={item.value}
                  variant={selectedInterval === item.value ? "default" : "ghost"}
                  size="sm"
                  className={`
                    h-5 sm:h-7 
                    px-1 sm:px-3
                    text-[9px] sm:text-xs 
                    font-mono font-medium
                    transition-colors
                    min-w-[28px] sm:min-w-[36px]
                    ${selectedInterval === item.value 
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                      : 'hover:bg-muted/50'
                    }
                  `}
                  onClick={() => handleIntervalChange(item.value)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading && (
          <div className="flex items-center justify-center h-[300px] sm:h-[600px]">
            <div className="animate-pulse-subtle">loading...</div>
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
            padding: '0 16px'
          }}
        />
        {/* 时间显示 */}
        <div className="text-[10px] sm:text-sm text-muted-foreground py-2 px-4 text-center border-t border-muted/10">
          {currentViewPrice.time.replace(' (UTC+8)', '')} (UTC+8)
        </div>
      </CardContent>
    </Card>
  );
} 