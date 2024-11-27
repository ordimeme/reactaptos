import { Link } from "react-router-dom"
import { Flame } from "lucide-react"
import { Card as UICard, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { MarketItem } from "@/data/marketData"
import { useState } from "react"

interface TopCardProps {
  title: string
  item: MarketItem
}

const TopCard = ({ title, item }: TopCardProps) => {
  const [imageCache, setImageCache] = useState<Record<string, boolean>>({})

  // 获取安全的图片URL
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

  return (
    <Link to={`/token/${item.id}`} className="shrink-0 first:w-[calc(80vw-2rem)] first:sm:w-[280px] last:w-[calc(20vw-1rem)] last:sm:w-[280px] md:w-[360px]">
      <UICard className="group hover:shadow-md transition-all duration-300 rounded-[10px] cursor-pointer border-muted/40 dark:border-muted/20 focus:outline-none">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base md:text-lg font-medium">{title}</CardTitle>
            {title === "Top Gainer" && (
              <Flame className="h-5 w-5 text-orange-500" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 overflow-hidden rounded-[10px] flex items-center justify-center bg-muted/50 dark:bg-muted/20">
              <img 
                src={getSafeImageUrl(item.symbol)}
                alt={item.name}
                className="w-full h-full transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
                onError={() => {
                  const newCache = { ...imageCache };
                  newCache[item.symbol] = false;
                  setImageCache(newCache);
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base md:text-sm truncate">{item.name}</h3>
                <span className="text-sm md:text-xs text-muted-foreground/70">{item.symbol}</span>
              </div>
              <div className="flex justify-between items-center mt-2 md:mt-1">
                <span className="text-sm md:text-xs text-muted-foreground/70">Price</span>
                <span className="font-semibold text-base md:text-sm">${item.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm md:text-xs text-muted-foreground/70">24h</span>
                <span className={`font-semibold text-base md:text-sm ${item.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {item.priceChange24h >= 0 ? '+' : ''}{item.priceChange24h.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </UICard>
    </Link>
  )
}

export default TopCard 