import { Link, useLocation } from "react-router-dom"
import { IS_DEV } from "@/constants";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "./ui/button";

export function NavLink() {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    // 主导航链接
    const mainLinks = [
        { id: 1, to: '/markets', label: 'Market' },
        { id: 2, to: '/create', label: 'Create' },
    ];

    // LP Token 下拉菜单链接
    const lpLinks = [
        { id: 1, to: '/mint', label: 'Mint' },
        { id: 2, to: '/stake', label: 'Stake' },
        { id: 3, to: '/my-assets', label: 'MyAssets' },
    ];

    return (
        <div className="flex items-center gap-1 md:gap-2">
            {/* 主导航链接 */}
            {mainLinks.map((link) => (
                <Link 
                    key={link.id}
                    to={link.to}
                    className={cn(
                        "px-2 md:px-3 py-2 rounded-md relative text-sm md:text-base font-normal",
                        "hover:bg-[var(--softBg)]",
                        isActive(link.to) && "after:absolute after:bottom-0 after:left-[30%] after:right-[30%] after:h-[2px] after:bg-foreground after:content-['']"
                    )}
                >
                    {link.label}
                </Link>
            ))}

            {/* LP Token 下拉菜单 */}
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
                    {lpLinks.map((link) => (
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
        </div>
    )
}