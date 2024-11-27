import { Button } from "./ui/button"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  scrollToRef?: React.RefObject<HTMLElement>;
}

export function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  scrollToRef 
}: PaginationProps) {
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

  // 生成要显示的页码数组
  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    const showEllipsis = totalPages > 7;
    
    if (!showEllipsis) {
      // 如果总页数小于等于7，显示所有页码
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // 始终显示第一页
    pageNumbers.push(1);

    if (currentPage > 3) {
      pageNumbers.push('...');
    }

    // 计算中间要显示的页码
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    // 调整开始和结束位置
    if (currentPage <= 3) {
      end = 4;
    }
    if (currentPage >= totalPages - 2) {
      start = totalPages - 3;
    }

    // 添加中间的页码
    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    if (currentPage < totalPages - 2) {
      pageNumbers.push('...');
    }

    // 始终显示最后一页
    pageNumbers.push(totalPages);

    return pageNumbers;
  };

  return (
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
  )
} 