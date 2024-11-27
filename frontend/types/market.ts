export interface Comment {
  address: string;
  content: string;
  timestamp: string;
}

export interface Holder {
  address: string;
  balance: number;
  percentage: number;
  type: string;
}

export interface Trade {
  account: string;
  type: 'buy' | 'sell';
  tokenAmount: number;
  aptAmount: number;
  timestamp: string;
  txHash: string;
}

export interface MarketItem {
  id: string;
  name: string;
  symbol: string;
  price: number;
  marketCap: number;
  volume24h: number;
  liquidity?: number;
  holders: number;
  totalSupply: number;
  creator: string;
  description?: string;
  twitter?: string;
  discord?: string;
  telegram?: string;
  bondingProgress: number;
  kingProgress: number;
  dethroneCap: number;
  trades: Trade[];
  comments: Comment[];
  imageUrl?: string;
} 