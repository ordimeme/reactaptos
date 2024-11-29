import { MarketItem, Trade, Comment, Holder, Pool } from "@/types/market";
import { PriceSimulator } from "./priceData";

// 生成随机地址 - 确保生成完整的地址格式
function generateRandomAddress(): string {
  const chars = '0123456789abcdef';
  let address = '0x';
  // 生成40个字符的地址（不包括0x前缀）
  for (let i = 0; i < 40; i++) {
    address += chars[Math.floor(Math.random() * chars.length)];
  }
  return address;
}

// 生成交易数据
function generateTrades(simulator: PriceSimulator, count: number = 20): Trade[] {
  return Array.from({ length: count }, () => {
    const isBuy = Math.random() > 0.4;  // 略微偏向买入
    const amount = Math.floor(Math.random() * 1000) + 100;
    const { price, slippage } = isBuy 
      ? simulator.calculateBuyPrice(amount)
      : simulator.calculateSellPrice(amount);
    const volume = price * amount;
    
    return {
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      aptAmount: price * amount,
      tokenAmount: amount,
      type: isBuy ? "buy" as const : "sell" as const,
      txHash: `0x${Math.random().toString(36).substr(2, 64)}`,
      trader: generateRandomAddress(),
      price,
      slippage,
      volume
    };
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// 生成评论数据
function generateComments(count: number = 10): Comment[] {
  const comments = [
    "Great bonding curve design! 🚀",
    "Love the tokenomics 💎",
    "Solid fundamentals",
    "Best project on Aptos",
    "Amazing potential",
    "Can't wait for the next phase",
    "Strong community backing",
    "Revolutionary mechanism",
    "Perfect execution",
    "Game changer!"
  ];

  return Array.from({ length: count }, () => ({
    id: `comment_${Math.random().toString(36).substr(2, 9)}`,
    content: comments[Math.floor(Math.random() * comments.length)],
    timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    author: generateRandomAddress()
  })).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// 生成持有者数据
function generateHolders(pool: Pool, bondingProgress: number): Holder[] {
  // 为确保总和为100%，预先计算每个持有者的百分比
  const percentages = [
    bondingProgress,  // Bonding Curve
    12.50, 10.00, 8.50, 7.00, 6.00, 5.00, 4.50, 4.00, 3.50,
    ...Array(40).fill((100 - bondingProgress - 61) / 40)  // 剩余百分比平均分配
  ];

  return percentages.map((percentage, index) => ({
    address: index === 0 ? "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" : generateRandomAddress(),
    balance: Math.floor(pool.totalSupply * (percentage / 100)),
    percentage,
    type: index === 0 ? "bonding curve" : "regular"
  }));
}

// 生成初始市场数据
export function createInitialMarketData(): MarketItem[] {
  const tokens = [
    { name: "Digital Gold", symbol: "DGLD", initialPrice: 4.567 },
    { name: "Crystal Token", symbol: "CRYS", initialPrice: 2.345 },
    { name: "Phoenix", symbol: "PHNX", initialPrice: 3.456 },
    { name: "Neural Network", symbol: "NNET", initialPrice: 1.234 },
    { name: "Time Protocol", symbol: "TIME", initialPrice: 5.678 },
    { name: "Stream Finance", symbol: "STRM", initialPrice: 2.789 },
    { name: "Crypto Dragon", symbol: "CDRG", initialPrice: 3.901 },
    { name: "Aptos Dog", symbol: "ADOG", initialPrice: 1.567 },
    { name: "Aptos Fox", symbol: "AFOX", initialPrice: 2.678 },
    { name: "Crypto Ray", symbol: "CRAY", initialPrice: 3.789 }
  ];

  return tokens.map((token, index) => {
    // 初始化价格模拟器
    const simulator = new PriceSimulator(token.initialPrice);
    const pool = simulator.getPoolState();
    const bondingProgress = Math.floor(20 + Math.random() * 60);  // 20-80%
    
    // 生成不同的合约地址和创建者地址
    const contractAddress = generateRandomAddress();
    const creatorAddress = generateRandomAddress();
    
    // 计算市值和目标市值
    const marketCap = pool.currentPrice * pool.currentSupply;
    const dethroneCap = marketCap * (1.5 + Math.random());  // 1.5-2.5倍当前市值
    
    return {
      id: `token-${index + 1}`,
      name: token.name,
      symbol: token.symbol,
      contractAddress, // 添加合约地址
      creator: creatorAddress, // 创建者地址
      description: `${token.name} - A revolutionary DeFi protocol built on Aptos, featuring an innovative bonding curve mechanism.`,
      imageUrl: `/tokens/${token.symbol.toLowerCase()}.svg`,
      
      // 价格相关
      initialPrice: token.initialPrice,
      currentPrice: pool.currentPrice,
      priceChange24h: ((pool.currentPrice - token.initialPrice) / token.initialPrice * 100),
      
      // 市场相关
      marketCap,
      bondingProgress,
      liquidity: pool.liquidity,
      volume24h: pool.volume24h,
      
      // 社交链接
      twitter: `https://twitter.com/${token.symbol.toLowerCase()}`,
      discord: `https://discord.gg/${token.symbol.toLowerCase()}`,
      telegram: `https://t.me/${token.symbol.toLowerCase()}`,
      
      // King of the Hill
      kingProgress: Math.floor(Math.random() * 100),
      dethroneCap,
      
      // 数据列表
      trades: generateTrades(simulator),
      comments: generateComments(),
      holders: generateHolders(pool, bondingProgress),
      
      // 时间戳
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    };
  });
}

export const marketData = createInitialMarketData();

// tokenList 保持不变
export const tokenList = [
  // ... tokenList 数据保持不变
];

