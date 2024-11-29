import { Link } from "react-router-dom"
import { MarketItem, PriceData } from "@/types/market"
import Card from "./Card"
import { Pagination } from "./Pagination"
import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

const ITEMS_PER_PAGE = 18

interface CardListProps {
  initialData: MarketItem[]
  tokenPrices?: Record<string, PriceData>
}

const CardList = ({ initialData, tokenPrices = {} }: CardListProps) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [data, setData] = useState<MarketItem[]>(initialData)
  const listRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    setData(initialData)
    setCurrentPage(1)
  }, [initialData])

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE)
  
  const getCurrentPageData = (): MarketItem[] => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return data.slice(startIndex, endIndex)
  }

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  return (
    <div className="max-w-[1400px] mx-auto">
      <h1 className="text-2xl font-bold mb-8">Assets</h1>
      <div 
        ref={listRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {getCurrentPageData().map((item, index) => (
          <Link 
            key={item.id} 
            to={`/token/${item.id}`} 
            className={cn(
              "hover:no-underline",
              index === 0 && "animate-first-card"
            )}
          >
            <Card 
              item={item} 
              price={tokenPrices[item.id]} 
            />
          </Link>
        ))}
      </div>

      {data.length > ITEMS_PER_PAGE && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          scrollToRef={listRef}
        />
      )}
    </div>
  )
}

export default CardList