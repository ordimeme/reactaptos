import { CandlestickData, Time } from 'lightweight-charts';

function generatePriceData(
  currentPrice: number,
  timeStep: number,
  count: number
): CandlestickData<Time>[] {
  const data: CandlestickData<Time>[] = [];
  const now = Math.floor(Date.now() / 1000);
  let basePrice = currentPrice * 0.8; // 从较低的价格开始

  // 根据不同的时间区间调整价格波动范围
  const getVolatilityRange = (timeStep: number) => {
    switch (timeStep) {
      case 5 * 60: // 5m
        return { min: 0.05, max: 0.15 };
      case 15 * 60: // 15m
        return { min: 0.1, max: 0.2 };
      case 60 * 60: // 1h
        return { min: 0.15, max: 0.3 };
      case 4 * 60 * 60: // 4h
        return { min: 0.2, max: 0.4 };
      case 24 * 60 * 60: // 1d
        return { min: 0.3, max: 0.6 };
      case 7 * 24 * 60 * 60: // 1w
        return { min: 0.5, max: 1.0 };
      default:
        return { min: 0.15, max: 0.3 };
    }
  };

  const volatility = getVolatilityRange(timeStep);
  let trend = 0.6; // 总体上涨趋势

  // 生成历史数据，从当前时间往前推
  for (let i = count - 1; i >= 0; i--) {
    const time = now - (i * timeStep);
    const volatilityPercent = (Math.random() * (volatility.max - volatility.min) + volatility.min) / 100;
    
    // 生成开盘价、最高价、最低价和收盘价
    const open = basePrice;
    // 使用趋势影响方向
    const direction = Math.random() > (1 - trend) ? 1 : -1;
    const change = basePrice * volatilityPercent * direction;
    const close = basePrice + change;
    
    // 确保最高价和最低价合理
    const high = Math.max(open, close) + Math.abs(change) * Math.random() * 0.3;
    const low = Math.min(open, close) - Math.abs(change) * Math.random() * 0.3;

    data.push({
      time: time as Time,
      open,
      high,
      low,
      close,
    });

    // 更新基准价格，并确保总体趋势向目标价格移动
    basePrice = close;
    if (i < count / 2) {
      // 在后半段逐渐调整到目标价格
      const targetDiff = currentPrice - basePrice;
      basePrice += targetDiff / (i + 1);
    }
    
    // 动态调整趋势
    trend = Math.max(0.4, Math.min(0.8, trend + (Math.random() - 0.5) * 0.1));
  }

  return data;
}

export function getPriceData(
  _symbol: string,
  currentPrice: number,
  timeStep: number,
  count: number
): CandlestickData<Time>[] {
  return generatePriceData(currentPrice, timeStep, count);
} 