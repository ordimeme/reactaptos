import { cn } from "@/lib/utils";
import { Wallet, Info, LineChart } from "lucide-react";

interface BottomNavProps {
  activeTab: "buy/sell" | "info" | "txs";
  setActiveTab: (tab: "buy/sell" | "info" | "txs") => void;
}

export function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const navItems = [
    { id: "buy/sell", label: "[Buy/Sell]", icon: Wallet },
    { id: "info", label: "[Info]", icon: Info },
    { id: "txs", label: "[Info]", icon: LineChart },
  ] as const;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-muted/20 lg:hidden">
      <nav className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-2 transition-colors duration-200",
                  activeTab === item.id 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 transition-transform",
                  activeTab === item.id && "scale-110"
                )} />
                <span className="text-xs font-medium">
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