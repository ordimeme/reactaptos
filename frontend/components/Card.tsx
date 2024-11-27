import { MarketItem } from "@/data/marketData"
import { Copy } from "lucide-react"
import { Button } from "./ui/button"
import { MessageCircle } from "lucide-react"
import { useState, useEffect } from "react"

interface CardProps {
  item: MarketItem
}

const Card = ({ item }: CardProps) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [, forceUpdate] = useState({});

  // 每秒更新时间显示
  useEffect(() => {
    const timer = setInterval(() => {
      forceUpdate({});
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 处理复制功能
  const handleCopy = (e: React.MouseEvent, text: string) => {
    e.preventDefault(); // 阻止事件冒泡，防止触发卡片点击
    e.stopPropagation();
    
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    
    // 2秒后重置复制状态
    setTimeout(() => {
      setCopySuccess(false);
    }, 2000);
  };

  // 优化的时间格式化函数
  const formatTime = (timestamp: string) => {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    
    if (seconds < 60) {
      return `${seconds}s ago`;
    }
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes}m ago`;
    }
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours}h ago`;
    }
    
    const days = Math.floor(hours / 24);
    if (days < 7) {
      return `${days}d ago`;
    }
    
    const weeks = Math.floor(days / 7);
    if (weeks < 4) {
      return `${weeks}w ago`;
    }
    
    const months = Math.floor(days / 30);
    if (months < 12) {
      return `${months}mo ago`;
    }
    
    const years = Math.floor(days / 365);
    return `${years}y ago`;
  };

  // 获取安全的图片URL
  const getSafeImageUrl = (symbol: string) => {
    const safeName = symbol.toLowerCase().replace(/[^a-z0-9]/g, '');
    return `/tokens/${safeName}.svg`;
  };

  return (
    <div className="bg-card border border-muted/40 dark:border-muted/20 rounded-[10px] p-4 transition-all duration-300 hover:shadow-md">
      {/* Token基本信息 */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 overflow-hidden rounded-[10px] flex items-center justify-center bg-muted/50 dark:bg-muted/20">
          <img 
            src={getSafeImageUrl(item.symbol)} // 使用安全的图片URL
            alt={item.name}
            className="w-full h-full transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = getSafeImageUrl(item.symbol);
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base truncate">{item.name}</h3>
          <p className="text-sm text-muted-foreground/70">{item.symbol}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold">${item.price.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground/70">
            MCap: ${item.marketCap.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Contract Address - 使用 onClick 事件阻止冒泡 */}
      <div 
        className="flex items-center gap-2 bg-muted/20 rounded-lg px-2 py-1.5 mt-2"
        onClick={(e) => e.stopPropagation()} // 阻止整个地址区域的点击事件冒泡
      >
        <span className="text-xs text-muted-foreground">CA:</span>
        <span className="text-xs font-mono truncate flex-1">{item.creator}</span>
        <Button
          variant="ghost"
          size="icon"
          className={`h-6 w-6 hover:bg-muted relative ${copySuccess ? 'text-green-500' : ''}`}
          onClick={(e) => handleCopy(e, item.creator)}
        >
          <Copy className="h-3 w-3" />
          {copySuccess && (
            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs bg-black/80 text-white px-2 py-1 rounded">
              Copied!
            </span>
          )}
        </Button>
      </div>

      {/* Bonding Progress 和其他信息 */}
      <div className="mt-3 flex flex-col gap-2 text-xs">
        <div className="flex items-center justify-between text-muted-foreground">
          <div className="flex items-center gap-1">
            <MessageCircle className="h-3.5 w-3.5" />
            <span>{item.comments.length} comments</span>
          </div>
          <span className="tabular-nums">{formatTime(item.timestamp)}</span>
        </div>
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Bonding Progress:</span>
          <span>{item.bondingProgress}%</span>
        </div>
      </div>
    </div>
  );
};

export default Card;