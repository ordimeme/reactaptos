import { useState } from "react"
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

const Markets = () => {
  const [sortBy, setSortBy] = useState<string>("newest")
  const [searchTerm, setSearchTerm] = useState("")
  const [priceRange, setPriceRange] = useState<string>("all")

  // 获取 Top Gainer 和 Top Volume 数据
  const getTopGainer = () => {
    return [...marketData].sort((a, b) => b.price - a.price)[0]
  }

  const getTopVolume = () => {
    return [...marketData].sort((a, b) => b.price - a.price)[1]
  }


  // 顶部卡片组件
  const TopCard = ({ title, item }: { title: string; item: typeof marketData[0] }) => (
    <UICard className="group hover:shadow-md transition-all duration-300 rounded-[10px] cursor-pointer border-muted/40 dark:border-muted/20 flex-1 w-[calc(100vw-10rem)] md:w-[360px]">
      <CardHeader className="pb-2">
        <CardTitle className="text-base md:text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 overflow-hidden rounded-[10px] flex items-center justify-center bg-muted/50 dark:bg-muted/20">
            <img 
              src={item.imageUrl} 
              alt={item.name}
              className="w-full h-full transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
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
  )

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

    // 价格范围过滤
    switch (priceRange) {
      case "0-100":
        filtered = filtered.filter(item => item.price <= 100)
        break
      case "100-500":
        filtered = filtered.filter(item => item.price > 100 && item.price <= 500)
        break
      case "500+":
        filtered = filtered.filter(item => item.price > 500)
        break
      default:
        break
    }

    // 排序
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        break
      case "oldest":
        filtered.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      default:
        break
    }

    return filtered
  }

  return (
    <div className="container mx-auto px-4 py-8">
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
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price-high">Price High to Low</SelectItem>
                <SelectItem value="price-low">Price Low to High</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* 价格范围筛选 */}
          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className="w-full md:w-[200px] rounded-[10px]">
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="0-100">$0 - $100</SelectItem>
                <SelectItem value="100-500">$100 - $500</SelectItem>
                <SelectItem value="500+">$500+</SelectItem>
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