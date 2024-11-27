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

    const timer = setInterval(() => {
      setActivities(prev => [generateActivity(), ...prev.slice(0, -1)]);
    }, updateInterval);

    return () => clearInterval(timer);
  }, [initialCount, updateInterval]);

  return (
    <div className="bg-muted/20 rounded-lg p-2 overflow-hidden">
      <div 
        className="flex gap-6 animate-scroll-fast"
        style={{ animation: `scroll-fast ${speed}s linear infinite` }}
      >
        {/* 原始活动数据 */}
        {activities.map((activity, index) => (
          <ActivityItem key={index} activity={activity} />
        ))}
        {/* 复制的活动数据，用于无缝滚动 */}
        {activities.map((activity, index) => (
          <ActivityItem key={`repeat-${index}`} activity={activity} />
        ))}
      </div>
    </div>
  );
};

// 活动项组件
const ActivityItem = ({ activity }: { activity: Activity }) => (
  <Link 
    to={`/token/${activity.tokenId}`}
    className="flex items-center gap-2 text-sm whitespace-nowrap hover:bg-muted/20 px-2 py-1 rounded-md transition-colors"
  >
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