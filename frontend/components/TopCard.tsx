import { Link } from "react-router-dom"
import { Flame } from "lucide-react"
import { Card as UICard, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { MarketItem } from "@/data/marketData"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { ProgressRing } from "./ProgressRing"

interface TopCardProps {
  title: string
  item: MarketItem
}

const TopCard = ({ title, item }: TopCardProps) => {
  const [imageCache, setImageCache] = useState<Record<string, boolean>>({})

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
    <Link 
      to={`/token/${item.id}`} 
      className={cn(
        "shrink-0",
        "w-[95vw]",
        "sm:w-[520px]",
        "md:w-[820px] lg:w-[920px]"
      )}
    >
      <UICard className="group hover:shadow-md transition-all duration-300 rounded-[10px] cursor-pointer border-muted/40 dark:border-muted/20 focus:outline-none bg-[var(--softBg)] backdrop-blur-sm">
        <CardHeader className="pb-4 px-12">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm md:text-base font-medium">{title}</CardTitle>
            {title === "Top Gainer" && (
              <Flame className="h-4 w-4 text-orange-500" />
            )}
          </div>
        </CardHeader>
        <CardContent className="px-6 md:px-12 pb-10">
          <div className="flex items-center gap-8 md:gap-12">
            {/* 左侧：图标 */}
            <div className="w-20 h-20 md:w-24 md:h-24 overflow-hidden rounded-[12px] flex items-center justify-center bg-background">
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

            {/* 右侧：信息 */}
            <div className="flex-1 space-y-6 md:space-y-8">
              {/* 名称和价格 */}
              <div className="flex justify-between items-start gap-4">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-lg md:text-xl truncate mb-2">{item.name}</h3>
                  <span className="text-sm text-muted-foreground">{item.symbol}</span>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-semibold text-lg md:text-xl mb-2">${item.price.toFixed(2)}</div>
                  <div className={`text-sm font-medium ${item.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {item.priceChange24h >= 0 ? '+' : ''}{item.priceChange24h.toFixed(2)}%
                  </div>
                </div>
              </div>

              {/* 市值和进度 */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground/70">MCap:</span>
                  <span>${item.marketCap.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ProgressRing progress={item.bondingProgress} />
                  <span>{item.bondingProgress}%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </UICard>
    </Link>
  )
}

export default TopCard 