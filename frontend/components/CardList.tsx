import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { MarketItem } from "@/data/marketData"
import Card from "./Card"
import { Button } from "./ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const ITEMS_PER_PAGE = 18

interface CardListProps {
  initialData: MarketItem[]
}

const CardList = ({ initialData }: CardListProps) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [data, setData] = useState<MarketItem[]>(initialData)
  
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
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="max-w-[1400px] mx-auto">
      <h1 className="text-2xl font-bold mb-8">Assets</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getCurrentPageData().map((item) => (
          <Link 
            key={item.id} 
            to={`/token/${item.id}`} 
            className="hover:no-underline"
          >
            <Card item={item} />
          </Link>
        ))}
      </div>

      {/* 分页控制器 */}
      <div className="flex justify-center items-center gap-3 mt-12">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-9 w-9"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
          <Button
            key={pageNumber}
            variant={currentPage === pageNumber ? "default" : "outline"}
            onClick={() => handlePageChange(pageNumber)}
            className="h-9 w-9"
          >
            {pageNumber}
          </Button>
        ))}

        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-9 w-9"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default CardList