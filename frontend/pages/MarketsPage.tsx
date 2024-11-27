import { useState, useEffect } from "react"
import CardList from "@/components/CardList"
import { marketData } from "@/data/marketData"
import { Card as UICard, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import ActivityScroll from "@/components/ActivityScroll"
import { Link } from "react-router-dom";
import { Flame } from "lucide-react";
import { MarketItem, Trade } from "@/types/market";

const Markets = () => {
  const [sortBy, setSortBy] = useState<string>("creation-time")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBy, setFilterBy] = useState<string>("all")
  const [imageCache, setImageCache] = useState<{ [key: string]: boolean }>({});

  // 修改预加载图片逻辑
  useEffect(() => {
    const preloadImages = async () => {
      const newImageCache = { ...imageCache };
      
      for (const item of marketData) {
        const safeName = item.symbol.toLowerCase().replace(/[^a-z0-9]/g, '');
        const imageUrl = `/tokens/${safeName}.svg`;
        
        try {
          const response = await fetch(imageUrl);
          if (!response.ok) throw new Error('Image not found');
          newImageCache[item.symbol] = true;
        } catch (error) {
          console.warn(`Failed to load image for ${item.symbol}`);
          newImageCache[item.symbol] = false;
        }
      }
      
      setImageCache(newImageCache);
    };

    preloadImages();
  }, []);

  // 修改获取安全图片URL的逻辑
  const getSafeImageUrl = (symbol: string) => {
    if (imageCache[symbol] === false) {
      return '/tokens/default.svg';
    }
    const safeName = symbol.toLowerCase().replace(/[^a-z0-9]/g, '');
    return `/tokens/${safeName}.svg`;
  };

  // 顶部卡片组件
  const TopCard = ({ title, item }: { title: string; item: typeof marketData[0] }) => (
    <Link to={`/token/${item.id}`}>
      <UICard className="group hover:shadow-md transition-all duration-300 rounded-[10px] cursor-pointer border-muted/40 dark:border-muted/20 flex-1 w-[calc(100vw-6rem)] md:w-[360px]">
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
              <h3 className="font-semibold text-base md:text-sm truncate">{item.name}</h3>
              <p className="text-sm md:text-xs text-muted-foreground/70">{item.symbol}</p>
              <div className="flex justify-between items-center mt-2 md:mt-1">
                <span className="text-sm md:text-xs text-muted-foreground/70">Price</span>
                <span className="font-semibold text-base md:text-sm">${item.price.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </UICard>
    </Link>
  );

  // 获取 Top Gainer 和 Top Volume 数据
  const getTopGainer = () => {
    return [...marketData].sort((a, b) => b.price - a.price)[0]
  }

  const getTopVolume = () => {
    return [...marketData].sort((a, b) => b.price - a.price)[1]
  }

  // 筛选和排序逻辑
  const getFilteredData = () => {
    let filtered = [...marketData]

    // 搜索过滤
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // 根据不同条件筛选
    switch (filterBy) {
      case "bonding-0-25":
        filtered = filtered.filter(item => item.bondingProgress <= 25)
        break
      case "bonding-25-50":
        filtered = filtered.filter(item => item.bondingProgress > 25 && item.bondingProgress <= 50)
        break
      case "bonding-50-75":
        filtered = filtered.filter(item => item.bondingProgress > 50 && item.bondingProgress <= 75)
        break
      case "bonding-75-100":
        filtered = filtered.filter(item => item.bondingProgress > 75)
        break
      default:
        break
    }

    // 优化排序逻辑
    switch (sortBy) {
      case "creation-time":
        filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        break
      case "featured":
        filtered.sort((a, b) => (b.marketCap * b.bondingProgress) - (a.marketCap * a.bondingProgress))
        break
      case "last-trade":
        filtered.sort((a, b) => {
          const aLastTrade = a.trades[0]?.timestamp || a.timestamp
          const bLastTrade = b.trades[0]?.timestamp || b.timestamp
          return new Date(bLastTrade).getTime() - new Date(aLastTrade).getTime()
        })
        break
      case "last-reply":
        filtered.sort((a, b) => {
          const aLastComment = a.comments[0]?.timestamp || a.timestamp
          const bLastComment = b.comments[0]?.timestamp || b.timestamp
          return new Date(bLastComment).getTime() - new Date(aLastComment).getTime()
        })
        break
      case "market-cap-high":
        filtered.sort((a, b) => b.marketCap - a.marketCap)
        break
      case "market-cap-low":
        filtered.sort((a, b) => a.marketCap - b.marketCap)
        break
      case "volume-24h-high":
        filtered.sort((a, b) => getVolume(b, 24) - getVolume(a, 24))
        break
      case "volume-7d-high":
        filtered.sort((a, b) => getVolume(b, 168) - getVolume(a, 168))
        break
      default:
        // 默认按创建时间排序
        filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        break
    }

    return filtered
  }

  // 计算交易量
  const getVolume = (item: MarketItem, hours: number) => {
    const timeThreshold = new Date(Date.now() - hours * 60 * 60 * 1000)
    return item.trades
      .filter((trade: Trade) => new Date(trade.timestamp) > timeThreshold)
      .reduce((sum: number, trade: Trade) => sum + trade.aptAmount, 0)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 使用活动滚动组件 */}
      <div className="mb-8">
        <ActivityScroll 
          speed={30}
          updateInterval={3000}
          initialCount={20}
        />
      </div>

      {/* Top Cards */}
      <div className="relative mb-8">
        {/* 卡片容器 */}
        <div 
          className="flex md:justify-center gap-4 overflow-x-auto scrollbar-hide md:mx-0"
          style={{ 
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <div className="snap-center shrink-0 first:pl-4 last:pr-4 md:first:pl-0 md:last:pr-0">
            <TopCard title="Top Gainer" item={getTopGainer()} />
          </div>
          <div className="snap-center shrink-0">
            <TopCard title="Top Volume" item={getTopVolume()} />
          </div>
        </div>
      </div>

      {/* 筛选工具栏 */}
      <div className="mb-8 space-y-4">
        <h1 className="text-2xl font-bold mb-6 px-4">Sort</h1>
        <div className="flex flex-col md:flex-row gap-4 px-4">
          {/* 搜索框 */}
          <div className="flex-1">
            <Input
              placeholder="Search by name or symbol..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-[10px]"
            />
          </div>
          
          {/* 排序选择 */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[200px] rounded-[10px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="creation-time">Creation Time</SelectItem>
                <SelectItem value="featured">Featured 🔥</SelectItem>
                <SelectItem value="last-trade">Last Trade</SelectItem>
                <SelectItem value="last-reply">Last Reply</SelectItem>
                <SelectItem value="market-cap-high">Market Cap (High to Low)</SelectItem>
                <SelectItem value="market-cap-low">Market Cap (Low to High)</SelectItem>
                <SelectItem value="volume-24h-high">Volume 24H (High to Low)</SelectItem>
                <SelectItem value="volume-7d-high">Volume 7D (High to Low)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Bonding Progress 筛选 */}
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-full md:w-[200px] rounded-[10px]">
              <SelectValue placeholder="Bonding Progress" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Progress</SelectItem>
                <SelectItem value="bonding-0-25">0% - 25%</SelectItem>
                <SelectItem value="bonding-25-50">25% - 50%</SelectItem>
                <SelectItem value="bonding-50-75">50% - 75%</SelectItem>
                <SelectItem value="bonding-75-100">75% - 100%</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 卡片列表 */}
      <CardList initialData={getFilteredData()} />
    </div>
  )
}

export default Markets