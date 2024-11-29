import { DeepPartial, ChartOptions, CandlestickSeriesOptions, ColorType } from 'lightweight-charts';
import { ChartTheme } from '@/types/market';

// 定义图表选项
export const getChartOptions = (theme: ChartTheme): DeepPartial<ChartOptions> => ({
  layout: {
    background: { 
      color: theme === 'dark' ? '#1a1b1e' : '#ffffff',
      type: ColorType.Solid,
    },
    textColor: theme === 'dark' ? '#d1d4dc' : '#000000',
    fontSize: 12,
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
  timeScale: {
    timeVisible: true,
    secondsVisible: false,
    fixLeftEdge: true,
    fixRightEdge: true,
    borderColor: theme === 'dark' ? '#2B2B43' : '#e1e3eb',
    tickMarkFormatter: (time: number) => {
      const date = new Date(time * 1000);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    },
  },
  rightPriceScale: {
    borderColor: theme === 'dark' ? '#2B2B43' : '#e1e3eb',
    scaleMargins: {
      top: 0.1,
      bottom: 0.1,
    },
    visible: true,
    borderVisible: true,
    autoScale: true,
    mode: 1,
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
  handleScale: {
    axisPressedMouseMove: {
      time: true,
      price: true,
    },
    mouseWheel: true,
    pinch: true,
  },
  handleScroll: {
    mouseWheel: true,
    pressedMouseMove: true,
    horzTouchDrag: true,
    vertTouchDrag: true,
  },
});

// 定义K线图选项
export const getCandlestickOptions = (): DeepPartial<CandlestickSeriesOptions> => ({
  upColor: '#26a69a',
  downColor: '#ef5350',
  borderUpColor: '#26a69a',
  borderDownColor: '#ef5350',
  wickUpColor: '#26a69a',
  wickDownColor: '#ef5350',
  priceFormat: {
    type: 'price',
    precision: 2,
    minMove: 0.01,
  },
});

// 获取时间步长和数量
export const getTimeStepAndCount = (intervalValue: string): { timeStep: number; count: number } => {
  const intervals: Record<string, { timeStep: number; count: number }> = {
    "5s": { timeStep: 5, count: 200 },
    "30s": { timeStep: 30, count: 200 },
    "5m": { timeStep: 5 * 60, count: 200 },
    "15m": { timeStep: 15 * 60, count: 200 },
    "1h": { timeStep: 60 * 60, count: 200 },
    "4h": { timeStep: 4 * 60 * 60, count: 200 },
    "1d": { timeStep: 24 * 60 * 60, count: 200 },
    "1w": { timeStep: 7 * 24 * 60 * 60, count: 200 },
    "1mo": { timeStep: 30 * 24 * 60 * 60, count: 200 },
    "1y": { timeStep: 365 * 24 * 60 * 60, count: 200 },
  };

  return intervals[intervalValue] || intervals["1h"];
};

// 格式化价格显示
export const formatPrice = (price: number): string => {
  if (price >= 1000000) {
    return (price / 1000000).toFixed(2) + 'M';
  } else if (price >= 1000) {
    return (price / 1000).toFixed(2) + 'K';
  }
  return price.toFixed(2);
}; 