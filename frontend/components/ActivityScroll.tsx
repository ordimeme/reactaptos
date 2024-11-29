import { useEffect, useState, useRef } from 'react';
import { Trade } from '@/types/market';
import { truncateAddress } from '@/utils/truncateAddress';
import { formatDisplayPrice } from '@/utils/format';

export interface ActivityScrollProps {
  speed?: number;
  initialCount?: number;
  trades?: Trade[];
}

export default function ActivityScroll({ 
  speed = 30,
  initialCount = 10,
  trades = []
}: ActivityScrollProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const animate = () => {
      setScrollPosition(prev => {
        const newPosition = prev + 1;
        if (newPosition >= container.scrollWidth / 2) {
          return 0;
        }
        return newPosition;
      });
    };

    const interval = setInterval(animate, speed);
    return () => clearInterval(interval);
  }, [speed]);

  const renderActivities = () => {
    const sortedTrades = [...trades].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ).slice(0, initialCount);

    return (
      <>
        {sortedTrades.map((trade, index) => (
          <div 
            key={`${index}-${trade.txHash}`}
            className="flex items-center gap-2 px-4 py-2 whitespace-nowrap text-xs"
          >
            <span className="font-mono text-muted-foreground">
              {truncateAddress(trade.trader, 4, 4)}
            </span>
            <span className={trade.type === 'buy' ? 'text-green-500' : 'text-red-500'}>
              {trade.type === 'buy' ? 'Buy' : 'Sell'}
            </span>
            <span className="font-mono">
              {formatDisplayPrice(trade.tokenAmount)}
            </span>
            <span className="text-muted-foreground">@</span>
            <span className="font-mono">
              ${formatDisplayPrice(trade.price)}
            </span>
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="relative overflow-hidden bg-muted/5 border border-muted/20 rounded-lg">
      <div
        ref={containerRef}
        className="flex items-center"
        style={{
          transform: `translateX(-${scrollPosition}px)`,
        }}
      >
        <div className="flex items-center">
          {renderActivities()}
        </div>
        <div className="flex items-center">
          {renderActivities()}
        </div>
      </div>
    </div>
  );
} 