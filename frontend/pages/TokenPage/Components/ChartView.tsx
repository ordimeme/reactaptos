import { useEffect, useContext, useState, useRef, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MarketItem, ChartTheme, PriceData, Trade } from "@/types/market";
import { ThemeContext } from "@/context/ThemeContext";
import { createChart, Time, ColorType } from 'lightweight-charts';
import { getChartOptions } from "@/utils/chartUtils";
import {
  PriceDisplay,
  IntervalSelector,
  LoadingView,
  TimeDisplay
} from "./ChartComponents";
import { usePriceContext } from "@/context/PriceContext";
import { generateCandlestickData, generatePriceData } from "@/data/chatData";
import { formatDisplayPrice, formatAPTPrice, formatUSDPrice } from "@/utils/format";

interface ChartViewProps {
  token: MarketItem;
  initialPrice: PriceData;
  onPriceUpdate?: (price: PriceData) => void;
  onHoverPriceChange?: () => void;
}

export function ChartView({ token, initialPrice, onPriceUpdate}: ChartViewProps) {
  const { theme } = useContext(ThemeContext);
  const [selectedInterval, setSelectedInterval] = useState("5m");
  const [isLoading, setIsLoading] = useState(true);
  const { tokenTrades, tokenPrices } = usePriceContext();
  const [hoveredCandle, setHoveredCandle] = useState<{
    open: number;
    high: number;
    low: number;
    close: number;
    changePercent: number;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const candlestickSeriesRef = useRef<any>(null);
  const isHoveringRef = useRef(false);
  const lastPriceRef = useRef<PriceData | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // 获取当前代币的交易数据和价格
  const trades = useMemo(() => {
    const currentTrades = tokenTrades[token.id] || [];
    console.log('Current trades data:', {
      tokenId: token.id,
      tradesCount: currentTrades.length,
      hasPriceContext: !!tokenTrades[token.id],
      latestTrade: currentTrades[0] ? {
        price: formatAPTPrice(currentTrades[0].price),
        priceUSD: formatUSDPrice(currentTrades[0].priceUSD)
      } : null
    });
    return currentTrades;
  }, [token.id, tokenTrades]);

  // 使用 PriceContext 中的最新价格
  const currentPrice = useMemo(() => {
    const contextPrice = tokenPrices[token.id];
    const price = contextPrice || initialPrice;
    console.log('Chart price data:', {
      tokenId: token.id,
      contextPrice: contextPrice?.close ? formatDisplayPrice(contextPrice.close) : null,
      initialPrice: formatDisplayPrice(initialPrice.close),
      finalPrice: formatDisplayPrice(price.close)
    });
    return price;
  }, [token.id, tokenPrices, initialPrice]);

  // 处理价格更新
  const handlePriceUpdate = useCallback((trade: Trade) => {
    if (isHoveringRef.current) return;
    
    const now = Math.floor(Date.now() / 1000);
    const currentClose = Number(initialPrice.close);
    
    // 更新当前K线
    const newCandleData = {
      time: now as Time,
      open: Number(formatDisplayPrice(currentClose)),
      high: Number(formatDisplayPrice(Math.max(currentClose, trade.price))),
      low: Number(formatDisplayPrice(Math.min(currentClose, trade.price))),
      close: Number(formatDisplayPrice(trade.price))
    };

    console.log('Updating candle:', {
      newCandle: {
        ...newCandleData,
        open: formatDisplayPrice(newCandleData.open),
        high: formatDisplayPrice(newCandleData.high),
        low: formatDisplayPrice(newCandleData.low),
        close: formatDisplayPrice(newCandleData.close)
      },
      trade: {
        price: formatAPTPrice(trade.price),
        priceUSD: formatUSDPrice(trade.priceUSD),
        type: trade.type,
        timestamp: trade.timestamp
      }
    });

    candlestickSeriesRef.current?.update(newCandleData);

    // 生成新的价格数据
    const priceData = generatePriceData([...trades, trade]);

    if (!lastPriceRef.current || lastPriceRef.current.close !== priceData.close) {
      lastPriceRef.current = priceData;
      onPriceUpdate?.(priceData);
    }
  }, [trades, initialPrice, onPriceUpdate]);

  // 生成K线数据
  const candlestickData = useMemo(() => {
    if (trades.length === 0) {
      console.log('No trades available for candlestick data');
      setIsLoading(true);
      return [];
    }

    console.log('Generating candlestick data:', {
      tradesCount: trades.length,
      interval: selectedInterval,
      tokenId: token.id,
      firstTrade: trades[0],
      lastTrade: trades[trades.length - 1]
    });

    setIsLoading(false);
    return generateCandlestickData(trades, selectedInterval, 100);
  }, [trades, selectedInterval, token.id]);

  // 添加防抖动处理
  const handleCrosshairMove = useCallback((param: any) => {
    if (
      param.time && 
      param.seriesData && 
      param.seriesData.size > 0 && 
      candlestickSeriesRef.current
    ) {
      const candleData = param.seriesData.get(candlestickSeriesRef.current);
      if (candleData) {
        // 计算当前K线的涨跌幅
        const changePercent = ((candleData.close - candleData.open) / candleData.open) * 100;
        
        // 使用 requestAnimationFrame 来平滑更新状态
        requestAnimationFrame(() => {
          setHoveredCandle({
            open: candleData.open,
            high: candleData.high,
            low: candleData.low,
            close: candleData.close,
            changePercent
          });
        });
      }
    } else {
      requestAnimationFrame(() => {
        setHoveredCandle(null);
      });
    }
  }, []);

  // 初始化图表
  const initializeChart = useCallback(() => {
    if (!containerRef.current || candlestickData.length === 0) {
      console.log('Cannot initialize chart: missing container or data');
      return;
    }

    try {
      // 清理旧的图表
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        candlestickSeriesRef.current = null;
      }

      const { clientWidth, clientHeight } = containerRef.current;
      console.log('Initializing chart:', {
        theme,
        width: clientWidth,
        height: clientHeight,
        candlestickDataLength: candlestickData.length
      });

      const chartOptions = {
        ...getChartOptions(theme as ChartTheme),
        width: clientWidth,
        height: clientHeight,
        grid: {
          vertLines: {
            color: theme === 'dark' ? '#2B2B43' : '#E1E1E1',
            style: 1,
            visible: true
          },
          horzLines: {
            visible: false
          }
        },
        timeScale: {
          borderVisible: false,
          timeVisible: true,
          secondsVisible: false,
          fixLeftEdge: true,  // 固定左边缘
          fixRightEdge: true  // 固定右边缘
        },
        rightPriceScale: {
          borderVisible: false,
          scaleMargins: {
            top: 0.2,
            bottom: 0.2
          },
          entireTextOnly: true  // 防止价格标签被截断
        },
        layout: {
          background: { 
            type: ColorType.Solid,
            color: 'transparent' 
          },
          textColor: theme === 'dark' ? '#D9D9D9' : '#2B2B43',
          fontSize: 12  // 设置固定字体大小
        },
        crosshair: {
          // 优化十字线样式
          vertLine: {
            color: theme === 'dark' ? '#758696' : '#9598A1',
            width: 1,
            style: 1,
            visible: true,
            labelVisible: false
          },
          horzLine: {
            color: theme === 'dark' ? '#758696' : '#9598A1',
            width: 1,
            style: 1,
            visible: true,
            labelVisible: false
          }
        },
        handleScale: {
          mouseWheel: true,     // 启用鼠标滚轮缩放
          pinch: true,          // 启用捏合缩放
          axisPressedMouseMove: {
            time: true,         // 启用时间轴拖动
            price: true         // 启用价格轴拖动
          }
        },
        handleScroll: {
          mouseWheel: true,      // 启用鼠标滚轮滚动
          pressedMouseMove: true, // 启用鼠标拖动
          horzTouchDrag: true,   // 启用触摸拖动
          vertTouchDrag: true    // 启用垂直触摸拖动
        }
      };

      chartRef.current = createChart(containerRef.current, chartOptions);

      candlestickSeriesRef.current = chartRef.current.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
        priceFormat: {
          type: 'price',
          precision: 4,
          minMove: 0.0001,
        }
      });

      // 确保K线数据使用4位小数
      const formattedCandlestickData = candlestickData.map(candle => ({
        ...candle,
        open: Number(formatDisplayPrice(candle.open)),
        high: Number(formatDisplayPrice(candle.high)),
        low: Number(formatDisplayPrice(candle.low)),
        close: Number(formatDisplayPrice(candle.close))
      }));

      candlestickSeriesRef.current.setData(formattedCandlestickData);
      setIsLoading(false);

      console.log('Chart initialized with formatted data:', {
        firstCandle: formattedCandlestickData[0],
        lastCandle: formattedCandlestickData[formattedCandlestickData.length - 1]
      });

      // 添加十字线移动事件监听
      chartRef.current.subscribeCrosshairMove(handleCrosshairMove);

    } catch (error) {
      console.error('Error initializing chart:', error);
      setIsLoading(false);
    }
  }, [theme, candlestickData, handleCrosshairMove]);

  // 监听容器大小变化
  useEffect(() => {
    if (!containerRef.current) return;

    resizeObserverRef.current = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      console.log('Container resized:', { width, height });
      
      if (chartRef.current) {
        chartRef.current.resize(width, height);
        console.log('Chart resized');
      } else {
        initializeChart();
        console.log('Chart reinitialized after resize');
      }
    });

    resizeObserverRef.current.observe(containerRef.current);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        candlestickSeriesRef.current = null;
      }
    };
  }, [initializeChart]);

  // 监听主题变化
  useEffect(() => {
    console.log('Theme changed:', theme);
    initializeChart();
  }, [theme, initializeChart]);

  // 监听交易数据变化
  useEffect(() => {
    console.log('Trades updated:', {
      tradesCount: trades.length,
      hasInitialTrades: trades.length > 0,
      tokenId: token.id
    });

    if (trades.length > 0) {
      const latestTrade = trades[0];
      handlePriceUpdate(latestTrade);
    }
  }, [trades, handlePriceUpdate]);

  // 添加加载状态日志
  useEffect(() => {
    console.log('Chart state:', {
      isLoading,
      hasContainer: !!containerRef.current,
      hasChart: !!chartRef.current,
      hasCandlestickSeries: !!candlestickSeriesRef.current,
      tradesCount: trades.length,
      candlestickDataLength: candlestickData.length
    });
  }, [isLoading, trades.length, candlestickData.length]);

  // 处理时间区间变化
  const handleIntervalChange = useCallback((newInterval: string) => {
    setSelectedInterval(newInterval);
    setIsLoading(true);

    // 重新生成对应时间区间的K线数据
    if (trades.length > 0) {
      const newCandlestickData = generateCandlestickData(trades, newInterval, 100);
      
      // 更新图表数据
      if (candlestickSeriesRef.current) {
        const formattedData = newCandlestickData.map(candle => ({
          ...candle,
          open: Number(formatDisplayPrice(candle.open)),
          high: Number(formatDisplayPrice(candle.high)),
          low: Number(formatDisplayPrice(candle.low)),
          close: Number(formatDisplayPrice(candle.close))
        }));
        
        candlestickSeriesRef.current.setData(formattedData);
        
        // 更新当前显示的价格数据
        const latestCandle = formattedData[formattedData.length - 1];
        if (latestCandle) {
          setHoveredCandle({
            open: latestCandle.open,
            high: latestCandle.high,
            low: latestCandle.low,
            close: latestCandle.close,
            changePercent: ((latestCandle.close - latestCandle.open) / latestCandle.open) * 100
          });
        }
      }
    }
    
    setIsLoading(false);
  }, [trades]);

  // 获取最新K线数据
  const latestCandle = useMemo(() => {
    if (candlestickData.length === 0) return null;
    return candlestickData[candlestickData.length - 1];
  }, [candlestickData]);

  // 清理事件监听
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.unsubscribeCrosshairMove(handleCrosshairMove);
        chartRef.current.remove();
      }
    };
  }, [handleCrosshairMove]);

  if (isLoading && !chartRef.current) {
    return <LoadingView />;
  }

  return (
    <Card className="border-muted/40 dark:border-muted/20">
      <CardHeader className="space-y-4 p-4">
        <PriceDisplay 
          price={currentPrice} 
          showUSD={true}
          hoveredPrice={hoveredCandle}
          latestCandle={latestCandle}
        />
        <IntervalSelector
          selectedInterval={selectedInterval}
          onIntervalChange={handleIntervalChange}
        />
      </CardHeader>
      <CardContent className="p-0">
        <div 
          ref={containerRef} 
          className="h-[400px] w-full"
          onMouseEnter={() => isHoveringRef.current = true}
          onMouseLeave={() => {
            isHoveringRef.current = false;
            setHoveredCandle(null);  // 清除悬停数据
          }}
        />
        <TimeDisplay time={currentPrice.time} />
      </CardContent>
    </Card>
  );
} 