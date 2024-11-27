import { Link } from "react-router-dom"
import { IS_DEV } from "@/constants";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "./ui/button";

export function NavLink() {
    const links = [
        {id:1, to: '/mint', label: 'Mint' },
        {id:2, to: '/stake', label: 'Stake' },
        {id:3, to: '/my-assets', label: 'MyAssets' },
    ];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button 
                    variant="ghost"
                    className="px-3 py-2 rounded-md text-base font-normal flex items-center gap-1 hover:bg-[var(--softBg)] focus-visible:ring-0 focus-visible:ring-offset-0 hover:no-underline"
                >
                    LP Token
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                {links.map((link) => (
                    <DropdownMenuItem key={link.id} asChild>
                        <Link 
                            to={link.to}
                            className="w-full cursor-pointer text-base"
                        >
                            {link.label}
                        </Link>
                    </DropdownMenuItem>
                ))}
                {IS_DEV && (
                    <DropdownMenuItem asChild>
                        <Link 
                            to="/create-asset"
                            className="w-full cursor-pointer text-base"
                        >
                            Create Token
                        </Link>
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}