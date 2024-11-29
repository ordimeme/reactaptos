import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { MarketItem, Pool, PriceData, Trade } from '@/types/market';
import { PriceSimulator } from '@/data/priceData';
import { marketData } from '@/data/marketData';
import { formatDisplayPrice } from '@/utils/format';
import { generatePriceData } from '@/data/chatData';

interface PriceContextType {
  tokenPrices: Record<string, PriceData>;
  tokenTrades: Record<string, Trade[]>;
  updatePrice: (newPrice: PriceData, tokenId: string) => void;
  updateTrades: (newTrades: Trade[], tokenId: string) => void;
  initializePrice: (token: MarketItem) => void;
  priceSimulator: PriceSimulator | null;
  bondingProgress: Record<string, number>;
  liquidity: Record<string, number>;
  volume24h: Record<string, number>;
  poolStates: Record<string, Pool>;
}

const PriceContext = createContext<PriceContextType | undefined>(undefined);

export function PriceProvider({ children }: { children: React.ReactNode }) {
  const [tokenPrices, setTokenPrices] = useState<Record<string, PriceData>>({});
  const [tokenTrades, setTokenTrades] = useState<Record<string, Trade[]>>({});
  const [bondingProgress, setBondingProgress] = useState<Record<string, number>>({});
  const [liquidity, setLiquidity] = useState<Record<string, number>>({});
  const [volume24h, setVolume24h] = useState<Record<string, number>>({});
  const [poolStates, setPoolStates] = useState<Record<string, Pool>>({});

  const simulatorsRef = useRef<Record<string, PriceSimulator>>({});
  const initializationRef = useRef(false);

  const updatePrice = useCallback((newPrice: PriceData, tokenId: string) => {
    setTokenPrices(prev => ({
      ...prev,
      [tokenId]: newPrice
    }));
  }, []);

  const updateTrades = useCallback((newTrades: Trade[], tokenId: string) => {
    setTokenTrades(prev => ({
      ...prev,
      [tokenId]: newTrades
    }));
  }, []);

  const handlePriceUpdate = useCallback((tokenId: string) => (_: number, trade: Trade) => {
    const simulator = simulatorsRef.current[tokenId];
    if (!simulator) {
      console.error('No simulator found for token:', tokenId);
      return;
    }

    const poolState = simulator.getPoolState();
    const allTrades = simulator.getRecentTrades();

    // 使用 chatData 中的函数生成价格数据
    const newPrice = generatePriceData(allTrades);

    console.log('Price update:', {
      tokenId,
      price: newPrice,
      trades: allTrades.length,
      latestTrade: {
        type: trade.type,
        tokenAmount: formatDisplayPrice(trade.tokenAmount),
        aptAmount: formatDisplayPrice(Math.abs(trade.aptAmount)),
        price: formatDisplayPrice(trade.price),
        priceUSD: formatDisplayPrice(trade.priceUSD)
      }
    });

    // 更新所有状态
    updatePrice(newPrice, tokenId);
    updateTrades(allTrades, tokenId);

    setBondingProgress(prev => ({
      ...prev,
      [tokenId]: (poolState.currentSupply / poolState.totalSupply) * 100
    }));

    setLiquidity(prev => ({
      ...prev,
      [tokenId]: poolState.liquidity
    }));

    setVolume24h(prev => ({
      ...prev,
      [tokenId]: simulator.get24hVolume()
    }));

    setPoolStates(prev => ({
      ...prev,
      [tokenId]: poolState
    }));
  }, [updatePrice, updateTrades]);

  const initializePrice = useCallback((token: MarketItem) => {
    if (!simulatorsRef.current[token.id]) {
      console.log('Initializing price simulator for token:', token.id);
      
      // 创建新的模拟器实例
      const simulator = new PriceSimulator(token.currentPrice);
      simulatorsRef.current[token.id] = simulator;
      
      // 先生成初始交易数据
      simulator.generateInitialTrades();
      const initialTrades = simulator.getRecentTrades();
      
      // 使用初始交易数据生成价格数据
      const initialPrice = generatePriceData(initialTrades);

      console.log('Token initialization:', {
        tokenId: token.id,
        tradesCount: initialTrades.length,
        initialPrice,
        firstTrade: initialTrades[0],
        lastTrade: initialTrades[initialTrades.length - 1]
      });

      // 立即更新状态
      updateTrades(initialTrades, token.id);
      updatePrice(initialPrice, token.id);

      // 更新其他状态
      const poolState = simulator.getPoolState();
      setBondingProgress(prev => ({
        ...prev,
        [token.id]: (poolState.currentSupply / poolState.totalSupply) * 100
      }));

      setLiquidity(prev => ({
        ...prev,
        [token.id]: poolState.liquidity
      }));

      setVolume24h(prev => ({
        ...prev,
        [token.id]: simulator.get24hVolume()
      }));

      setPoolStates(prev => ({
        ...prev,
        [token.id]: poolState
      }));

      // 添加监听器并开始实时更新
      simulator.addListener(handlePriceUpdate(token.id));
      simulator.startRealTimeUpdates(5000);
    }
  }, [handlePriceUpdate, updatePrice, updateTrades]);

  // 初始化所有代币
  useEffect(() => {
    if (!initializationRef.current) {
      console.log('Starting market data initialization');
      Promise.all(marketData.map(token => {
        return new Promise<void>((resolve) => {
          initializePrice(token);
          resolve();
        });
      })).then(() => {
        console.log('All tokens initialized');
        initializationRef.current = true;
      });
    }

    return () => {
      Object.values(simulatorsRef.current).forEach(simulator => {
        simulator.stopRealTimeUpdates();
      });
    };
  }, [initializePrice]);

  return (
    <PriceContext.Provider value={{ 
      tokenPrices, 
      tokenTrades,
      updatePrice, 
      updateTrades,
      initializePrice,
      priceSimulator: simulatorsRef.current[Object.keys(simulatorsRef.current)[0]] || null,
      bondingProgress,
      liquidity,
      volume24h,
      poolStates
    }}>
      {children}
    </PriceContext.Provider>
  );
}

export const usePriceContext = () => {
  const context = useContext(PriceContext);
  if (context === undefined) {
    throw new Error('usePriceContext must be used within a PriceProvider');
  }
  return context;
}; 