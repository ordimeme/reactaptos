import { Link } from "react-router-dom"
import { Flame, Info } from "lucide-react"
import { Card as UICard, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { MarketItem } from "@/types/market"
import { PriceData } from "@/types/market"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { ProgressRing } from "./ProgressRing"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { usePriceContext } from "@/context/PriceContext";

interface TopCardProps {
  title: string
  item: MarketItem
  price?: PriceData
}

const GoldCoin = () => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle 
      cx="12" 
      cy="12" 
      r="11" 
      fill="url(#glowGradient)"
    />
    
    <circle 
      cx="12" 
      cy="12" 
      r="10" 
      fill="url(#goldGradient)" 
      filter="url(#shadow)"
    />
    
    <path
      d="M8 8C12 6 16 8 16 12"
      stroke="url(#highlightGradient)"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.7"
    />

    <defs>
      <radialGradient 
        id="glowGradient" 
        cx="0.5" 
        cy="0.5" 
        r="0.5" 
        gradientUnits="userSpaceOnUse" 
        gradientTransform="translate(12 12) rotate(90) scale(12)"
      >
        <stop offset="0.6" stopColor="#FFD700" stopOpacity="0.3" />
        <stop offset="1" stopColor="#FFD700" stopOpacity="0" />
      </radialGradient>

      <radialGradient 
        id="goldGradient" 
        cx="0.5" 
        cy="0.3" 
        r="0.7" 
        gradientUnits="userSpaceOnUse" 
        gradientTransform="translate(12 12) rotate(90) scale(12)"
      >
        <stop offset="0" stopColor="#FFE17D" />
        <stop offset="0.3" stopColor="#FFD700" />
        <stop offset="0.8" stopColor="#FFA500" />
        <stop offset="1" stopColor="#FF8C00" />
      </radialGradient>

      <linearGradient
        id="highlightGradient"
        x1="8"
        y1="8"
        x2="16"
        y2="12"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="white" stopOpacity="0.8" />
        <stop offset="1" stopColor="white" stopOpacity="0" />
      </linearGradient>

      <filter id="shadow" x="-2" y="-2" width="28" height="28" filterUnits="userSpaceOnUse">
        <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
        <feOffset dy="1" />
        <feComposite in2="SourceAlpha" operator="out" />
        <feColorMatrix values="0 0 0 0 1 0 0 0 0 0.843137 0 0 0 0 0 0 0 0 0.5 0" />
        <feBlend in2="SourceGraphic" />
      </filter>
    </defs>
  </svg>
);

const TopCard = ({ title, item }: TopCardProps) => {
  const { tokenPrices } = usePriceContext();
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

  const currentPrice = tokenPrices[item.id] || {
    change24h: '0.00',
    close: item.currentPrice.toFixed(2)
  };

  return (
    <Link 
      to={`/token/${item.id}`} 
      className="block w-full"
    >
      <UICard className="group hover:shadow-md transition-all duration-300 rounded-[10px] cursor-pointer border-muted/40 dark:border-muted/20 focus:outline-none bg-[var(--softBg)] backdrop-blur-sm h-full">
        <CardHeader className="pb-3 px-3 md:px-8">
          <div className="flex items-center">
            <CardTitle className="text-sm md:text-base font-medium flex items-center gap-2">
              {title}
              {title === "Top Gainer" && (
                <Flame className="h-4 w-4 text-orange-500" />
              )}
              {title === "Top Volume" && (
                <GoldCoin />
              )}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-3 md:px-8 pb-6">
          <div className="flex items-center gap-4 md:gap-12">
            {/* 左侧：图标 */}
            <div className={cn(
              "overflow-hidden rounded-[12px] flex items-center justify-center bg-background",
              title === "Top Gainer" 
                ? "w-20 h-20 md:w-24 md:h-24"
                : "w-12 h-12 md:w-24 md:h-24" // Top Volume图标更小
            )}>
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
            <div className="flex-1 space-y-6 md:space-y-8 hide-on-small">
              {/* 名称和市值 */}
              <div className="flex justify-between items-start gap-4">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-lg md:text-xl truncate mb-2">{item.name}</h3>
                  <span className="text-sm text-muted-foreground">{item.symbol}</span>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center justify-end gap-2 mb-2">
                    <div className="font-semibold text-lg md:text-xl">
                      ${item.marketCap.toLocaleString()}
                    </div>
                    {title === "Top Gainer" && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Market Cap</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  <div className={`text-sm font-medium ${
                    parseFloat(currentPrice.change24h) >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {parseFloat(currentPrice.change24h) >= 0 ? '+' : ''}
                    {currentPrice.change24h}%
                  </div>
                </div>
              </div>

              {/* 价格和进度 */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground/70">Price:</span>
                  <span>${item.currentPrice.toFixed(2)}</span>
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