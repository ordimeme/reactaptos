import { useState, useContext } from "react";
import { ThemeContext } from '@/context/ThemeContext'
import { Link } from "react-router-dom";
import { WalletSelector } from "./WalletSelector";
import ThemeToggle from "./ThemeToggle";
import { NavLink } from "./NavLink";
import NavMobile from "./NavMobile";
import { NetworkSelector } from "./NetworkSelector";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedNetwork, setSelectedNetwork] = useState("Move")
  const { theme } = useContext(ThemeContext);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className="w-full border-b border-border/40">
      <div className="max-w-[1400px] mx-auto px-4 h-[100px] flex items-center justify-between">
        {/* Logo */}
        <div className="flex-1">
          <Link to="/markets" className="flex items-center gap-2 md:gap-4">
            <img 
              src={theme === 'dark' ? '/aptos-dark.svg' : '/aptos.png'} 
              alt='React + Aptos'
              title='React + Aptos'
              className="h-12 w-auto"
            />
            <h1 className="font-bold text-xl md:text-4xl hidden md:block">Aptostar</h1>
          </Link>
        </div>
      
        {/* Navigation Links */}
        <div className="hidden lg:flex flex-1 items-center">
          <NavLink />
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-1 md:gap-4">
          <div className="mx-1 md:mx-2">
            <NetworkSelector 
              selectedNetwork={selectedNetwork}
              onNetworkChange={setSelectedNetwork}
            />
          </div>
          <WalletSelector />
          <div className="hidden md:flex items-center ml-1 md:ml-2">
            <ThemeToggle />
          </div>
          <div className="lg:hidden flex ml-1">
            <NavMobile isOpen={isMenuOpen} toggleMenu={toggleMenu} />
          </div>
        </div>
      </div>
    </div>
  )
}