import React, { useState } from 'react'
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { cn } from '@/lib/utils'

interface SortAndSearchProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  sortBy: string
  setSortBy: (sort: string) => void
  filterBy: string
  setFilterBy: (filter: string) => void
}

const SortAndSearch: React.FC<SortAndSearchProps> = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  filterBy,
  setFilterBy
}) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const handleSearchClick = () => {
    setIsSearchExpanded(true);
  };

  const handleCloseSearch = () => {
    setIsSearchExpanded(false);
    setSearchTerm('');
  };

  return (
    <div className="mb-8 max-w-[1400px] mx-auto w-full">
      {/* 移动端搜索展开时的遮罩 */}
      {isSearchExpanded && (
        <div 
          className="fixed inset-0 bg-background/95 backdrop-blur-sm z-40"
          onClick={handleCloseSearch}
        />
      )}

      {/* 主要内容区域 */}
      <div className="flex items-center gap-2">
        {/* 搜索区域 */}
        <div className={cn(
          "transition-all duration-200 ease-out",
          isSearchExpanded 
            ? "fixed inset-x-0 top-0 bg-background z-50" 
            : "w-10 lg:flex-grow"
        )}>
          {isSearchExpanded ? (
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center gap-2 max-w-[400px] mx-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search by name or symbol..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4"
                    autoFocus
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCloseSearch}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSearchClick}
              className="lg:hidden"
            >
              <Search className="h-4 w-4" />
            </Button>
          )}
          
          {/* 桌面端搜索框 */}
          <div className="hidden lg:block relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name or symbol..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* 排序和筛选选择器 */}
        {!isSearchExpanded && (
          <div className="flex items-center gap-2 flex-1 lg:flex-none">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[90px] lg:w-[200px]">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="creation-time">Latest</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="last-trade">Last Trade</SelectItem>
                <SelectItem value="last-reply">Last Reply</SelectItem>
                <SelectItem value="market-cap-high">Market Cap</SelectItem>
                <SelectItem value="volume-24h-high">24h Volume</SelectItem>
                <SelectItem value="volume-7d-high">7d Volume</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-[105px] lg:w-[200px]">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="all">Progress</SelectItem>
                <SelectItem value="bonding-0-25">0-25%</SelectItem>
                <SelectItem value="bonding-25-50">25-50%</SelectItem>
                <SelectItem value="bonding-50-75">50-75%</SelectItem>
                <SelectItem value="bonding-75-100">75-100%</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
};

export default SortAndSearch; 