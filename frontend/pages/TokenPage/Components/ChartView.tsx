import { useEffect, useContext, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MarketItem } from "@/types/market";
import { ThemeContext } from "@/context/ThemeContext";

interface ChartViewProps {
  token: MarketItem;
}

export function ChartView({ token }: ChartViewProps) {
  const { theme } = useContext(ThemeContext);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [interval, setInterval] = useState("1h");

  // 时间间隔选项
  const intervals = [
    { value: "5m", label: "5m" },
    { value: "15m", label: "15m" },
    { value: "1h", label: "1h" },
    { value: "4h", label: "4h" },
    { value: "1d", label: "1D" },
    { value: "1w", label: "1W" },
  ];

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Card className="border-muted/40 dark:border-muted/20 w-full">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-base">Price Chart</CardTitle>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            {/* 时间间隔选择器 */}
            <div className="grid grid-cols-3 sm:flex gap-1 w-full sm:w-auto">
              {intervals.map((item) => (
                <Button
                  key={item.value}
                  variant={interval === item.value ? "default" : "ghost"}
                  size="sm"
                  className="h-7 px-2 text-xs font-mono"
                  onClick={() => setInterval(item.value)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
            <div className="text-sm text-muted-foreground font-mono w-full sm:w-auto text-center sm:text-right">
              ${token.price.toFixed(2)}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <iframe
          src={`https://dexscreener.com/aptos/aptosswap?embed=1&theme=${theme === 'dark' ? 'dark' : 'light'}&trades=0&info=0`}
          style={{
            width: '100%',
            height: isMobile ? '300px' : '600px',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: theme === 'dark' ? "#1a1b1e" : "#ffffff"
          }}
        />
      </CardContent>
    </Card>
  );
} 