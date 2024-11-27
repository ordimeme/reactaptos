import { MarketItem, Comment, Trade, Holder } from "@/types/market";

// 生成过去的时间戳
const generatePastTimestamp = (hoursAgo: number) => {
  return new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString();
};

// 生成模拟评论
const generateComments = (): Array<Comment> => {
  return Array(10).fill(null).map((_, index) => ({
    id: index.toString(),
    user: `User${index + 1}`,
    avatar: `/avatars/avatar${(index % 5) + 1}.png`,
    content: `This is comment ${index + 1}`,
    timestamp: new Date(Date.now() - index * 86400000).toISOString()
  } as Comment));
};

// 生成模拟交易
const generateTrades = (): Array<Trade> => {
  return Array(20).fill(null).map((_, index) => ({
    id: index.toString(),
    account: `0x${Math.random().toString(16).slice(2, 42)}`,
    type: Math.random() > 0.5 ? 'buy' : 'sell',
    aptAmount: Math.random() * 1000,
    tokenAmount: Math.random() * 10000,
    timestamp: new Date(Date.now() - index * 3600000).toISOString(),
    txHash: `0x${Math.random().toString(16).slice(2, 64)}`
  } as Trade));
};

// 生成持有者数据
const generateHolders = (): Array<Holder> => {
  return Array(5).fill(null).map((_, index) => ({
    address: `0x${Math.random().toString(16).slice(2, 42)}`,
    percentage: Math.random() * 20,
    balance: Math.floor(Math.random() * 1000000),
    type: index === 0 ? 'creator' : undefined
  } as Holder));
};

// Desert Gold 的完整数据
export const dgldData: MarketItem = {
  id: "dgld",
  name: "Desert Gold",
  symbol: "DGLD",
  price: 4567.89,
  imageUrl: "/tokens/dgld.svg",
  creator: "0xgold...sand",
  description: "Digital gold from the crypto desert - A revolutionary token combining traditional gold's stability with blockchain innovation.",
  timestamp: generatePastTimestamp(24 * 7), // 一周前创建
  marketCap: 820000,
  bondingProgress: 92,
  kingProgress: 96,
  dethroneCap: 880000,
  priceChange24h: 43.40, // 添加 24h 价格变化
  comments: generateComments(),
  holders: generateHolders(),
  trades: generateTrades()
};

export default dgldData; 