import { CandlestickData, Time } from 'lightweight-charts';
import { PriceData, Trade } from '@/types/market';
import { formatDisplayPrice } from '@/utils/format';

// 定义时间间隔映射（以秒为单位）
const INTERVAL_SECONDS: { [key: string]: number } = {
  '5s': 5,
  '30s': 30,
  '5m': 300,
  '15m': 900,
  '1h': 3600,
  '4h': 14400,
  '1d': 86400,
  '1w': 604800,
  '1mo': 2592000,
  '1y': 31536000
} as const;

// 根据时间间隔生成K线数据
export function generateCandlestickData(
  trades: Trade[],
  interval: string,
  count: number
): CandlestickData[] {
  const intervalSeconds = INTERVAL_SECONDS[interval] || 3600; // 默认1小时
  const now = Math.floor(Date.now() / 1000);
  const startTime = now - (intervalSeconds * count);
  
  // 按时间排序交易数据
  const sortedTrades = [...trades].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // 生成时间段
  const timeSlots: { [key: number]: Trade[] } = {};
  for (let time = startTime; time <= now; time += intervalSeconds) {
    timeSlots[time] = [];
  }

  // 将交易分配到对应的时间段
  sortedTrades.forEach(trade => {
    const tradeTime = Math.floor(new Date(trade.timestamp).getTime() / 1000);
    const slotTime = Math.floor(tradeTime / intervalSeconds) * intervalSeconds;
    if (slotTime >= startTime && slotTime <= now) {
      timeSlots[slotTime] = timeSlots[slotTime] || [];
      timeSlots[slotTime].push(trade);
    }
  });

  // 生成K线数据
  const candlesticks: CandlestickData[] = [];
  Object.entries(timeSlots).forEach(([time, slotTrades]) => {
    if (slotTrades.length === 0) {
      // 如果没有交易，使用前一个K线的收盘价
      const prevCandle = candlesticks[candlesticks.length - 1];
      const price = prevCandle ? prevCandle.close : sortedTrades[0]?.price || 0;
      candlesticks.push({
        time: parseInt(time) as Time,
        open: price,
        high: price,
        low: price,
        close: price
      });
    } else {
      const prices = slotTrades.map(t => t.price);
      candlesticks.push({
        time: parseInt(time) as Time,
        open: prices[0],
        high: Math.max(...prices),
        low: Math.min(...prices),
        close: prices[prices.length - 1]
      });
    }
  });

  return candlesticks;
}

// 生成价格数据
export function generatePriceData(trades: Trade[]): PriceData {
  if (trades.length === 0) {
    return {
      open: '0',
      high: '0',
      low: '0',
      close: '0',
      time: new Date().toLocaleString('en-US', { timeZone: 'Asia/Shanghai', hour12: false }),
      price24h: '0',
      time24h: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString('en-US', {
        timeZone: 'Asia/Shanghai',
        hour12: false
      }),
      change24h: '0.00',
      changePercent: '0.00'
    };
  }

  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  const recentTrades = trades.filter(t => new Date(t.timestamp) >= oneDayAgo);
  const prices = recentTrades.map(t => t.price);
  
  const latestPrice = prices[prices.length - 1];
  const price24hAgo = trades.find(t => new Date(t.timestamp) <= oneDayAgo)?.price || latestPrice;

  return {
    open: formatDisplayPrice(prices[0]),
    high: formatDisplayPrice(Math.max(...prices)),
    low: formatDisplayPrice(Math.min(...prices)),
    close: formatDisplayPrice(latestPrice),
    time: now.toLocaleString('en-US', { timeZone: 'Asia/Shanghai', hour12: false }),
    price24h: formatDisplayPrice(price24hAgo),
    time24h: oneDayAgo.toLocaleString('en-US', { timeZone: 'Asia/Shanghai', hour12: false }),
    change24h: formatDisplayPrice((latestPrice - price24hAgo) / price24hAgo * 100),
    changePercent: formatDisplayPrice((latestPrice - prices[0]) / prices[0] * 100)
  };
}

// 获取指定时间范围的交易数据
export function getTradesInTimeRange(
  trades: Trade[],
  startTime: number,
  endTime: number
): Trade[] {
  return trades.filter(trade => {
    const tradeTime = new Date(trade.timestamp).getTime() / 1000;
    return tradeTime >= startTime && tradeTime <= endTime;
  });
}
