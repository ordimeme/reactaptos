// ... 其他代码保持不变

// 简化的市场数据，包含所有代币的基本信息
const tokenList = [
  { name: "Woodstock", symbol: "WOODSTOCK", imageUrl: "/tokens/woodstock.svg" },
  { name: "Doge Plus", symbol: "DOGE+", imageUrl: "/tokens/doge.svg" },
  { name: "Crypto Cat", symbol: "CCAT", imageUrl: "/tokens/ccat.svg" },
  { name: "Bolt Finance", symbol: "BOLT", imageUrl: "/tokens/bolt.svg" },
  { name: "Dawn Protocol", symbol: "DAWN", imageUrl: "/tokens/dawn.svg" },
  { name: "Flow Token", symbol: "FLOW", imageUrl: "/tokens/flow.svg" },
  { name: "Fire Token", symbol: "FIRE", imageUrl: "/tokens/fire.svg" },
  { name: "Star Light", symbol: "STAR", imageUrl: "/tokens/star.svg" },
  { name: "Pepe Classic", symbol: "PEPE", imageUrl: "/tokens/pepe.svg" },
  { name: "Moon Shot", symbol: "MOON", imageUrl: "/tokens/moon.svg" },
  { name: "Meta World", symbol: "META", imageUrl: "/tokens/meta.svg" },
  { name: "Pixel Art", symbol: "PIXEL", imageUrl: "/tokens/pixel.svg" },
  { name: "Cyber Punk", symbol: "PUNK", imageUrl: "/tokens/punk.svg" },
  { name: "Galaxy Quest", symbol: "GLXY", imageUrl: "/tokens/glxy.svg" },
  { name: "Diamond Hands", symbol: "DIAM", imageUrl: "/tokens/diam.svg" },
  { name: "Quantum Leap", symbol: "QNTM", imageUrl: "/tokens/qntm.svg" },
  { name: "Solar Power", symbol: "SOLR", imageUrl: "/tokens/solr.svg" },
  { name: "Neural Net", symbol: "NNET", imageUrl: "/tokens/nnet.svg" },
  { name: "Rocket Fuel", symbol: "FUEL", imageUrl: "/tokens/fuel.svg" },
  { name: "Cosmic Ray", symbol: "CRAY", imageUrl: "/tokens/cray.svg" },
  { name: "Black Hole", symbol: "HOLE", imageUrl: "/tokens/hole.svg" },
  { name: "Time Lock", symbol: "TIME", imageUrl: "/tokens/time.svg" },
  { name: "Infinity Edge", symbol: "EDGE", imageUrl: "/tokens/edge.svg" },
  { name: "Genesis One", symbol: "GEN1", imageUrl: "/tokens/gen1.svg" },
  { name: "Astro Dog", symbol: "ADOG", imageUrl: "/tokens/adog.svg" },
  { name: "Cyber Dragon", symbol: "CDRG", imageUrl: "/tokens/cdrg.svg" },
  { name: "Magic Portal", symbol: "PRTL", imageUrl: "/tokens/prtl.svg" },
  { name: "Phoenix Rise", symbol: "PHNX", imageUrl: "/tokens/phnx.svg" },
  { name: "Crystal Core", symbol: "CRYS", imageUrl: "/tokens/crys.svg" },
  { name: "Ocean Wave", symbol: "WAVE", imageUrl: "/tokens/wave.svg" },
  { name: "Desert Gold", symbol: "DGLD", imageUrl: "/tokens/dgld.svg" },
  { name: "Arctic Fox", symbol: "AFOX", imageUrl: "/tokens/afox.svg" },
  { name: "Jungle Beat", symbol: "JBEAT", imageUrl: "/tokens/jbeat.svg" },
  { name: "Storm Cloud", symbol: "STRM", imageUrl: "/tokens/strm.svg" }
];

export default { tokenList };

export interface Comment {
  id: number;
  user: string;
  avatar: string;
  content: string;
  timestamp: string;
}

export interface Holder {
  address: string;
  percentage: number;
  type?: string;
}

export interface Trade {
  id: number;
  account: string;
  type: "buy" | "sell";
  aptAmount: number;
  tokenAmount: number;
  timestamp: string;
  txHash: string;
}

export interface MarketItem {
  id: string;
  name: string;
  symbol: string;
  price: number;
  imageUrl: string;
  creator: string;
  description: string;
  timestamp: string;
  marketCap: number;
  bondingProgress: number;
  kingProgress: number;
  dethroneCap: number;
  comments: Comment[];
  holders: Holder[];
  trades: Trade[];
}

// 生成不同时间跨度的测试数据
function generateTestTimestamps() {
  const now = new Date();
  return {
    seconds: new Date(now.getTime() - 45 * 1000).toISOString(), // 45秒前
    minutes: new Date(now.getTime() - 15 * 60 * 1000).toISOString(), // 15分钟前
    hours: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(), // 4小时前
    days: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3天前
    weeks: new Date(now.getTime() - 2 * 7 * 24 * 60 * 60 * 1000).toISOString(), // 2周前
    months: new Date(now.getTime() - 3 * 30 * 24 * 60 * 60 * 1000).toISOString(), // 3个月前
    years: new Date(now.getTime() - 400 * 24 * 60 * 60 * 1000).toISOString(), // 超过1年
  };
}

// 生成交易记录
function generateTradesWithVariedTimestamps(count: number, priceRange: { min: number; max: number }): Trade[] {
  return Array.from({ length: count }, (_, i) => {
    const tradeTime = new Date(Date.now() - i * (Math.random() * 1000 * 60 * 60 * 24));
    const price = Number((Math.random() * (priceRange.max - priceRange.min) + priceRange.min).toFixed(2));
    const tradeType: "buy" | "sell" = Math.random() > 0.5 ? "buy" : "sell";

    return {
      id: i + 1,
      account: `0x${Math.random().toString(36).substring(2, 8)}...${Math.random().toString(36).substring(2, 8)}`,
      type: tradeType,
      aptAmount: price,
      tokenAmount: Number((Math.random() * 50).toFixed(2)),
      timestamp: tradeTime.toISOString(),
      txHash: `0x${Math.random().toString(36).substring(2, 15)}`
    };
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// 生成评论
function generateComments(count: number, timeRange: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    user: `User${Math.floor(Math.random() * 1000)}`,
    avatar: `/avatars/avatar${Math.floor(Math.random() * 10) + 1}.png`,
    content: `This is comment ${i + 1}. ${Math.random() > 0.5 ? '🚀 To the moon!' : '💎 Diamond hands!'}`,
    timestamp: new Date(Date.now() - Math.random() * timeRange).toISOString()
  })).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// 生成持有者数据
function generateHolders(count: number, bondingCurvePercentage: number) {
  const holders = Array.from({ length: count }, (_, i) => ({
    address: `0x${Math.random().toString(36).substring(2, 8)}...${Math.random().toString(36).substring(2, 8)}`,
    percentage: Number((Math.random() * 10 + 1).toFixed(2)),
    type: i === 0 ? "(bonding curve)" : undefined
  }));
  
  // 确保绑定曲线的百分比正确
  holders[0].percentage = bondingCurvePercentage;
  return holders;
}

const timestamps = generateTestTimestamps();

// 示例数据生成
export const marketData: MarketItem[] = [
  // 0-25% 组 (8个)
  {
    id: "1",
    name: "Woodstock",
    symbol: "WOODSTOCK",
    price: 500.00,
    imageUrl: "/tokens/woodstock.svg",
    creator: "0x1234...5678",
    description: "Woodstock is a fictional character in Charles M. Schulz's comic strip Peanuts.",
    timestamp: timestamps.seconds,
    marketCap: 6900,
    bondingProgress: 15,
    kingProgress: 70,
    dethroneCap: 45382,
    comments: generateComments(10, 24 * 60 * 60 * 1000),
    holders: generateHolders(30, 15),
    trades: generateTradesWithVariedTimestamps(50, { min: 450, max: 550 }),
  },
  {
    id: "2",
    name: "Doge Plus",
    symbol: "DOGE+",
    price: 320.50,
    imageUrl: "/tokens/DOGE+.svg",
    creator: "0xdoge...plus",
    description: "Much wow, very plus!",
    timestamp: timestamps.minutes,
    marketCap: 12000,
    bondingProgress: 8,
    kingProgress: 45,
    dethroneCap: 35000,
    comments: generateComments(15, 12 * 60 * 60 * 1000),
    holders: generateHolders(25, 8),
    trades: generateTradesWithVariedTimestamps(40, { min: 300, max: 350 }),
  },
  // ... 继续添加6个 0-25% 区间的代币

  // 25-50% 组 (8个)
  {
    id: "9",
    name: "Pepe Classic",
    symbol: "PEPE",
    price: 420.69,
    imageUrl: "/tokens/PEPE.svg",
    creator: "0xabcd...efgh",
    description: "The original meme token that started it all",
    timestamp: timestamps.hours,
    marketCap: 93729,
    bondingProgress: 35,
    kingProgress: 65,
    dethroneCap: 78234,
    comments: generateComments(25, 7 * 24 * 60 * 60 * 1000),
    holders: generateHolders(45, 35),
    trades: generateTradesWithVariedTimestamps(100, { min: 400, max: 450 }),
  },
  {
    id: "10",
    name: "Moon Shot",
    symbol: "MOON",
    price: 888.88,
    imageUrl: "/tokens/MOON.svg",
    creator: "0xmoon...shot",
    description: "To the moon and beyond!",
    timestamp: timestamps.days,
    marketCap: 150000,
    bondingProgress: 42,
    kingProgress: 75,
    dethroneCap: 95000,
    comments: generateComments(30, 14 * 24 * 60 * 60 * 1000),
    holders: generateHolders(60, 42),
    trades: generateTradesWithVariedTimestamps(120, { min: 800, max: 900 }),
  },
  // ... 继续添加6个 25-50% 区间的代币

  // 50-75% 组 (8个)
  {
    id: "17",
    name: "Diamond Hands",
    symbol: "DIAM",
    price: 1337.00,
    imageUrl: "/tokens/DIAM.svg",
    creator: "0xdiam...hand",
    description: "HODL forever! 💎🙌",
    timestamp: timestamps.weeks,
    marketCap: 250000,
    bondingProgress: 68,
    kingProgress: 85,
    dethroneCap: 180000,
    comments: generateComments(40, 30 * 24 * 60 * 60 * 1000),
    holders: generateHolders(80, 68),
    trades: generateTradesWithVariedTimestamps(150, { min: 1200, max: 1400 }),
  },
  // ... 继续添加7个 50-75% 区间的代币

  // 75-100% 组 (6个)
  {
    id: "25",
    name: "Rocket Fuel",
    symbol: "FUEL",
    price: 2500.00,
    imageUrl: "/tokens/FUEL.svg",
    creator: "0xrock...fuel",
    description: "Powering the next generation of memes",
    timestamp: timestamps.months,
    marketCap: 500000,
    bondingProgress: 92,
    kingProgress: 95,
    dethroneCap: 450000,
    comments: generateComments(50, 60 * 24 * 60 * 60 * 1000),
    holders: generateHolders(100, 92),
    trades: generateTradesWithVariedTimestamps(200, { min: 2300, max: 2700 }),
  },
  // ... 继续添加5个 75-100% 区间的代币

  // 继续添加 0-25% 组的代币
  {
    id: "3",
    name: "Crypto Cat",
    symbol: "CCAT",
    price: 245.75,
    imageUrl: "/tokens/CCAT.svg",
    creator: "0xccat...meow",
    description: "The purr-fect token for cat lovers!",
    timestamp: timestamps.hours,
    marketCap: 15000,
    bondingProgress: 12,
    kingProgress: 40,
    dethroneCap: 38000,
    comments: generateComments(20, 36 * 60 * 60 * 1000),
    holders: generateHolders(35, 12),
    trades: generateTradesWithVariedTimestamps(60, { min: 220, max: 270 }),
  },
  {
    id: "4",
    name: "Bolt Finance",
    symbol: "BOLT",
    price: 180.25,
    imageUrl: "/tokens/BOLT.svg",
    creator: "0xbolt...fast",
    description: "Lightning fast DeFi solutions",
    timestamp: timestamps.days,
    marketCap: 18500,
    bondingProgress: 20,
    kingProgress: 55,
    dethroneCap: 42000,
    comments: generateComments(25, 48 * 60 * 60 * 1000),
    holders: generateHolders(40, 20),
    trades: generateTradesWithVariedTimestamps(70, { min: 160, max: 200 }),
  },
  {
    id: "5",
    name: "Dawn Protocol",
    symbol: "DAWN",
    price: 156.80,
    imageUrl: "/tokens/DAWN.svg",
    creator: "0xdawn...rise",
    description: "A new dawn for decentralized gaming",
    timestamp: timestamps.weeks,
    marketCap: 21000,
    bondingProgress: 18,
    kingProgress: 48,
    dethroneCap: 45000,
    comments: generateComments(30, 72 * 60 * 60 * 1000),
    holders: generateHolders(45, 18),
    trades: generateTradesWithVariedTimestamps(80, { min: 140, max: 170 }),
  },
  {
    id: "6",
    name: "Flow Token",
    symbol: "FLOW",
    price: 135.90,
    imageUrl: "/tokens/FLOW.svg",
    creator: "0xflow...move",
    description: "Seamless cross-chain liquidity",
    timestamp: timestamps.months,
    marketCap: 24000,
    bondingProgress: 22,
    kingProgress: 58,
    dethroneCap: 48000,
    comments: generateComments(35, 96 * 60 * 60 * 1000),
    holders: generateHolders(50, 22),
    trades: generateTradesWithVariedTimestamps(90, { min: 120, max: 150 }),
  },
  {
    id: "7",
    name: "Fire Token",
    symbol: "FIRE",
    price: 198.45,
    imageUrl: "/tokens/FIRE.svg",
    creator: "0xfire...burn",
    description: "Burning through barriers in DeFi",
    timestamp: timestamps.minutes,
    marketCap: 27000,
    bondingProgress: 16,
    kingProgress: 52,
    dethroneCap: 51000,
    comments: generateComments(40, 120 * 60 * 60 * 1000),
    holders: generateHolders(55, 16),
    trades: generateTradesWithVariedTimestamps(100, { min: 180, max: 220 }),
  },
  {
    id: "8",
    name: "Star Light",
    symbol: "STAR",
    price: 167.30,
    imageUrl: "/tokens/STAR.svg",
    creator: "0xstar...lite",
    description: "Illuminating the path to decentralization",
    timestamp: timestamps.seconds,
    marketCap: 30000,
    bondingProgress: 24,
    kingProgress: 62,
    dethroneCap: 54000,
    comments: generateComments(45, 144 * 60 * 60 * 1000),
    holders: generateHolders(60, 24),
    trades: generateTradesWithVariedTimestamps(110, { min: 150, max: 180 }),
  },

  // 继续添加 25-50% 组的代币
  {
    id: "11",
    name: "Meta World",
    symbol: "META",
    price: 445.60,
    imageUrl: "/tokens/META.svg",
    creator: "0xmeta...vers",
    description: "Building the future of virtual worlds",
    timestamp: timestamps.hours,
    marketCap: 120000,
    bondingProgress: 38,
    kingProgress: 72,
    dethroneCap: 85000,
    comments: generateComments(50, 168 * 60 * 60 * 1000),
    holders: generateHolders(70, 38),
    trades: generateTradesWithVariedTimestamps(130, { min: 400, max: 480 }),
  },
  // ... 继续添加更多代币数据，直到达到30个

  // 继续添加 25-50% 组的代币
  {
    id: "12",
    name: "Pixel Art",
    symbol: "PIXEL",
    price: 567.80,
    imageUrl: "/tokens/PIXEL.svg",
    creator: "0xpixl...arts",
    description: "NFT meets DeFi in pixel perfection",
    timestamp: timestamps.days,
    marketCap: 135000,
    bondingProgress: 45,
    kingProgress: 68,
    dethroneCap: 92000,
    comments: generateComments(35, 192 * 60 * 60 * 1000),
    holders: generateHolders(75, 45),
    trades: generateTradesWithVariedTimestamps(140, { min: 520, max: 600 }),
  },
  {
    id: "13",
    name: "Cyber Punk",
    symbol: "PUNK",
    price: 678.90,
    imageUrl: "/tokens/PUNK.svg",
    creator: "0xcybr...punk",
    description: "Future of digital rebellion",
    timestamp: timestamps.weeks,
    marketCap: 142000,
    bondingProgress: 32,
    kingProgress: 70,
    dethroneCap: 98000,
    comments: generateComments(42, 216 * 60 * 60 * 1000),
    holders: generateHolders(82, 32),
    trades: generateTradesWithVariedTimestamps(160, { min: 650, max: 700 }),
  },
  {
    id: "14",
    name: "Galaxy Quest",
    symbol: "GLXY",
    price: 789.12,
    imageUrl: "/tokens/GLXY.svg",
    creator: "0xgalx...qust",
    description: "Explore the crypto universe",
    timestamp: timestamps.months,
    marketCap: 158000,
    bondingProgress: 28,
    kingProgress: 65,
    dethroneCap: 105000,
    comments: generateComments(48, 240 * 60 * 60 * 1000),
    holders: generateHolders(88, 28),
    trades: generateTradesWithVariedTimestamps(180, { min: 750, max: 800 }),
  },

  // 50-75% 组的代币
  {
    id: "18",
    name: "Quantum Leap",
    symbol: "QNTM",
    price: 1567.00,
    imageUrl: "/tokens/QNTM.svg",
    creator: "0xqntm...leap",
    description: "Quantum computing meets blockchain",
    timestamp: timestamps.hours,
    marketCap: 280000,
    bondingProgress: 72,
    kingProgress: 88,
    dethroneCap: 195000,
    comments: generateComments(55, 264 * 60 * 60 * 1000),
    holders: generateHolders(95, 72),
    trades: generateTradesWithVariedTimestamps(220, { min: 1500, max: 1600 }),
  },
  {
    id: "19",
    name: "Solar Power",
    symbol: "SOLR",
    price: 1789.00,
    imageUrl: "/tokens/SOLR.svg",
    creator: "0xsolr...powr",
    description: "Sustainable blockchain energy",
    timestamp: timestamps.days,
    marketCap: 310000,
    bondingProgress: 65,
    kingProgress: 82,
    dethroneCap: 220000,
    comments: generateComments(62, 288 * 60 * 60 * 1000),
    holders: generateHolders(102, 65),
    trades: generateTradesWithVariedTimestamps(240, { min: 1700, max: 1800 }),
  },
  {
    id: "20",
    name: "Neural Net",
    symbol: "NNET",
    price: 1890.00,
    imageUrl: "/tokens/NNET.svg",
    creator: "0xneur...nets",
    description: "AI-powered DeFi solutions",
    timestamp: timestamps.weeks,
    marketCap: 340000,
    bondingProgress: 58,
    kingProgress: 78,
    dethroneCap: 245000,
    comments: generateComments(68, 312 * 60 * 60 * 1000),
    holders: generateHolders(108, 58),
    trades: generateTradesWithVariedTimestamps(260, { min: 1800, max: 1900 }),
  },

  // 75-100% 组的代币
  {
    id: "26",
    name: "Cosmic Ray",
    symbol: "CRAY",
    price: 2890.00,
    imageUrl: "/tokens/CRAY.svg",
    creator: "0xcray...rays",
    description: "Interstellar blockchain technology",
    timestamp: timestamps.days,
    marketCap: 580000,
    bondingProgress: 88,
    kingProgress: 92,
    dethroneCap: 520000,
    comments: generateComments(75, 336 * 60 * 60 * 1000),
    holders: generateHolders(115, 88),
    trades: generateTradesWithVariedTimestamps(280, { min: 2800, max: 2900 }),
  },
  {
    id: "27",
    name: "Black Hole",
    symbol: "HOLE",
    price: 3200.00,
    imageUrl: "/tokens/HOLE.svg",
    creator: "0xhole...void",
    description: "The ultimate token sink",
    timestamp: timestamps.weeks,
    marketCap: 650000,
    bondingProgress: 95,
    kingProgress: 98,
    dethroneCap: 580000,
    comments: generateComments(82, 360 * 60 * 60 * 1000),
    holders: generateHolders(122, 95),
    trades: generateTradesWithVariedTimestamps(300, { min: 3100, max: 3300 }),
  },
  {
    id: "28",
    name: "Time Lock",
    symbol: "TIME",
    price: 3500.00,
    imageUrl: "/tokens/TIME.svg",
    creator: "0xtime...lock",
    description: "Time-based yield optimization",
    timestamp: timestamps.months,
    marketCap: 720000,
    bondingProgress: 85,
    kingProgress: 90,
    dethroneCap: 650000,
    comments: generateComments(88, 384 * 60 * 60 * 1000),
    holders: generateHolders(128, 85),
    trades: generateTradesWithVariedTimestamps(320, { min: 3400, max: 3600 }),
  },
  {
    id: "29",
    name: "Infinity Edge",
    symbol: "EDGE",
    price: 3800.00,
    imageUrl: "/tokens/EDGE.svg",
    creator: "0xedge...infn",
    description: "Pushing the boundaries of DeFi",
    timestamp: timestamps.years,
    marketCap: 790000,
    bondingProgress: 82,
    kingProgress: 88,
    dethroneCap: 720000,
    comments: generateComments(95, 408 * 60 * 60 * 1000),
    holders: generateHolders(135, 82),
    trades: generateTradesWithVariedTimestamps(340, { min: 3700, max: 3900 }),
  },
  {
    id: "30",
    name: "Genesis One",
    symbol: "GEN1",
    price: 4200.00,
    imageUrl: "/tokens/GEN1.svg",
    creator: "0xgen1...zero",
    description: "The beginning of a new era",
    timestamp: timestamps.seconds,
    marketCap: 850000,
    bondingProgress: 78,
    kingProgress: 85,
    dethroneCap: 780000,
    comments: generateComments(100, 432 * 60 * 60 * 1000),
    holders: generateHolders(142, 78),
    trades: generateTradesWithVariedTimestamps(360, { min: 4000, max: 4400 }),
  },

  // 继续添加新的代币数据
  {
    id: "31",
    name: "Astro Dog",
    symbol: "ADOG",
    price: 1234.56,
    imageUrl: "/tokens/ADOG.svg",
    creator: "0xastr...dog1",
    description: "The first dog in crypto space!",
    timestamp: timestamps.minutes,
    marketCap: 280000,
    bondingProgress: 45,
    kingProgress: 75,
    dethroneCap: 320000,
    comments: generateComments(65, 48 * 60 * 60 * 1000),
    holders: generateHolders(95, 45),
    trades: generateTradesWithVariedTimestamps(180, { min: 1200, max: 1300 }),
  },
  {
    id: "32",
    name: "Cyber Dragon",
    symbol: "CDRG",
    price: 2345.67,
    imageUrl: "/tokens/CDRG.svg",
    creator: "0xcydr...gon2",
    description: "Digital dragons unleashed",
    timestamp: timestamps.hours,
    marketCap: 420000,
    bondingProgress: 68,
    kingProgress: 82,
    dethroneCap: 480000,
    comments: generateComments(75, 72 * 60 * 60 * 1000),
    holders: generateHolders(110, 68),
    trades: generateTradesWithVariedTimestamps(200, { min: 2300, max: 2400 }),
  },
  {
    id: "33",
    name: "Magic Portal",
    symbol: "PRTL",
    price: 890.12,
    imageUrl: "/tokens/PRTL.svg",
    creator: "0xmgic...prtl",
    description: "Your gateway to magical returns",
    timestamp: timestamps.days,
    marketCap: 180000,
    bondingProgress: 32,
    kingProgress: 58,
    dethroneCap: 220000,
    comments: generateComments(55, 96 * 60 * 60 * 1000),
    holders: generateHolders(85, 32),
    trades: generateTradesWithVariedTimestamps(150, { min: 850, max: 950 }),
  },
  {
    id: "34",
    name: "Phoenix Rise",
    symbol: "PHNX",
    price: 3456.78,
    imageUrl: "/tokens/PHNX.svg",
    creator: "0xrise...phnx",
    description: "Rising from the ashes of old finance",
    timestamp: timestamps.weeks,
    marketCap: 680000,
    bondingProgress: 88,
    kingProgress: 92,
    dethroneCap: 720000,
    comments: generateComments(85, 120 * 60 * 60 * 1000),
    holders: generateHolders(125, 88),
    trades: generateTradesWithVariedTimestamps(220, { min: 3400, max: 3500 }),
  },
  {
    id: "35",
    name: "Crystal Core",
    symbol: "CRYS",
    price: 567.89,
    imageUrl: "/tokens/CRYS.svg",
    creator: "0xcrys...core",
    description: "Pure crystallized blockchain technology",
    timestamp: timestamps.months,
    marketCap: 145000,
    bondingProgress: 15,
    kingProgress: 45,
    dethroneCap: 180000,
    comments: generateComments(45, 144 * 60 * 60 * 1000),
    holders: generateHolders(70, 15),
    trades: generateTradesWithVariedTimestamps(130, { min: 550, max: 600 }),
  },
  {
    id: "36",
    name: "Ocean Wave",
    symbol: "WAVE",
    price: 789.01,
    imageUrl: "/tokens/WAVE.svg",
    creator: "0xwave...flow",
    description: "Riding the waves of DeFi innovation",
    timestamp: timestamps.seconds,
    marketCap: 195000,
    bondingProgress: 28,
    kingProgress: 52,
    dethroneCap: 240000,
    comments: generateComments(60, 168 * 60 * 60 * 1000),
    holders: generateHolders(88, 28),
    trades: generateTradesWithVariedTimestamps(160, { min: 750, max: 800 }),
  },
  {
    id: "37",
    name: "Desert Gold",
    symbol: "DGLD",
    price: 4567.89,
    imageUrl: "/tokens/DGLD.svg",
    creator: "0xgold...sand",
    description: "Digital gold from the crypto desert",
    timestamp: timestamps.minutes,
    marketCap: 820000,
    bondingProgress: 92,
    kingProgress: 96,
    dethroneCap: 880000,
    comments: generateComments(95, 192 * 60 * 60 * 1000),
    holders: generateHolders(140, 92),
    trades: generateTradesWithVariedTimestamps(240, { min: 4500, max: 4600 }),
  },
  {
    id: "38",
    name: "Arctic Fox",
    symbol: "AFOX",
    price: 678.90,
    imageUrl: "/tokens/AFOX.svg",
    creator: "0xfox...cold",
    description: "Cool as ice, swift as lightning",
    timestamp: timestamps.hours,
    marketCap: 165000,
    bondingProgress: 22,
    kingProgress: 48,
    dethroneCap: 200000,
    comments: generateComments(50, 216 * 60 * 60 * 1000),
    holders: generateHolders(78, 22),
    trades: generateTradesWithVariedTimestamps(140, { min: 650, max: 700 }),
  },
  {
    id: "39",
    name: "Jungle Beat",
    symbol: "JBEAT",
    price: 1234.56,
    imageUrl: "/tokens/JBEAT.svg",
    creator: "0xbeat...wild",
    description: "Wild returns in the crypto jungle",
    timestamp: timestamps.days,
    marketCap: 245000,
    bondingProgress: 52,
    kingProgress: 72,
    dethroneCap: 280000,
    comments: generateComments(70, 240 * 60 * 60 * 1000),
    holders: generateHolders(98, 52),
    trades: generateTradesWithVariedTimestamps(180, { min: 1200, max: 1300 }),
  },
  {
    id: "40",
    name: "Storm Cloud",
    symbol: "STRM",
    price: 2345.67,
    imageUrl: "/tokens/STRM.svg",
    creator: "0xstrm...rain",
    description: "Lightning fast transactions in the cloud",
    timestamp: timestamps.weeks,
    marketCap: 380000,
    bondingProgress: 75,
    kingProgress: 85,
    dethroneCap: 420000,
    comments: generateComments(80, 264 * 60 * 60 * 1000),
    holders: generateHolders(115, 75),
    trades: generateTradesWithVariedTimestamps(200, { min: 2300, max: 2400 }),
  }
]; 

