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