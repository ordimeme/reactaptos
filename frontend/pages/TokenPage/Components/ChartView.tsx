import { useEffect, useContext, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MarketItem } from "@/types/market";
import { ThemeContext } from "@/context/ThemeContext";
import { getPriceData } from "@/data/priceData";

declare global {
  interface Window {
    TradingView?: any;
  }
}

interface ChartViewProps {
  token: MarketItem;
}

export function ChartView({ token }: ChartViewProps) {
  const { theme } = useContext(ThemeContext);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [interval, setInterval] = useState("1h");
  const [chartData] = useState(() => getPriceData(token.symbol, token.price));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    const container = document.getElementById('tradingview_chart');
    if (!container) {
      setError('Chart container not found');
      setIsLoading(false);
      return;
    }

    try {
      container.innerHTML = '';

      const config = {
        autosize: true,
        symbol: token.symbol,
        interval: interval === "1h" ? "60" : interval,
        timezone: "Etc/UTC",
        theme: theme === 'dark' ? 'dark' : 'light',
        style: "1",
        locale: "en",
        enable_publishing: false,
        hide_legend: !isMobile,
        hide_side_toolbar: isMobile,
        allow_symbol_change: false,
        save_image: false,
        container_id: "tradingview_chart",
        library_path: "/charting_library/",
        fullscreen: false,
        height: isMobile ? 300 : 600,
        studies_overrides: {},
        disabled_features: [
          "header_symbol_search",
          "header_settings",
          "header_compare",
          "header_undo_redo",
          "header_screenshot",
          "header_saveload",
          "create_volume_indicator_by_default",
        ],
        enabled_features: [
          "use_localstorage_for_settings",
        ],
        charts_storage_url: 'https://saveload.tradingview.com',
        client_id: 'tradingview.com',
        user_id: 'public_user',
        datafeed: {
          onReady: (callback: any) => {
            callback({
              supported_resolutions: ["5", "15", "60", "240", "D", "W"],
              supports_time: true,
              supports_marks: false,
              supports_timescale_marks: false,
            });
          },
          searchSymbols: () => {},
          resolveSymbol: (_symbolName: string, onSymbolResolvedCallback: any) => {
            onSymbolResolvedCallback({
              name: token.symbol,
              full_name: token.symbol,
              description: token.name,
              type: "crypto",
              session: "24x7",
              timezone: "Etc/UTC",
              exchange: "",
              listed_exchange: "",
              minmov: 1,
              pricescale: 10000,
              has_intraday: true,
              has_daily: true,
              has_weekly_and_monthly: true,
              supported_resolutions: ["5", "15", "60", "240", "D", "W"],
              data_status: "streaming",
              volume_precision: 2,
            });
          },
          getBars: (_symbolInfo: any, _resolution: string, periodParams: any, onHistoryCallback: any, onErrorCallback: any) => {
            try {
              const { from, to } = periodParams;
              
              const filteredBars = chartData.filter(bar => {
                return bar.time >= from && bar.time <= to;
              });

              if (filteredBars.length > 0) {
                onHistoryCallback(filteredBars, { noData: false });
              } else {
                onHistoryCallback([], { noData: true });
              }
            } catch (error) {
              console.error('Error in getBars:', error);
              onErrorCallback(error);
            }
          },
          subscribeBars: () => {},
          unsubscribeBars: () => {},
        },
      };

      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => {
        if (window.TradingView) {
          try {
            new window.TradingView.widget(config);
            setIsLoading(false);
          } catch (error) {
            setError('Failed to initialize chart');
            setIsLoading(false);
          }
        }
      };
      script.onerror = () => {
        setError('Failed to load TradingView library');
        setIsLoading(false);
      };

      document.head.appendChild(script);

      return () => {
        container.innerHTML = '';
        const existingScript = document.querySelector('script[src="https://s3.tradingview.com/tv.js"]');
        if (existingScript) {
          document.head.removeChild(existingScript);
        }
      };
    } catch (error) {
      setError('Chart initialization failed');
      setIsLoading(false);
    }
  }, [theme, interval, token.symbol, isMobile, chartData]);

  return (
    <Card className="border-muted/40 dark:border-muted/20 w-full">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-base">Price Chart</CardTitle>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
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
        {isLoading && <div>加载中...</div>}
        {error && <div className="text-red-500">{error}</div>}
        <div 
          id="tradingview_chart"
          className="w-full rounded-lg overflow-hidden"
          style={{ 
            height: isMobile ? '300px' : '600px',
            backgroundColor: theme === 'dark' ? "#1a1b1e" : "#ffffff",
            display: isLoading || error ? 'none' : 'block'
          }}
        />
      </CardContent>
    </Card>
  );
} 