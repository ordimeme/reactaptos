import { MarketItem } from "@/data/marketData"
import { Card as UICard, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface CardProps {
  item: MarketItem
}

const Card = ({ item }: CardProps) => {
  return (
    <UICard className="group hover:shadow-lg hover:scale-[1.02] transition-all duration-300 rounded-[10px] cursor-pointer border-muted/40 dark:border-muted/20">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 overflow-hidden rounded-[10px] flex items-center justify-center bg-muted/50 dark:bg-muted/20 group-hover:scale-105 transition-transform duration-300">
            <img 
              src={item.imageUrl} 
              alt={item.name}
              className="w-full h-full"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `/tokens/default.svg`;
              }}
            />
          </div>
          <div>
            <CardTitle className="text-lg group-hover:text-primary transition-colors">{item.name}</CardTitle>
            <CardDescription className="text-muted-foreground/70">{item.symbol}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground/70">Price</span>
            <span className="font-semibold">${item.price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground/70">Creator</span>
            <span className="text-sm font-mono">{item.creator}</span>
          </div>
          <p className="text-sm text-muted-foreground/70 mt-2">{item.description}</p>
          <div className="text-xs text-muted-foreground/60 mt-4">
            {new Date(item.timestamp).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </UICard>
  )
}

export default Card