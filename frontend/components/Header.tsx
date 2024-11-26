import { IS_DEV } from "@/constants";
import { useState, useContext } from "react";
import { ThemeContext } from '@/context/ThemeContext'
import { Link } from "react-router-dom";
import { WalletSelector } from "./WalletSelector";
import { buttonVariants } from "./ui/button";
import ThemeToggle from "./ThemeToggle";
import NavMobile from "./NavMobile";
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // const title = useMemo(() => {
  //   if (!isRoot) return "Fungible Asset Launchpad";
  //   return data?.asset.symbol.toUpperCase() ?? config.defaultAsset?.name ?? "Fungible Asset Launchpad";
  // }, [isRoot, data?.asset]);

  return (
    <div className="px-4 h-[100px] flex items-center justify-between">
      <div className="flex-1">
        <Link to="/markets" className="flex items-center gap-4">
          <img 
            src={theme === 'dark' ? '/aptos-dark.svg' : '/aptos.png'} 
            alt='React + Aptos'
            title='React + Aptos'
            className="h-12 w-auto pl-2"
          />
          <h1 className="font-bold text-2xl md:text-4xl hidden md:block">ReactAptos</h1>
        </Link>
      </div>

      <div className="hidden lg:flex flex-1 items-center">

        <Link className={buttonVariants({ variant: "link" })} to={"/markets"}>
            Market
        </Link>
        <Link className={buttonVariants({ variant: "link" })} to={"/mint"}>
            Mint
        </Link>
        <Link className={buttonVariants({ variant: "link" })} to={"/my-assets"}>
            MyAssets
        </Link>
        <Link className={buttonVariants({ variant: "link" })} to={"/stake"}>
            Stake
        </Link>
        {IS_DEV && (
        <Link className={buttonVariants({ variant: "link" })} to={"/create-asset"}>
            Create
        </Link>
        )}
    </div>
    <div className="flex gap-1 lg:gap-4">
          <div className="ml-auto mx-2">
          <Select 
            value={selectedNetwork}
            onValueChange={setSelectedNetwork}
          >
            <SelectTrigger className="w-[100px] md:w-[180px]">
              <SelectValue>{selectedNetwork}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Solana">Solana</SelectItem>
                <SelectItem value="Move">Move</SelectItem>
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
