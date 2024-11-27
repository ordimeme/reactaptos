import { MarketItem, Comment, Trade } from "@/types/market";

// 生成模拟评论
const generateComments = (): Array<Comment> => {
  return Array(10).fill(null).map((_, index) => ({
    address: `0x${Math.random().toString(36).substring(2, 15)}`,
    content: `This is comment ${index + 1}`,
    timestamp: new Date(Date.now() - index * 86400000).toISOString()
  }));
};

// 生成模拟交易
const generateTrades = (): Array<Trade> => {
  return Array(20).fill(null).map((_, index) => ({
    account: `0x${Math.random().toString(16).slice(2, 42)}`,
    type: Math.random() > 0.5 ? 'buy' : 'sell',
    aptAmount: Math.random() * 1000,
    tokenAmount: Math.random() * 10000,
    timestamp: new Date(Date.now() - index * 3600000).toISOString(),
    txHash: `0x${Math.random().toString(16).slice(2, 64)}`
  }));
};

// Desert Gold 的完整数据
export const dgldData: MarketItem = {
  id: "dgld",
  name: "Desert Gold",
  symbol: "DGLD",
  price: 4567.89,
  imageUrl: "/tokens/dgld.svg",
  creator: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  description: "Digital gold from the crypto desert - A revolutionary token combining traditional gold's stability with blockchain innovation.",
  marketCap: 820000,
  volume24h: 50000,
  liquidity: 82000,
  bondingProgress: 92,
  kingProgress: 96,
  dethroneCap: 880000,
  holders: 1234,
  totalSupply: 1000000,
  comments: generateComments(),
  trades: generateTrades(),
  discord: "https://discord.gg/desertgold",
  telegram: "https://t.me/desertgold"
};

export default dgldData; 