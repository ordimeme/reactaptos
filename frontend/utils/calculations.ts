import { MarketItem, Trade } from "@/data/marketData";
import { getPriceData } from "@/data/priceData";

/**
 * 计算指定时间区间的价格变化百分比
 * @param interval 时间区间 (5m, 15m, 1h, 4h, 1d, 1w)
 * @param currentPrice 当前价格
 * @returns 价格变化百分比
 */
export const calculatePriceChangeByInterval = (interval: string, currentPrice: number): number => {
  // 获取与图表相同的时间步长和数据点数量
  const getTimeStepAndCount = (intervalValue: string) => {
    switch (intervalValue) {
      case "5m":
        return { timeStep: 5 * 60, count: 200 };
      case "15m":
        return { timeStep: 15 * 60, count: 200 };
      case "1h":
        return { timeStep: 60 * 60, count: 200 };
      case "4h":
        return { timeStep: 4 * 60 * 60, count: 200 };
      case "1d":
        return { timeStep: 24 * 60 * 60, count: 200 };
      case "1w":
        return { timeStep: 7 * 24 * 60 * 60, count: 200 };
      default:
        return { timeStep: 60 * 60, count: 200 };
    }
  };

  // 获取与图表相同的K线数据
  const { timeStep, count } = getTimeStepAndCount(interval);
  const chartData = getPriceData("", currentPrice, timeStep, count);

  // 使用K线数据计算价格变化
  if (chartData.length < 2) return 0;

  // 获取区间内的第一根和最后一根K线
  const firstCandle = chartData[0];
  const lastCandle = chartData[chartData.length - 1];

  // 计算百分比变化：(最新价格 - 初始价格) / 初始价格 * 100
  return ((lastCandle.close - firstCandle.open) / firstCandle.open) * 100;
};

/**
 * 获取Top Gainer项目
 */
export const getTopGainer = (marketData: MarketItem[]): MarketItem => {
  return [...marketData].sort((a, b) => b.priceChange24h - a.priceChange24h)[0];
};

/**
 * 计算指定时间范围内的交易量
 */
export const calculateVolume = (item: MarketItem, hours: number): number => {
  const timeThreshold = new Date(Date.now() - hours * 60 * 60 * 1000);
  return item.trades
    .filter((trade: Trade) => new Date(trade.timestamp) > timeThreshold)
    .reduce((sum: number, trade: Trade) => sum + trade.aptAmount, 0);
};

/**
 * 获取Top Volume项目
 */
export const getTopVolume = (marketData: MarketItem[]): MarketItem => {
  return [...marketData].sort((a, b) => calculateVolume(b, 24) - calculateVolume(a, 24))[0];
};

/**
 * 根据条件过滤和排序市场数据
 */
export const getFilteredAndSortedData = (
  marketData: MarketItem[],
  searchTerm: string,
  filterBy: string,
  sortBy: string
): MarketItem[] => {
  let filtered = [...marketData];

  // 搜索过滤
  if (searchTerm) {
    filtered = filtered.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // 根据不同条件筛选
  switch (filterBy) {
    case "bonding-0-25":
      filtered = filtered.filter(item => item.bondingProgress <= 25);
      break;
    case "bonding-25-50":
      filtered = filtered.filter(item => item.bondingProgress > 25 && item.bondingProgress <= 50);
      break;
    case "bonding-50-75":
      filtered = filtered.filter(item => item.bondingProgress > 50 && item.bondingProgress <= 75);
      break;
    case "bonding-75-100":
      filtered = filtered.filter(item => item.bondingProgress > 75);
      break;
  }

  // 排序逻辑
  switch (sortBy) {
    case "creation-time":
      filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      break;
    case "featured":
      filtered.sort((a, b) => (b.marketCap * b.bondingProgress) - (a.marketCap * a.bondingProgress));
      break;
    case "last-trade":
      filtered.sort((a, b) => {
        const aLastTrade = a.trades[0]?.timestamp || a.timestamp;
        const bLastTrade = b.trades[0]?.timestamp || b.timestamp;
        return new Date(bLastTrade).getTime() - new Date(aLastTrade).getTime();
      });
      break;
    case "last-reply":
      filtered.sort((a, b) => {
        const aLastComment = a.comments[0]?.timestamp || a.timestamp;
        const bLastComment = b.comments[0]?.timestamp || b.timestamp;
        return new Date(bLastComment).getTime() - new Date(aLastComment).getTime();
      });
      break;
    case "market-cap-high":
      filtered.sort((a, b) => b.marketCap - a.marketCap);
      break;
    case "market-cap-low":
      filtered.sort((a, b) => a.marketCap - b.marketCap);
      break;
    case "volume-24h-high":
      filtered.sort((a, b) => calculateVolume(b, 24) - calculateVolume(a, 24));
      break;
    case "volume-7d-high":
      filtered.sort((a, b) => calculateVolume(b, 168) - calculateVolume(a, 168));
      break;
    default:
      filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  return filtered;
};

/**
 * 计算24小时价格变化百分比
 * @param trades 交易历史记录
 * @returns 价格变化百分比
 */
export const calculate24hPriceChange = (trades: Trade[]): number => {
  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;

  // 获取24小时内的交易
  const recentTrades = trades
    .filter(trade => new Date(trade.timestamp).getTime() > oneDayAgo)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  if (recentTrades.length < 2) return 0;

  // 获取最新价格和24小时前的价格
  const latestPrice = recentTrades[0].aptAmount / recentTrades[0].tokenAmount;
  const oldestPrice = recentTrades[recentTrades.length - 1].aptAmount / recentTrades[recentTrades.length - 1].tokenAmount;

  // 计算价格变化百分比
  return ((latestPrice - oldestPrice) / oldestPrice) * 100;
}; 