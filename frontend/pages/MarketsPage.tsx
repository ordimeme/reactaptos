import { useState, useEffect } from "react"
import { marketData } from "@/data/marketData"
import CardList from "@/components/CardList"
import TopCard from "@/components/TopCard"
import SortAndSearch from "@/components/SortAndSearch"
import ActivityScroll from "@/components/ActivityScroll"
import { 
  getTopGainer, 
  getTopVolume, 
  getFilteredAndSortedData 
} from "@/utils/calculations"
import { usePriceContext } from "@/context/PriceContext"
import { MarketItem } from "@/types/market"
import { formatDisplayPrice } from "@/utils/format"

export default function MarketsPage() {
  const { 
    tokenPrices, 
    tokenTrades, 
    volume24h, 
    liquidity, 
    bondingProgress, 
    marketCaps, 
    initializePrice 
  } = usePriceContext();
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("creation-time")
  const [filterBy, setFilterBy] = useState("all")
  const [filteredData, setFilteredData] = useState<MarketItem[]>([])

  // 初始化所有代币的价格
  useEffect(() => {
    console.log('Initializing prices for all tokens');
    marketData.forEach(token => {
      initializePrice(token);
    });
  }, [initializePrice]);

  // 更新过滤后的数据
  useEffect(() => {
    const updatedData = marketData.map(token => ({
      ...token,
      trades: tokenTrades[token.id] || token.trades,
      currentPrice: parseFloat(tokenPrices[token.id]?.close || formatDisplayPrice(token.currentPrice)),
      priceChange24h: parseFloat(tokenPrices[token.id]?.change24h || '0'),
      volume24h: volume24h[token.id] || token.volume24h,
      liquidity: liquidity[token.id] || token.liquidity,
      bondingProgress: bondingProgress[token.id] || token.bondingProgress,
      marketCap: marketCaps[token.id] || token.marketCap
    }));

    console.log('Updated market data:', {
      totalTokens: updatedData.length,
      sampleToken: {
        id: updatedData[0]?.id,
        price: formatDisplayPrice(updatedData[0]?.currentPrice),
        marketCap: formatDisplayPrice(updatedData[0]?.marketCap),
        liquidity: formatDisplayPrice(updatedData[0]?.liquidity)
      },
      marketCaps
    });

    const sortedData = getFilteredAndSortedData(
      updatedData,
      searchTerm,
      filterBy,
      sortBy
    );

    setFilteredData(sortedData);
  }, [
    searchTerm, 
    sortBy, 
    filterBy, 
    tokenPrices, 
    tokenTrades, 
    volume24h, 
    liquidity, 
    bondingProgress,
    marketCaps
  ]);

  // 获取实时的 Top Gainer 和 Top Volume，并确保有默认值
  const topGainer = getTopGainer(filteredData) || marketData[0];
  const topVolume = getTopVolume(filteredData) || marketData[0];

  // 如果数据还未加载完成，显示加载状态
  if (filteredData.length === 0) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      {/* Activity Scroll */}
      <div className="mb-8">
        <ActivityScroll 
          trades={Object.values(tokenTrades).flat()}
          speed={30} 
          initialCount={10} 
        />
      </div>

      {/* Top Cards */}
      <div className="overflow-hidden mb-8">
        <div className="flex md:justify-center gap-4 overflow-x-auto scrollbar-hide px-4 md:px-0 -mx-4 md:mx-0">
          <div className="flex-none w-[85%] md:w-auto">
            <TopCard 
              title="Top Gainer" 
              item={topGainer}
              price={tokenPrices[topGainer.id]}
            />
          </div>
          <div className="flex-none w-[85%] md:w-auto">
            <TopCard 
              title="Top Volume" 
              item={topVolume}
              price={tokenPrices[topVolume.id]}
            />
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

      {/* 代币列表 */}
      <CardList 
        initialData={filteredData} 
        tokenPrices={tokenPrices}
      />
    </div>
  )
}