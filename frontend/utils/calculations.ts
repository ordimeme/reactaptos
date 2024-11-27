import { MarketItem, Trade } from "@/data/marketData";

/**
 * 计算24小时价格变化百分比
 * @param trades 交易历史记录
 * @returns 价格变化百分比
 */
export const calculate24hPriceChange = (trades: Trade[]): number => {
  if (trades.length < 2) return 0;

  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  const oldTrade = trades.find(trade => new Date(trade.timestamp) < oneDayAgo);
  const latestTrade = trades[0];

  if (!oldTrade) return 0;

  return ((latestTrade.aptAmount / latestTrade.tokenAmount) - 
          (oldTrade.aptAmount / oldTrade.tokenAmount)) / 
          (oldTrade.aptAmount / oldTrade.tokenAmount) * 100;
};

/**
 * 计算指定时间范围内的交易量
 * @param item 市场项目数据
 * @param hours 小时数
 * @returns 交易量
 */
export const calculateVolume = (item: MarketItem, hours: number): number => {
  const timeThreshold = new Date(Date.now() - hours * 60 * 60 * 1000);
  return item.trades
    .filter((trade: Trade) => new Date(trade.timestamp) > timeThreshold)
    .reduce((sum: number, trade: Trade) => sum + trade.aptAmount, 0);
};

/**
 * 获取排序后的Top Gainer
 * @param marketData 市场数据数组
 * @returns Top Gainer项目
 */
export const getTopGainer = (marketData: MarketItem[]): MarketItem => {
  return [...marketData].sort((a, b) => b.priceChange24h - a.priceChange24h)[0];
};

/**
 * 获取排序后的Top Volume
 * @param marketData 市场数据数组
 * @returns Top Volume项目
 */
export const getTopVolume = (marketData: MarketItem[]): MarketItem => {
  return [...marketData].sort((a, b) => calculateVolume(b, 24) - calculateVolume(a, 24))[0];
};

/**
 * 根据条件过滤和排序市场数据
 * @param marketData 原始市场数据
 * @param searchTerm 搜索关键词
 * @param filterBy 过滤条件
 * @param sortBy 排序条件
 * @returns 过滤和排序后的数据
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