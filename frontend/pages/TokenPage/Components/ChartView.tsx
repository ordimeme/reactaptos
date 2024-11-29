import { useEffect, useContext, useState, useRef, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MarketItem, ChartTheme, PriceData } from "@/types/market";
import { ThemeContext } from "@/context/ThemeContext";
import { createChart, Time } from 'lightweight-charts';
import { 
  getChartOptions, 
  getTimeStepAndCount
} from "@/utils/chartUtils";
import { getPriceData } from "@/data/priceData";
import {
  PriceDisplay,
  IntervalSelector,
  LoadingView,
  TimeDisplay
} from "./ChartComponents";
import { usePriceContext } from "@/context/PriceContext";

export interface ChartViewProps {
  token: MarketItem;
  initialPrice: PriceData;
  onPriceUpdate?: (newPrice: PriceData) => void;
  onHoverPriceChange?: () => void;
}

export function ChartView({ token, initialPrice, onPriceUpdate }: ChartViewProps) {
  const { theme } = useContext(ThemeContext);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [selectedInterval, setSelectedInterval] = useState("1h");
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredPrice, setHoveredPrice] = useState<PriceData | null>(null);
  
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const candlestickSeriesRef = useRef<any>(null);
  const isHoveringRef = useRef(false);

  const { updatePrice, priceSimulator } = usePriceContext();

  const chartData = useMemo(() => {
    console.log('Generating chart data with price:', initialPrice.close);
    const { timeStep, count } = getTimeStepAndCount(selectedInterval);
    const basePrice = parseFloat(initialPrice.close);
    return getPriceData(basePrice, timeStep, count);
  }, [selectedInterval, initialPrice.close]);

  const handlePriceUpdate = useCallback((price: number) => {
    if (isHoveringRef.current) return;
    
    const now = Math.floor(Date.now() / 1000);
    const lastData = chartData[chartData.length - 1];
    
    const newCandleData = {
      time: now as Time,
      open: Number(lastData.close),
      high: Math.max(Number(lastData.close), price),
      low: Math.min(Number(lastData.close), price),
      close: price
    };

    candlestickSeriesRef.current?.update(newCandleData);

    const priceData: PriceData = {
      open: lastData.close.toFixed(4),
      high: newCandleData.high.toFixed(4),
      low: newCandleData.low.toFixed(4),
      close: price.toFixed(4),
      time: new Date(now * 1000).toLocaleString('en-US', {
        timeZone: 'Asia/Shanghai',
        hour12: false
      }),
      price24h: chartData[0].close.toFixed(4),
      time24h: new Date((now - 24 * 60 * 60) * 1000).toLocaleString('en-US', {
        timeZone: 'Asia/Shanghai',
        hour12: false
      }),
      change24h: ((price - Number(chartData[0].close)) / Number(chartData[0].close) * 100).toFixed(2),
      changePercent: ((price - Number(lastData.close)) / Number(lastData.close) * 100).toFixed(2)
    };

    if (!lastPriceRef.current || lastPriceRef.current.close !== priceData.close) {
      console.log('Updating chart price:', priceData);
      lastPriceRef.current = priceData;
      updatePrice(priceData, token.id);
      onPriceUpdate?.(priceData);
    }
  }, [chartData, token.id, updatePrice, onPriceUpdate]);

  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastPriceRef = useRef<PriceData | null>(null);

  const handleCrosshairMove = useCallback((param: any) => {
    if (!param.time) {
      if (isHoveringRef.current) {
        isHoveringRef.current = false;
        setHoveredPrice(null);
        updatePrice(initialPrice, token.id);
        onPriceUpdate?.(initialPrice);
      }
      return;
    }

    if (!candlestickSeriesRef.current) return;

    const data = param.seriesData.get(candlestickSeriesRef.current);
    if (!data) return;

    isHoveringRef.current = true;
    const timestamp = Number(param.time);
    const timestamp24h = timestamp - 24 * 60 * 60;
    const data24h = chartData.find(item => {
      const itemTime = typeof item.time === 'number' ? item.time : parseInt(String(item.time));
      return itemTime <= timestamp24h;
    }) || data;

    const priceData: PriceData = {
      open: data.open.toFixed(4),
      high: data.high.toFixed(4),
      low: data.low.toFixed(4),
      close: data.close.toFixed(4),
      time: new Date(timestamp * 1000).toLocaleString('en-US', {
        timeZone: 'Asia/Shanghai',
        hour12: false
      }),
      price24h: data24h.close.toFixed(4),
      time24h: new Date(timestamp24h * 1000).toLocaleString('en-US', {
        timeZone: 'Asia/Shanghai',
        hour12: false
      }),
      change24h: ((data.close - data24h.close) / data24h.close * 100).toFixed(2),
      changePercent: ((data.close - data.open) / data.open * 100).toFixed(2)
    };

    if (JSON.stringify(lastPriceRef.current) !== JSON.stringify(priceData)) {
      lastPriceRef.current = priceData;
      setHoveredPrice(priceData);
    }
  }, [chartData, token.id, updatePrice, onPriceUpdate, initialPrice]);

  const initChart = useCallback(() => {
    if (!chartContainerRef.current || !chartData.length) {
      console.log('Cannot initialize chart:', { 
        hasContainer: !!chartContainerRef.current, 
        dataLength: chartData.length 
      });
      return;
    }

    console.log('Initializing chart with data:', chartData);

    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
      candlestickSeriesRef.current = null;
    }

    const containerWidth = chartContainerRef.current.clientWidth || 800;
    const containerHeight = isMobile ? 300 : 600;

    const chart = createChart(chartContainerRef.current, {
      ...getChartOptions(theme as ChartTheme),
      width: containerWidth,
      height: containerHeight,
      layout: {
        background: { color: theme === 'dark' ? '#1a1b1e' : '#ffffff' },
        textColor: theme === 'dark' ? '#d1d4dc' : '#000000',
      },
      rightPriceScale: {
        scaleMargins: {
          top: 0.2,
          bottom: 0.2,
        },
        borderVisible: false,
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: theme === 'dark' ? '#2B2B43' : '#e1e3eb',
        fixLeftEdge: true,
        fixRightEdge: true,
      },
      grid: {
        vertLines: { 
          color: theme === 'dark' ? '#2B2B43' : '#e1e3eb',
          style: 1,
        },
        horzLines: { 
          color: theme === 'dark' ? '#2B2B43' : '#e1e3eb',
          style: 1,
        },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          width: 1,
          color: theme === 'dark' ? '#758696' : '#9598A1',
          style: 3,
        },
        horzLine: {
          width: 1,
          color: theme === 'dark' ? '#758696' : '#9598A1',
          style: 3,
        },
      },
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderUpColor: '#26a69a',
      borderDownColor: '#ef5350',
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
      priceFormat: {
        type: 'price',
        precision: 4,
        minMove: 0.0001,
      },
    });

    const initialData = chartData.map(item => ({
      time: item.time,
      open: Number(item.open),
      high: Number(item.high),
      low: Number(item.low),
      close: Number(item.close)
    }));

    candlestickSeries.setData(initialData);

    if (chartData.length > 1) {
      const padding = Math.floor(chartData.length * 0.1);
      const fromIndex = Math.max(0, padding);
      const toIndex = Math.min(chartData.length - 1 - padding, chartData.length - 1);
      
      chart.timeScale().setVisibleRange({
        from: chartData[fromIndex].time,
        to: chartData[toIndex].time
      });
    }

    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;
    setIsLoading(false);

    chart.subscribeCrosshairMove(handleCrosshairMove);

    return () => {
      if (chartRef.current === chart) {
        chart.unsubscribeCrosshairMove(handleCrosshairMove);
        chart.remove();
        chartRef.current = null;
        candlestickSeriesRef.current = null;
      }
    };
  }, [chartData, theme, isMobile, handleCrosshairMove]);

  useEffect(() => {
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        const newWidth = chartContainerRef.current.clientWidth;
        const newHeight = window.innerWidth < 640 ? 300 : 600;
        chartRef.current.resize(newWidth, newHeight);
        setIsMobile(window.innerWidth < 640);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const cleanup = initChart();
    return () => {
      if (cleanup) cleanup();
    };
  }, [initChart, chartData]);

  useEffect(() => {
    if (priceSimulator && !isHoveringRef.current) {
      console.log('Setting up price simulator listener');
      priceSimulator.addListener(handlePriceUpdate);
      return () => priceSimulator.removeListener(handlePriceUpdate);
    }
  }, [priceSimulator, handlePriceUpdate]);

  const handleIntervalChange = useCallback((newInterval: string) => {
    setIsLoading(true);
    setSelectedInterval(newInterval);
    setHoveredPrice(null);
    
    requestAnimationFrame(() => {
      if (chartRef.current) {
        try {
          chartRef.current.remove();
        } catch (error) {
          console.warn('Chart cleanup error:', error);
        }
        chartRef.current = null;
        candlestickSeriesRef.current = null;
      }
      initChart();
    });
  }, [initChart]);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.subscribeCrosshairMove(handleCrosshairMove);
      return () => {
        if (chartRef.current) {
          chartRef.current.unsubscribeCrosshairMove(handleCrosshairMove);
        }
      };
    }
  }, [handleCrosshairMove]);

  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Card className="border-muted/40 dark:border-muted/20 w-full overflow-hidden">
      <CardHeader className="pb-2 px-3 sm:px-4">
        <div className="flex flex-col gap-3 sm:gap-4">
          <PriceDisplay 
            price={hoveredPrice || initialPrice} 
            className="pointer-events-none"
          />
          <IntervalSelector 
            selectedInterval={selectedInterval}
            onIntervalChange={handleIntervalChange}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0 relative">
        <div 
          ref={chartContainerRef}
          className="tradingview-chart-container w-full"
          style={{ 
            padding: '0 12px',
            height: isMobile ? '280px' : '600px',
            display: isLoading ? 'none' : 'block',
          }}
        />
        {isLoading && <LoadingView />}
        <TimeDisplay 
          time={(hoveredPrice || initialPrice).time}
          className="pointer-events-none absolute bottom-2 left-4"
        />
      </CardContent>
    </Card>
  );
} 