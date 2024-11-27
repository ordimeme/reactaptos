import { useState, useContext } from "react";
import { ThemeContext } from '@/context/ThemeContext'
import { Link, useLocation } from "react-router-dom";
import { WalletSelector } from "./WalletSelector";
import ThemeToggle from "./ThemeToggle";
import { NavLink } from "./NavLink";
import NavMobile from "./NavMobile";
import { cn } from "@/lib/utils";
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
  // const [selectedNetwork, setSelectedNetwork] = useState("Aptos")
  const [selectedNetwork, setSelectedNetwork] = useState("Move")
  const { theme } = useContext(ThemeContext);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // 判断链接是否活跃
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    //logo area
    <div className="px-4 h-[100px] flex items-center justify-between max-w-[1400px] mx-auto w-full">
      <div className="flex-1">
        <Link to="/markets" className="flex items-center gap-4">
          <img 
            src={theme === 'dark' ? '/aptos-dark.svg' : '/aptos.png'} 
            alt='React + Aptos'
            title='React + Aptos'
            className="h-12 w-auto pl-2"
          />
          <h1 className="font-bold text-2xl md:text-4xl hidden md:block">Aptostar</h1>
        </Link>
      </div>
    
      <div className="hidden lg:flex flex-1 items-center gap-2">
        <Link 
          className={cn(
            "px-3 py-2 rounded-md relative text-base font-normal",
            "hover:bg-[var(--softBg)]",
            isActive("/markets") && "after:absolute after:bottom-0 after:left-[30%] after:right-[30%] after:h-[2px] after:bg-foreground after:content-['']"
          )} 
          to={"/markets"}
        >
          Market
        </Link>
        <Link 
         className={cn(
          "px-3 py-2 rounded-md relative text-base font-normal",
          "hover:bg-[var(--softBg)]",
          isActive("/create") && "after:absolute after:bottom-0 after:left-[30%] after:right-[30%] after:h-[2px] after:bg-foreground after:content-['']"
        )} 
          to={"/create"}
        >
          Create
        </Link>
        <NavLink />
      </div>


    <div className="flex gap-1 lg:gap-4">
          <div className="ml-auto mx-2">
          <Select 
            value={selectedNetwork}
            onValueChange={setSelectedNetwork}
          >
            <SelectTrigger className="w-[120px] md:w-[160px]">
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
        </div>
        <div className="hidden md:flex items-center">
        <ThemeToggle />
        </div>
        <div className="lg:hidden flex">
          <NavMobile 
            isOpen={isMenuOpen} 
            toggleMenu={toggleMenu} 
          />
        </div>
    </div>
  )
}
