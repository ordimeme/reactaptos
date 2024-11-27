import { Button } from "./ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

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

  return (
    <div className="flex justify-center items-center gap-3 mt-6">
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
  )
} 