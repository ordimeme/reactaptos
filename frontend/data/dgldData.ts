import { MarketItem } from "@/types/market";

// 生成随机地址
const generateRandomAddress = () => {
  return `0x${Math.random().toString(36).substring(2, 8)}...${Math.random().toString(36).substring(2, 8)}`;
};

// 生成过去的时间戳
const generatePastTimestamp = (hoursAgo: number) => {
  return new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString();
};

// 生成模拟评论
const generateComments = () => {
  const comments = [
    "Desert Gold to the moon! 🚀",
    "Strong fundamentals, great team! 💪",
    "DGLD is the future of digital gold 🌟",
    "Holding since day one 💎🙌",
    "Best performing token in my portfolio",
    "The roadmap looks promising",
    "Can't wait for the next update",
    "This is just the beginning",
    "Accumulating more on every dip",
    "Desert Gold ecosystem is growing fast"
  ];

  return comments.map((content, index) => ({
    id: index + 1,
    user: generateRandomAddress(),
    avatar: `/avatars/avatar${Math.floor(Math.random() * 10) + 1}.png`,
    content,
    timestamp: generatePastTimestamp(Math.random() * 24 * 7) // 随���7天内的时间
  }));
};

// 生成模拟交易
const generateTrades = () => {
  const trades = [];
  let currentPrice = 4567.89; // 当前价格

  for (let i = 0; i < 50; i++) {
    const type: "buy" | "sell" = Math.random() > 0.5 ? "buy" : "sell";
    const tokenAmount = Number((Math.random() * 10 + 1).toFixed(3));
    const aptAmount = Number((tokenAmount * currentPrice).toFixed(3));

    trades.push({
      id: i + 1,
      account: generateRandomAddress(),
      type,
      aptAmount,
      tokenAmount,
      timestamp: generatePastTimestamp(i * 0.5), // 每半小时一笔交易
      txHash: `0x${Math.random().toString(36).substring(2, 15)}`
    });

    // 根据交易类型微调价格
    currentPrice *= type === "buy" ? 1.001 : 0.999;
  }

  return trades.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

// 生成持有者数据
const generateHolders = () => {
  const holders = [];
  let remainingPercentage = 100;

  // 绑定曲线持有
  holders.push({
    address: "0xDGLD...bond",
    percentage: 92,
    type: "(bonding curve)"
  });
  remainingPercentage -= 92;

  // 生成其他持有者
  for (let i = 0; i < 19; i++) {
    const percentage = Number((remainingPercentage / 20).toFixed(2));
    holders.push({
      address: generateRandomAddress(),
      percentage,
      type: undefined
    });
  }

  return holders;
};

// Desert Gold 的完整数据
export const dgldData: MarketItem = {
  id: "37",
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
  comments: generateComments(),
  holders: generateHolders(),
  trades: generateTrades()
};

export default dgldData; 