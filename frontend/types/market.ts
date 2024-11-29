export type ChartTheme = 'dark' | 'light';

export interface PriceData {
  time: string;
  open: string;
  high: string;
  low: string;
  close: string;
  price24h: string;
  time24h: string;
  change24h: string;
  changePercent: string;
}

export interface Trade {
  timestamp: string;
  aptAmount: number;
  tokenAmount: number;
  type: 'buy' | 'sell';
  txHash: string;
  trader: string;
  price: number;
  slippage: number;
  volume?: number;
}

export interface Comment {
  id: string;
  content: string;
  timestamp: string;
  author: string;
}

export interface Holder {
  address: string;
  balance: number;
  percentage: number;
  type: "bonding curve" | "regular";
}

export interface Pool {
  tokenReserve: number;
  aptReserve: number;
  totalSupply: number;
  currentSupply: number;
  currentPrice: number;
  volume24h: number;
  liquidity: number;
}

export interface MarketItem {
  id: string;
  name: string;
  symbol: string;
  contractAddress: string;
  creator: string;
  description?: string;
  imageUrl?: string;
  initialPrice: number;
  currentPrice: number;
  priceChange24h: number;
  marketCap: number;
  bondingProgress: number;
  liquidity: number;
  volume24h: number;
  twitter?: string;
  discord?: string;
  telegram?: string;
  kingProgress?: number;
  dethroneCap?: number;
  trades: Trade[];
  comments: Comment[];
  holders: Holder[];
  timestamp: string;
} 