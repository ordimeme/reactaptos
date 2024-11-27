import { useState, useEffect } from "react"
import { marketData } from "@/data/marketData"
import { Link } from "react-router-dom"

interface ActivityScrollProps {
  speed: number;
  updateInterval: number;
  initialCount: number;
}

interface Activity {
  type: 'create' | 'buy' | 'sell';
  symbol: string;
  amount?: number;
  address: string;
  timestamp: string;
  tokenId: string;
}

const ActivityScroll: React.FC<ActivityScrollProps> = ({ 
  speed, 
  updateInterval, 
  initialCount 
}) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [imageCache, setImageCache] = useState<Record<string, boolean>>({});

  const getSafeImageUrl = (symbol: string) => {
    if (imageCache[symbol] === false) {
      return '/tokens/default.svg'
    }
    try {
      return `/tokens/${symbol.toLowerCase()}.svg`
    } catch {
      return '/tokens/default.svg'
    }
  }

  useEffect(() => {
    const generateActivity = () => {
      const randomToken = marketData[Math.floor(Math.random() * marketData.length)];
      const types: Array<'create' | 'buy' | 'sell'> = ['buy', 'sell'];
      const type = types[Math.floor(Math.random() * types.length)];
      const amount = Number((Math.random() * 10).toFixed(2));
      const address = `0x${Math.random().toString(36).substring(2, 8)}...${Math.random().toString(36).substring(2, 8)}`;

      return {
        type,
        symbol: randomToken.symbol,
        amount,
        address,
        timestamp: new Date().toISOString(),
        tokenId: randomToken.id
      };
    };

    setActivities(Array.from({ length: initialCount }, generateActivity));

    let animationFrameId: number;
    let lastTimestamp: number;

    const animate = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const progress = timestamp - lastTimestamp;
      
      setScrollPosition(prevPosition => {
        const scrollSpeed = 0.015 * (30 / speed);
        const newPosition = prevPosition - (progress * scrollSpeed);
        return newPosition <= -50 ? 0 : newPosition;
      });
      
      lastTimestamp = timestamp;
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [initialCount, updateInterval, speed]);

  return (
    <div className="bg-muted/20 rounded-lg p-2 overflow-hidden">
      <div 
        className="flex gap-6"
        style={{ 
          transform: `translateX(${scrollPosition}%)`,
          willChange: 'transform'
        }}
      >
        {activities.map((activity, index) => (
          <ActivityItem 
            key={index} 
            activity={activity}
            imageCache={imageCache}
            setImageCache={setImageCache}
            getSafeImageUrl={getSafeImageUrl}
          />
        ))}
        {activities.map((activity, index) => (
          <ActivityItem 
            key={`repeat-${index}`} 
            activity={activity}
            imageCache={imageCache}
            setImageCache={setImageCache}
            getSafeImageUrl={getSafeImageUrl}
          />
        ))}
      </div>
    </div>
  );
};

// 活动项组件
const ActivityItem = ({ 
  activity, 
  imageCache,
  setImageCache,
  getSafeImageUrl
}: { 
  activity: Activity;
  imageCache: Record<string, boolean>;
  setImageCache: (cache: Record<string, boolean>) => void;
  getSafeImageUrl: (symbol: string) => string;
}) => (
  <Link 
    to={`/token/${activity.tokenId}`}
    className="flex items-center gap-2 text-sm whitespace-nowrap hover:bg-muted/20 px-2 py-1 rounded-md transition-colors shrink-0"
  >
    <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
      <img
        src={getSafeImageUrl(activity.symbol)}
        alt={activity.symbol}
        className="w-full h-full object-cover"
        onError={() => {
          const newCache = { ...imageCache };
          newCache[activity.symbol] = false;
          setImageCache(newCache);
        }}
      />
    </div>
    <span className={`
      px-2 py-0.5 rounded-full text-xs font-medium
      ${activity.type === 'buy' ? 'bg-green-500/20 text-green-500' : 
        'bg-red-500/20 text-red-500'}
    `}>
      {activity.type.toUpperCase()}
    </span>
    <span className="font-medium">{activity.symbol}</span>
    <span className="text-muted-foreground">
      {activity.amount?.toFixed(2)} SUI
    </span>
    <span className="text-xs text-muted-foreground/70">
      by {activity.address}
    </span>
  </Link>
);

export default ActivityScroll; 