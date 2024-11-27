import { cn } from "@/lib/utils";

interface BottomNavProps {
  activeTab: "buy/sell" | "info" | "chart" | "txs";
  setActiveTab: (tab: "buy/sell" | "info" | "chart" | "txs") => void;
}

export function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const navItems = [
    { id: "buy/sell", label: "[Buy/Sell]" },
    { id: "info", label: "[Info]" },
    { id: "chart", label: "[Chart]" },
    { id: "txs", label: "[Txs]" },
  ] as const;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-muted/40 dark:border-muted/20 lg:hidden">
      <nav className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "px-4 py-2 text-sm font-mono",
              activeTab === item.id 
                ? "text-foreground" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
} 