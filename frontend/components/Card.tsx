import { MarketItem } from "@/data/marketData"
import { Copy, MessageCircle } from "lucide-react"
import { Button } from "./ui/button"
import { useState } from "react"
import { truncateAddress, getFullAddress } from "@/utils/truncateAddress"
import { useToast } from "./ui/use-toast"
import { ProgressRing } from "./ProgressRing"

interface CardProps {
  item: MarketItem
}

const Card = ({ item }: CardProps) => {
  const { toast } = useToast();
  const [imageError, setImageError] = useState(false);

  // 处理复制功能
  const handleCopy = async (e: React.MouseEvent, address: string) => {
    e.preventDefault(); // 阻止事件冒泡，防止触发卡片点击
    e.stopPropagation();
    
    try {
      await navigator.clipboard.writeText(getFullAddress(address));
      toast({
        title: "Success",
        description: "Address has been copied to clipboard",
      });
    } catch (err) {
      console.error('Failed to copy:', err);
      toast({
        title: "Failed",
        description: "Failed to copy address",
        variant: "destructive",
      });
    }
  };

  // 格式化时间
  const formatTime = (timestamp: string) => {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    
    if (seconds < 60) {
      return `${seconds}s ago`;
    }
    return `${Math.floor(seconds / 60)}m ago`;
  };

  // 获取安全的图片URL
  const getSafeImageUrl = (symbol: string) => {
    if (imageError) {
      return '/tokens/default.svg';
    }
    
    try {
      // 处理特殊字符，只保留字母和数字
      const safeName = symbol.toLowerCase().replace(/[^a-z0-9]/g, '');
      const imageUrl = `/tokens/${safeName}.svg`;
      
      // 预加载图片
      const img = new Image();
      img.onerror = () => {
        setImageError(true);
        // 减少控制台警告的输出
        if (!imageError) {
          console.warn(`Failed to load image for ${symbol}`);
        }
      };
      img.src = imageUrl;
      
      return imageUrl;
    } catch (error) {
      console.error('Error loading image:', error);
      return '/tokens/default.svg';
    }
  };

  return (
    <div className="group bg-card hover:bg-accent/5 border border-border rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
      {/* Token基本信息 */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 overflow-hidden rounded-xl flex items-center justify-center bg-muted group-hover:bg-background/80 transition-colors duration-300">
          <img 
            src={getSafeImageUrl(item.symbol)}
            alt={item.name}
            className="w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              if (!imageError) {
                console.warn(`Image load failed for ${item.symbol}`);
                setImageError(true);
              }
              const target = e.target as HTMLImageElement;
              if (!target.src.includes('default.svg')) {
                target.src = '/tokens/default.svg';
              }
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base group-hover:text-primary transition-colors duration-300">{item.name}</h3>
          <p className="text-sm text-muted-foreground">{item.symbol}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-base">MCap: ${item.marketCap.toLocaleString()}</p>
          <p className={`text-sm ${item.priceChange24h >= 0 ? "text-green-500" : "text-red-500"}`}>
            ({item.priceChange24h >= 0 ? "+" : ""}{item.priceChange24h.toFixed(2)}% 24h)
          </p>
        </div>
      </div>

      {/* CA 和时间信息 */}
      <div className="mt-4 flex items-center gap-2">
        <span className="text-sm text-muted-foreground whitespace-nowrap">CA:</span>
        <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-1.5 w-[180px] group-hover:bg-background/80 transition-colors duration-300">
          <span className="text-sm font-mono text-foreground/80">{truncateAddress(item.creator)}</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 hover:bg-background/80"
            onClick={(e) => handleCopy(e, item.creator)}
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
        </div>
        <span className="text-sm text-muted-foreground ml-auto">{formatTime(item.timestamp)}</span>
      </div>

      {/* Progress & Comments */}
      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <ProgressRing progress={item.bondingProgress} size={14} strokeWidth={2} />
          <span>{item.bondingProgress}%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MessageCircle className="h-4 w-4" />
          <span>{item.comments.length}</span>
        </div>
      </div>
    </div>
  );
};

export default Card;