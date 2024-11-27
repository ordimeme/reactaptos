declare module '@/types/tradingview' {
  export interface LibrarySymbolInfo {
    name: string;
    full_name: string;
    description: string;
    type: string;
    session: string;
    timezone: string;
    minmov: number;
    pricescale: number;
    has_intraday: boolean;
    supported_resolutions: string[];
  }

  export interface Bar {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }

  export interface DatafeedConfiguration {
    supported_resolutions: string[];
    supports_time?: boolean;
    supports_marks?: boolean;
    supports_timescale_marks?: boolean;
  }

  export interface TradingViewWidget {
    new (config: {
      symbol: string;
      interval: string;
      container_id: string;
      theme?: "light" | "dark";
      locale?: string;
      toolbar_bg?: string;
      enable_publishing?: boolean;
      allow_symbol_change?: boolean;
      save_image?: boolean;
      height?: number | string;
      width?: number | string;
      autosize?: boolean;
      show_popup_button?: boolean;
      popup_width?: string;
      popup_height?: string;
      hide_side_toolbar?: boolean;
      hide_legend?: boolean;
      hide_top_toolbar?: boolean;
      studies?: string[];
      timezone?: string;
      datafeed?: {
        onReady: (callback: (config: DatafeedConfiguration) => void) => void;
        resolveSymbol: (
          symbolName: string,
          onSymbolResolvedCallback: (symbolInfo: LibrarySymbolInfo) => void
        ) => void;
        getBars: (
          symbolInfo: LibrarySymbolInfo,
          resolution: string,
          periodParams: {
            from: number;
            to: number;
            countBack: number;
          },
          onHistoryCallback: (bars: Bar[]) => void
        ) => void;
        subscribeBars: () => void;
        unsubscribeBars: () => void;
      };
    }): void;
  }

  export interface Window {
    TradingView: {
      widget: TradingViewWidget;
    };
  }
} 