import { MarketItem, Comment, Holder, Pool } from "@/types/market";
import { PriceSimulator } from "./priceData";
import { formatDisplayPrice } from "@/utils/format";

// 生成随机地址
function generateRandomAddress(): string {
  const chars = '0123456789abcdef';
  let address = '0x';
  for (let i = 0; i < 40; i++) {
    address += chars[Math.floor(Math.random() * chars.length)];
  }
  return address;
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
  const percentages = [
    bondingProgress,  // Bonding Curve
    12.50, 10.00, 8.50, 7.00, 6.00, 5.00, 4.50, 4.00, 3.50,
    ...Array(40).fill((100 - bondingProgress - 61) / 40)
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
  const prefixes = [
    "Digital", "Crypto", "Aptos", "Neural", "Quantum", "Solar", "Lunar", "Stellar", "Meta", "Cyber",
    "Phoenix", "Dragon", "Crystal", "Ocean", "Forest", "Mountain", "Storm", "Thunder", "Lightning", "Fire"
  ];
  
  const suffixes = [
    "Gold", "Silver", "Bronze", "Token", "Protocol", "Network", "Chain", "Finance", "Coin", "Pay",
    "Exchange", "Swap", "DAO", "DeFi", "AI", "Index", "Fund", "Verse", "World", "Universe"
  ];
  
  const animalSuffixes = [
    "Dog", "Cat", "Fox", "Bear", "Bull", "Wolf", "Lion", "Tiger", "Eagle", "Hawk",
    "Dolphin", "Whale", "Shark", "Panda", "Koala", "Dragon", "Phoenix", "Unicorn", "Griffin", "Pegasus"
  ];

  // 生成代币配置
  const tokens = Array.from({ length: 100 }, (_, index) => {
    const useAnimal = Math.random() > 0.7;
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = useAnimal 
      ? animalSuffixes[Math.floor(Math.random() * animalSuffixes.length)]
      : suffixes[Math.floor(Math.random() * suffixes.length)];
    
    const name = `${prefix} ${suffix}`;
    const symbol = (prefix.slice(0, 2) + suffix.slice(0, 2)).toUpperCase();
    
    // 生成初始价格（0.1-10 APT）
    const initialPrice = (0.1 + Math.random() * 9.9).toFixed(4);
    
    // 初始化价格模拟器
    const simulator = new PriceSimulator(Number(initialPrice));
    const pool = simulator.getPoolState();
    const bondingProgress = Math.floor(20 + Math.random() * 60);
    
    // 计算市值（USD）
    const marketCapUSD = simulator.calculateMarketCapUSD();
    const dethroneCap = marketCapUSD * (1.5 + Math.random());

    console.log(`Initializing token ${index + 1}:`, {
      symbol,
      initialPriceAPT: formatDisplayPrice(Number(initialPrice)),
      currentPriceAPT: formatDisplayPrice(pool.currentPrice),
      currentPriceUSD: formatDisplayPrice(simulator.getCurrentPriceUSD()),
      marketCapUSD: formatDisplayPrice(marketCapUSD),
      bondingProgress: `${bondingProgress}%`
    });

    return {
      id: `token-${index + 1}`,
      name,
      symbol,
      contractAddress: generateRandomAddress(),
      creator: generateRandomAddress(),
      description: `${name} - A revolutionary DeFi protocol built on Aptos, featuring an innovative bonding curve mechanism.`,
      imageUrl: `/tokens/${symbol.toLowerCase()}.svg`,
      
      // 价格相关
      initialPrice: Number(initialPrice),
      currentPrice: pool.currentPrice,
      currentPriceUSD: simulator.getCurrentPriceUSD(),
      priceChange24h: ((pool.currentPrice - Number(initialPrice)) / Number(initialPrice) * 100),
      
      // 市场相关
      marketCap: marketCapUSD,  // 使用 USD 市值
      bondingProgress,
      liquidity: pool.liquidity,
      volume24h: pool.volume24h,
      
      // 社交链接
      twitter: `https://twitter.com/${symbol.toLowerCase()}`,
      discord: `https://discord.gg/${symbol.toLowerCase()}`,
      telegram: `https://t.me/${symbol.toLowerCase()}`,
      
      // King of the Hill
      kingProgress: Math.floor(Math.random() * 100),
      dethroneCap,
      
      // 数据列表
      trades: simulator.getRecentTrades(),
      comments: generateComments(),
      holders: generateHolders(pool, bondingProgress),
      
      // 时间戳
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    };
  });

  console.log('Market data initialized:', {
    totalTokens: tokens.length,
    sampleToken: tokens[0]
  });

  return tokens;
}

export const marketData = createInitialMarketData();

// tokenList 保持不变
export const tokenList = [
  // ... tokenList 数据保持不变
];

