import React from 'react'
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-[1400px] mx-auto w-full">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by name or symbol..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
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
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder="Filter by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Progress</SelectItem>
          <SelectItem value="bonding-0-25">Progress: 0-25%</SelectItem>
          <SelectItem value="bonding-25-50">Progress: 25-50%</SelectItem>
          <SelectItem value="bonding-50-75">Progress: 50-75%</SelectItem>
          <SelectItem value="bonding-75-100">Progress: 75-100%</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export default SortAndSearch 