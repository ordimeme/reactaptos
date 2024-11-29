import React, { useMemo } from 'react'
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from '@/lib/utils'
import { MarketItem } from '@/types/market'
import { useNavigate } from 'react-router-dom'

interface SortAndSearchProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  sortBy: string
  setSortBy: (sort: string) => void
  filterBy: string
  setFilterBy: (filter: string) => void
  tokens?: MarketItem[]
}

const SORT_OPTIONS = [
  { value: "creation-time", label: "Latest" },
  { value: "market-cap-high", label: "Market Cap" },
  { value: "volume-24h-high", label: "Volume" },
  { value: "liquidity-high", label: "Liquidity" },
  { value: "last-trade", label: "Last Trade" }
] as const;

const FILTER_OPTIONS = [
  { value: "all", label: "Progress" },
  { value: "bonding-0-25", label: "0-25%" },
  { value: "bonding-25-50", label: "25-50%" },
  { value: "bonding-50-75", label: "50-75%" },
  { value: "bonding-75-100", label: "75-100%" }
] as const;

const SortAndSearch: React.FC<SortAndSearchProps> = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  filterBy,
  setFilterBy,
  tokens = []
}) => {
  const navigate = useNavigate();

  // 客户端搜索逻辑
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    
    const searchLower = searchTerm.toLowerCase();
    return tokens
      .filter(token => 
        token.name.toLowerCase().includes(searchLower) ||
        token.symbol.toLowerCase().includes(searchLower)
      )
      .slice(0, 5);
  }, [searchTerm, tokens]);

  const handleTokenClick = (tokenId: string) => {
    setSearchTerm('');
    navigate(`/token/${tokenId}`);
  };

  return (
    <div className="mb-8 max-w-[1400px] mx-auto w-full">
      <div className="space-y-3 lg:space-y-0 lg:flex lg:items-center lg:gap-3">
        {/* 搜索区域 */}
        <div className="relative lg:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name or symbol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
          
          {/* 搜索结果下拉 - 只在有结果时显示 */}
          {searchResults.length > 0 && (
            <div 
              className={cn(
                "absolute left-0 right-0 top-full mt-1",
                "bg-background/95 backdrop-blur-sm rounded-lg shadow-lg",
                "max-h-[300px] overflow-y-auto z-50",
                "border border-border/50",
                "animate-in fade-in-0 slide-in-from-top-1"
              )}
            >
              {searchResults.map((token) => (
                <div 
                  key={token.id}
                  className="flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleTokenClick(token.id)}
                >
                  <img 
                    src={`/tokens/${token.symbol.toLowerCase()}.svg`}
                    alt={token.name}
                    className="w-8 h-8 rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/tokens/default.svg';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{token.name}</div>
                    <div className="text-sm text-muted-foreground">{token.symbol}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 排序和筛选选择器 */}
        <div className={cn(
          "grid grid-cols-2 gap-2",
          "lg:flex lg:items-center lg:gap-2 lg:w-[400px]"
        )}>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent align="end">
              {SORT_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent align="end">
              {FILTER_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default SortAndSearch; 