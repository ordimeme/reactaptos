import { cn } from "@/lib/utils";
import { Wallet, Info, LineChart } from "lucide-react";

interface BottomNavProps {
  activeTab: "buy/sell" | "info" | "txs";
  setActiveTab: (tab: "buy/sell" | "info" | "txs") => void;
}

export function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const navItems = [
    { id: "buy/sell", label: "Buy/Sell", icon: Wallet },
    { id: "info", label: "Info", icon: Info },
    { id: "txs", label: "Txs", icon: LineChart },
  ] as const;

  return (
    <div className="fixed bottom-4 left-0 right-0 lg:hidden z-40 px-4">
      <nav className="max-w-md mx-auto">
        <div className="flex items-stretch bg-background/80 backdrop-blur-lg border border-border/50 rounded-full shadow-lg shadow-black/5">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isFirst = index === 0;
            const isLast = index === navItems.length - 1;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "flex items-center justify-center gap-1.5 flex-1 py-2.5 transition-all duration-200",
                  isFirst && "rounded-l-full pl-4 pr-2",
                  isLast && "rounded-r-full pr-4 pl-2",
                  !isFirst && !isLast && "px-2",
                  isActive && "bg-primary/10 text-primary",
                  !isActive && "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn(
                  "h-4 w-4",
                  "transition-transform duration-200",
                  isActive && "scale-105"
                )} />
                <span className={cn(
                  "text-xs font-medium",
                  isActive ? "opacity-100" : "opacity-70"
                )}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
} 