import { useState, useEffect, useRef } from "react"
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
  
  // 滑动相关状态
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // 处理触摸开始
  const handleTouchStart = (e: TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - (scrollContainerRef.current?.offsetLeft || 0));
    setScrollLeft(scrollContainerRef.current?.scrollLeft || 0);
  };

  // 处理触摸移动
  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const x = e.touches[0].pageX - (scrollContainerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  // 处理触摸结束
  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // 添加触摸事件监听
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('touchstart', handleTouchStart);
      container.addEventListener('touchmove', handleTouchMove);
      container.addEventListener('touchend', handleTouchEnd);

      return () => {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, startX, scrollLeft]);

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

      {/* Top Cards - 添加滑动容器 */}
      <div className="overflow-hidden mb-8">
        <div 
          ref={scrollContainerRef}
          className="flex md:justify-center gap-4 overflow-x-auto scrollbar-hide px-4 md:px-0 -mx-4 md:mx-0"
          style={{
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
            scrollSnapType: 'x mandatory'
          }}
        >
          <div className="flex-none w-[85%] md:w-auto scroll-snap-align-start">
            <TopCard 
              title="Top Gainer" 
              item={getTopGainer(marketData)}
              price={tokenPrices[getTopGainer(marketData).id]}
            />
          </div>
          <div className="flex-none w-[85%] md:w-auto scroll-snap-align-start">
            <TopCard 
              title="Top Volume" 
              item={getTopVolume(marketData)}
              price={tokenPrices[getTopVolume(marketData).id]}
            />
          </div>
        </div>
      </div>

      {/* 搜索、排序和筛选 */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-xl py-4 -mx-4 px-4">
        <SortAndSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
          filterBy={filterBy}
          setFilterBy={setFilterBy}
        />
      </div>

      {/* 所有代币列表 */}
      <CardList 
        initialData={filteredData} 
        tokenPrices={tokenPrices}
      />
    </div>
  );
}