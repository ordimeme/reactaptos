import { useState, useContext } from "react";
import { ThemeContext } from '@/context/ThemeContext'
import { Link, useLocation } from "react-router-dom";
import { WalletSelector } from "./WalletSelector";
import ThemeToggle from "./ThemeToggle";
import { NavLink } from "./NavLink";
import { cn } from "@/lib/utils";
import { AlignJustify } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedNetwork, setSelectedNetwork] = useState("Move")
  const { theme } = useContext(ThemeContext);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="w-full border-b border-border/40">
      <div className="max-w-[1400px] mx-auto px-4 h-[100px] flex items-center justify-between">
        <div className="flex-1">
          <Link to="/markets" className="flex items-center gap-2 md:gap-4">
            <img 
              src={theme === 'dark' ? '/aptos-dark.svg' : '/aptos.png'} 
              alt='React + Aptos'
              title='React + Aptos'
              className="h-8 md:h-12 w-auto"
            />
            <h1 className="font-bold text-xl md:text-4xl hidden md:block">Aptostar</h1>
          </Link>
        </div>
      
        <div className="hidden lg:flex flex-1 items-center gap-1 md:gap-2">
          <Link 
            className={cn(
              "px-2 md:px-3 py-2 rounded-md relative text-sm md:text-base font-normal",
              "hover:bg-[var(--softBg)]",
              isActive("/markets") && "after:absolute after:bottom-0 after:left-[30%] after:right-[30%] after:h-[2px] after:bg-foreground after:content-['']"
            )} 
            to={"/markets"}
          >
            Market
          </Link>
          <Link 
            className={cn(
              "px-2 md:px-3 py-2 rounded-md relative text-sm md:text-base font-normal",
              "hover:bg-[var(--softBg)]",
              isActive("/create") && "after:absolute after:bottom-0 after:left-[30%] after:right-[30%] after:h-[2px] after:bg-foreground after:content-['']"
            )} 
            to={"/create"}
          >
            Create
          </Link>
          <NavLink />
        </div>

        <div className="flex items-center gap-1 md:gap-4">
          <div className="mx-1 md:mx-2">
            <Select 
              value={selectedNetwork}
              onValueChange={setSelectedNetwork}
            >
              <SelectTrigger className="w-[80px] md:w-[160px] h-8 md:h-10 text-sm md:text-base">
                <SelectValue>{selectedNetwork}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Solana">Solana</SelectItem>
                  <SelectItem value="Move">Move</SelectItem>
                  <SelectItem value="Ethereum">Ethereum</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <WalletSelector />
          <div className="hidden md:flex items-center ml-1 md:ml-2">
            <ThemeToggle />
          </div>
          <div className="lg:hidden flex ml-1">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg hover:bg-[var(--softBg)] transition-all duration-200 active:scale-95"
            >
              <AlignJustify className="h-5 w-5 md:h-6 md:w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
