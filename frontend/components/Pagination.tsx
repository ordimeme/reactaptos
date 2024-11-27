import { Button } from "./ui/button"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

interface PaginationProps<T> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  scrollToRef?: React.RefObject<HTMLElement>;
  items?: T[];
  itemsPerPage?: number;
  renderItem?: (item: T, index: number) => React.ReactNode;
}

export function Pagination<T>({ 
  currentPage, 
  totalPages, 
  onPageChange,
  scrollToRef,
  items,
  itemsPerPage,
  renderItem
}: PaginationProps<T>) {
  const handlePageChange = (page: number) => {
    onPageChange(page);
    
    if (scrollToRef?.current) {
      const elementTop = scrollToRef.current.getBoundingClientRect().top;
      const offsetPosition = elementTop + window.pageYOffset - 100;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // 如果提供了 items 和 renderItem，则渲染列表
  const renderItems = () => {
    if (!items || !renderItem || !itemsPerPage) return null;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex).map((item, index) => renderItem(item, index));
  };

  // 生成要显示的页码数组
  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    const showEllipsis = totalPages > 7;
    
    if (!showEllipsis) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pageNumbers.push(1);

    if (currentPage > 3) {
      pageNumbers.push('...');
    }

    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    if (currentPage <= 3) {
      end = 4;
    }
    if (currentPage >= totalPages - 2) {
      start = totalPages - 3;
    }

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    if (currentPage < totalPages - 2) {
      pageNumbers.push('...');
    }

    pageNumbers.push(totalPages);

    return pageNumbers;
  };

  return (
    <>
      {/* 渲染列表项 */}
      {renderItems()}

      {/* 分页控件 */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 w-8 md:h-9 md:w-9"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex gap-1 md:gap-2">
          {getPageNumbers().map((pageNumber, index) => (
            pageNumber === '...' ? (
              <div 
                key={`ellipsis-${index}`} 
                className="flex items-center justify-center w-8 md:w-9"
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
            ) : (
              <Button
                key={pageNumber}
                variant={currentPage === pageNumber ? "default" : "outline"}
                onClick={() => handlePageChange(pageNumber as number)}
                className="h-8 w-8 md:h-9 md:w-9 text-xs md:text-sm"
              >
                {pageNumber}
              </Button>
            )
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 w-8 md:h-9 md:w-9"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </>
  )
} 