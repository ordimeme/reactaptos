import { MarketItem, PriceData } from "@/types/market"
import { Copy, MessageCircle } from "lucide-react"
import { Button } from "./ui/button"
import { useState } from "react"
import { truncateAddress, getFullAddress } from "@/utils/truncateAddress"
import { useToast } from "./ui/use-toast"
import { ProgressRing } from "./ProgressRing"
import { formatRelativeTime } from "@/utils/formatDate"
import { usePriceContext } from "@/context/PriceContext"

interface CardProps {
  item: MarketItem;
  price?: PriceData;
}

const Card = ({ item, price }: CardProps) => {
  const { toast } = useToast();
  const [imageError, setImageError] = useState(false);
  const { tokenPrices } = usePriceContext();

  // 使用传入的 price 或从 Context 获取价格
  const currentPrice = price || tokenPrices[item.id] || {
    change24h: '0.00',
    close: item.currentPrice.toFixed(2)
  };

  // 处理复制功能
  const handleCopy = async (e: React.MouseEvent, address: string) => {
    e.preventDefault();
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

  // 获取安全的图片URL
  const getSafeImageUrl = (symbol: string) => {
    if (imageError) {
      return '/tokens/default.svg';
    }
    const safeName = symbol.toLowerCase().replace(/[^a-z0-9]/g, '');
    return `/tokens/${safeName}.svg`;
  };

  // 处理描述文本截断
  const truncateDescription = (text: string) => {
    const maxLength = 85; // 约为两行文本的0.618位置
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + ' ...';
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
                setImageError(true);
                const target = e.target as HTMLImageElement;
                target.src = '/tokens/default.svg';
                if (process.env.NODE_ENV === 'development') {
                  console.warn(`Token image not found: ${item.symbol}`);
                }
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
          <p className={`text-sm ${
            parseFloat(currentPrice.change24h) >= 0 ? "text-green-500" : "text-red-500"
          }`}>
            ({parseFloat(currentPrice.change24h) >= 0 ? "+" : ""}
            {currentPrice.change24h}% 24h)
          </p>
        </div>
      </div>

      {/* Token Description */}
      {item.description && (
        <div className="mt-3">
          <p className="text-sm text-muted-foreground leading-5">
            {truncateDescription(item.description)}
          </p>
        </div>
      )}

      {/* CA 和时间信息 */}
      <div className="mt-4 flex items-center gap-2">
        <span className="text-sm text-muted-foreground whitespace-nowrap">CA:</span>
        <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-1.5 w-[180px] group-hover:bg-background/80 transition-colors duration-300">
          <span className="text-sm font-mono text-foreground/80">{truncateAddress(item.creator, 6, 4, true)}</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 hover:bg-background/80"
            onClick={(e) => handleCopy(e, item.creator)}
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
        </div>
        <span className="text-sm text-muted-foreground ml-auto">{formatRelativeTime(item.timestamp)}</span>
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