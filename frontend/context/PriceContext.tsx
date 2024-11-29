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
  marketCaps: Record<string, number>;
}

const PriceContext = createContext<PriceContextType | undefined>(undefined);

export function PriceProvider({ children }: { children: React.ReactNode }) {
  const [tokenPrices, setTokenPrices] = useState<Record<string, PriceData>>({});
  const [tokenTrades, setTokenTrades] = useState<Record<string, Trade[]>>({});
  const [bondingProgress, setBondingProgress] = useState<Record<string, number>>({});
  const [liquidity, setLiquidity] = useState<Record<string, number>>({});
  const [volume24h, setVolume24h] = useState<Record<string, number>>({});
  const [poolStates, setPoolStates] = useState<Record<string, Pool>>({});
  const [marketCaps, setMarketCaps] = useState<Record<string, number>>({});

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
      console.log('No simulator found for token:', tokenId);
      return;
    }

    const poolState = simulator.getPoolState();
    const allTrades = simulator.getRecentTrades();
    const candlesticks = simulator.getCandlestickData();
    const newPrice = generatePriceData(allTrades);
    const marketCapUSD = simulator.calculateMarketCapUSD();

    console.log('Price update:', {
      tokenId,
      price: newPrice,
      trades: allTrades.length,
      candlesticks: candlesticks.length,
      marketCap: formatDisplayPrice(marketCapUSD),
      latestTrade: {
        type: trade.type,
        tokenAmount: formatDisplayPrice(trade.tokenAmount),
        aptAmount: formatDisplayPrice(Math.abs(trade.aptAmount)),
        price: formatDisplayPrice(trade.price),
        priceUSD: formatDisplayPrice(trade.priceUSD)
      }
    });

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

    setMarketCaps(prev => ({
      ...prev,
      [tokenId]: marketCapUSD
    }));
  }, [updatePrice, updateTrades]);

  const initializePrice = useCallback((token: MarketItem) => {
    if (!simulatorsRef.current[token.id]) {
      console.log('Initializing price simulator for token:', token.id);
      
      const simulator = new PriceSimulator(token.currentPrice);
      simulatorsRef.current[token.id] = simulator;
      
      simulator.generateInitialTrades();
      const initialTrades = simulator.getRecentTrades();
      const initialPrice = generatePriceData(initialTrades);
      const initialMarketCap = simulator.calculateMarketCapUSD();

      console.log('Token initialization:', {
        tokenId: token.id,
        tradesCount: initialTrades.length,
        initialPrice,
        marketCap: formatDisplayPrice(initialMarketCap),
        firstTrade: initialTrades[0],
        lastTrade: initialTrades[initialTrades.length - 1]
      });

      updateTrades(initialTrades, token.id);
      updatePrice(initialPrice, token.id);

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

      setMarketCaps(prev => ({
        ...prev,
        [token.id]: initialMarketCap
      }));

      simulator.addListener(handlePriceUpdate(token.id));
      simulator.startRealTimeUpdates(5000);
    }
  }, [handlePriceUpdate, updatePrice, updateTrades]);

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
      poolStates,
      marketCaps
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