import { MarketItem } from "@/types/market";
import { PriceSimulator } from "./priceData";

// 初始化 Bonding Curve
const bondingCurve = new PriceSimulator(4567.89);

// Desert Gold 的完整数据
export const dgldData: MarketItem = {
  id: "dgld-1",
  name: "Digital Gold",
  symbol: "DGLD",
  contractAddress: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  creator: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  description: "Digital gold from the crypto desert - A revolutionary token combining traditional gold's stability with blockchain innovation.",
  imageUrl: "/tokens/dgld.svg",
  
  // 价格相关
  initialPrice: bondingCurve.getCurrentPrice(),
  currentPrice: bondingCurve.getCurrentPrice(),
  priceChange24h: 5.2,
  
  // 市场相关
  marketCap: bondingCurve.getCurrentPrice() * bondingCurve.getPoolState().currentSupply,
  bondingProgress: (bondingCurve.getPoolState().currentSupply / bondingCurve.getPoolState().totalSupply) * 100,
  liquidity: bondingCurve.getPoolState().aptReserve * 2,
  volume24h: 1234567.89,
  
  // 社交媒体链接
  twitter: "https://twitter.com/digitalgold",
  discord: "https://discord.gg/digitalgold",
  telegram: "https://t.me/digitalgold",
  
  // King of the Hill
  kingProgress: 45,
  dethroneCap: bondingCurve.getCurrentPrice() * bondingCurve.getPoolState().currentSupply * 2,
  
  // 生成模拟交易数据
  trades: Array.from({ length: 20 }, () => {
    const isBuy = Math.random() > 0.4;
    const amount = Math.floor(Math.random() * 1000) + 100;
    const { price, slippage } = isBuy 
      ? bondingCurve.calculateBuyPrice(amount)
      : bondingCurve.calculateSellPrice(amount);
    const volume = price * amount;
    
    return {
      trader: `0x${Math.random().toString(36).substr(2, 40)}`,
      type: isBuy ? "buy" : "sell" as const,
      aptAmount: amount * price,
      tokenAmount: amount,
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      txHash: `0x${Math.random().toString(36).substr(2, 64)}`,
      price,
      slippage,
      volume
    };
  }),

  // 生成模拟评论数据
  comments: Array.from({ length: 10 }, () => ({
    id: `${Math.random().toString(36).substr(2, 9)}`,
    content: [
      "Great project with solid fundamentals!",
      "The bonding curve mechanism is genius",
      "Love the tokenomics design",
      "This is what web3 needs",
      "Revolutionary approach to digital gold"
    ][Math.floor(Math.random() * 5)],
    timestamp: new Date(Date.now() - Math.random() * 1000 * 60 * 30).toISOString(),
    author: `0x${Math.random().toString(36).substr(2, 40)}`
  })),

  // 生成持有者数据
  holders: [
    {
      address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      balance: bondingCurve.getPoolState().tokenReserve,
      percentage: (bondingCurve.getPoolState().currentSupply / bondingCurve.getPoolState().totalSupply) * 100,
      type: "bonding curve" as const
    },
    ...Array.from({ length: 9 }, () => ({
      address: `0x${Math.random().toString(36).substr(2, 40)}`,
      balance: Math.floor(Math.random() * 10000) + 1000,
      percentage: (100 - (bondingCurve.getPoolState().currentSupply / bondingCurve.getPoolState().totalSupply) * 100) / 10,
      type: "regular" as const
    }))
  ],
  
  // 时间戳
  timestamp: new Date().toISOString()
};

export default dgldData; 