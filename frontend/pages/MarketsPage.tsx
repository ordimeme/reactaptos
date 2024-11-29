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

export default function MarketsPage() {
  const { tokenPrices, initializePrice } = usePriceContext();
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("creation-time")
  const [filterBy, setFilterBy] = useState("all")
  const [filteredData, setFilteredData] = useState(marketData)

  // 初始化所有代币的价格
  useEffect(() => {
    console.log('Initializing prices for all tokens');
    marketData.forEach(token => {
      initializePrice(token);
    });
  }, [initializePrice]);

  // 监听价格更新
  useEffect(() => {
    console.log('Token prices updated:', tokenPrices);
  }, [tokenPrices]);

  // 更新过滤后的数据
  useEffect(() => {
    const sortedData = getFilteredAndSortedData(
      marketData.map(token => ({
        ...token,
        currentPrice: parseFloat(tokenPrices[token.id]?.close || token.currentPrice.toString()),
        priceChange24h: parseFloat(tokenPrices[token.id]?.change24h || '0')
      })) as MarketItem[],
      searchTerm,
      filterBy,
      sortBy
    );
    setFilteredData(sortedData);
  }, [searchTerm, sortBy, filterBy, tokenPrices]);

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      {/* Activity Scroll */}
      <div className="mb-8">
        <ActivityScroll speed={30} updateInterval={5000} initialCount={10} />
      </div>

      {/* Top Cards */}
      <div className="overflow-hidden mb-8">
        <div className="flex md:justify-center gap-4 overflow-x-auto scrollbar-hide px-4 md:px-0 -mx-4 md:mx-0">
          <div className="flex-none w-[85%] md:w-auto">
            <TopCard 
              title="Top Gainer" 
              item={getTopGainer(marketData)}
              price={tokenPrices[getTopGainer(marketData).id]}
            />
          </div>
          <div className="flex-none w-[85%] md:w-auto">
            <TopCard 
              title="Top Volume" 
              item={getTopVolume(marketData)}
              price={tokenPrices[getTopVolume(marketData).id]}
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

      {/* 所有代币列表 */}
      <CardList 
        initialData={filteredData} 
        tokenPrices={tokenPrices}
      />
    </div>
  )
}