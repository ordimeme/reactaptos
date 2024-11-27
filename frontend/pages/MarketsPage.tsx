import { useState, useEffect } from "react"
import { marketData, MarketItem, Trade } from "@/data/marketData"
import CardList from "@/components/CardList"
import TopCard from "@/components/TopCard"
import SortAndSearch from "@/components/SortAndSearch"
import ActivityScroll from "@/components/ActivityScroll"

export default function MarketsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("creation-time")
  const [filterBy, setFilterBy] = useState("all")
  const [filteredData, setFilteredData] = useState(marketData)

  // 获取 Top Gainer 和 Top Volume 数据
  const getTopGainer = () => {
    return [...marketData].sort((a, b) => b.priceChange24h - a.priceChange24h)[0]
  }

  const getTopVolume = () => {
    return [...marketData].sort((a, b) => getVolume(b, 24) - getVolume(a, 24))[0]
  }

  // 计算交易量
  const getVolume = (item: MarketItem, hours: number) => {
    const timeThreshold = new Date(Date.now() - hours * 60 * 60 * 1000)
    return item.trades
      .filter((trade: Trade) => new Date(trade.timestamp) > timeThreshold)
      .reduce((sum: number, trade: Trade) => sum + trade.aptAmount, 0)
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

  useEffect(() => {
    setFilteredData(getFilteredData())
  }, [searchTerm, sortBy, filterBy])

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      {/* Activity Scroll */}
      <div className="mb-8">
        <ActivityScroll speed={30} updateInterval={5000} initialCount={10} />
      </div>

      {/* Top Cards */}
      <div className="overflow-hidden mb-8">
        <div className="flex snap-x snap-mandatory touch-pan-x overflow-x-auto scrollbar-hide">
          <div className="flex md:justify-center md:w-full">
            <div className="flex gap-4 md:gap-8 min-w-min md:mx-auto">
              <div className="snap-start">
                <TopCard title="Top Gainer" item={getTopGainer()} />
              </div>
              <div className="snap-start">
                <TopCard title="Top Volume" item={getTopVolume()} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 搜索、排序和筛选 */}
      <SortAndSearch
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
        filterBy={filterBy}
        setFilterBy={setFilterBy}
      />

      {/* 所有代币列表 */}
      <CardList initialData={filteredData} />
    </div>
  )
}