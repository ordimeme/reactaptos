import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { MarketItem, Pool, PriceData } from '@/types/market';
import { PriceSimulator } from '@/data/priceData';
import { marketData } from '@/data/marketData';

interface PriceContextType {
  tokenPrices: Record<string, PriceData>;
  updatePrice: (newPrice: PriceData, tokenId: string) => void;
  initializePrice: (token: MarketItem) => void;
  priceSimulator: PriceSimulator | null;
  bondingProgress: Record<string, number>;
  liquidity: Record<string, number>;
  volume24h: Record<string, number>;
  poolStates: Record<string, Pool>;
}

const PRICE_STORAGE_KEY = 'token_prices';
const LAST_UPDATE_KEY = 'last_price_update';

const PriceContext = createContext<PriceContextType | undefined>(undefined);

export function PriceProvider({ children }: { children: React.ReactNode }) {
  const [tokenPrices, setTokenPrices] = useState<Record<string, PriceData>>(() => {
    try {
      const savedPrices = localStorage.getItem(PRICE_STORAGE_KEY);
      const lastUpdate = localStorage.getItem(LAST_UPDATE_KEY);
      
      if (savedPrices && lastUpdate) {
        const now = Date.now();
        const lastUpdateTime = parseInt(lastUpdate);
        if (now - lastUpdateTime < 24 * 60 * 60 * 1000) {
          return JSON.parse(savedPrices);
        }
      }
      return {};
    } catch {
      return {};
    }
  });

  const [bondingProgress, setBondingProgress] = useState<Record<string, number>>({});
  const [liquidity, setLiquidity] = useState<Record<string, number>>({});
  const [volume24h, setVolume24h] = useState<Record<string, number>>({});
  const [poolStates, setPoolStates] = useState<Record<string, Pool>>({});

  const simulatorsRef = useRef<Record<string, PriceSimulator>>({});
  const initializationRef = useRef(false);

  const updatePrice = useCallback((newPrice: PriceData, tokenId: string) => {
    console.log('Updating price:', { tokenId, newPrice });
    
    setTokenPrices(prev => {
      const currentPrice = prev[tokenId];
      if (currentPrice && 
          currentPrice.close === newPrice.close && 
          currentPrice.change24h === newPrice.change24h) {
        return prev;
      }

      const updated = {
        ...prev,
        [tokenId]: newPrice
      };
      
      try {
        localStorage.setItem(PRICE_STORAGE_KEY, JSON.stringify(updated));
        localStorage.setItem(LAST_UPDATE_KEY, Date.now().toString());
      } catch (error) {
        console.error('Failed to save prices to localStorage:', error);
      }
      
      return updated;
    });

    if (simulatorsRef.current[tokenId]) {
      const simulator = simulatorsRef.current[tokenId];
      const poolState = simulator.getPoolState();
      const price = parseFloat(newPrice.close);
      
      poolState.currentPrice = price;
      
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
    }
  }, []);

  const initializePrice = useCallback((token: MarketItem) => {
    if (!simulatorsRef.current[token.id]) {
      console.log('Initializing price simulator for token:', token.id);
      const simulator = new PriceSimulator(token.currentPrice);
      simulatorsRef.current[token.id] = simulator;
      
      const initialPrice: PriceData = {
        open: token.currentPrice.toFixed(4),
        high: token.currentPrice.toFixed(4),
        low: token.currentPrice.toFixed(4),
        close: token.currentPrice.toFixed(4),
        time: new Date().toLocaleString('en-US', { 
          timeZone: 'Asia/Shanghai',
          hour12: false 
        }),
        price24h: token.currentPrice.toFixed(4),
        time24h: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString('en-US', {
          timeZone: 'Asia/Shanghai',
          hour12: false
        }),
        change24h: '0.00',
        changePercent: '0.00'
      };

      updatePrice(initialPrice, token.id);
      
      simulator.startRealTimeUpdates(5000);
    }
  }, [updatePrice]);

  useEffect(() => {
    if (!initializationRef.current) {
      console.log('Initializing all token prices');
      marketData.forEach(token => {
        initializePrice(token);
      });
      initializationRef.current = true;
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
      updatePrice, 
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