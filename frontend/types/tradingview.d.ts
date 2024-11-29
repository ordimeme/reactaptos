declare module 'lightweight-charts' {
  export type Time = number | string;
  export type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> };

  export interface CandlestickData<T = Time> {
    time: T;
    open: number;
    high: number;
    low: number;
    close: number;
  }

  export interface ChartOptions {
    width: number;
    height: number;
    layout?: {
      background?: {
        type?: ColorType;
        color?: string;
      };
      textColor?: string;
      fontSize?: number;
      fontFamily?: string;
      padding?: {
        left?: number;
        right?: number;
        top?: number;
        bottom?: number;
      };
    };
    grid?: {
      vertLines?: {
        color?: string;
        style?: number;
        visible?: boolean;
      };
      horzLines?: {
        color?: string;
        style?: number;
        visible?: boolean;
      };
    };
    timeScale?: {
      timeVisible?: boolean;
      secondsVisible?: boolean;
      borderColor?: string;
      tickMarkFormatter?: (time: number) => string;
      fixLeftEdge?: boolean;
      fixRightEdge?: boolean;
      rightOffset?: number;
      leftOffset?: number;
      barSpacing?: number;
      minBarSpacing?: number;
    };
    rightPriceScale?: PriceScaleOptions;
    crosshair?: CrosshairOptions;
    handleScale?: HandleScaleOptions;
    handleScroll?: HandleScrollOptions;
  }

  export interface PriceScaleOptions {
    autoScale?: boolean;
    mode?: number;
    invertScale?: boolean;
    alignLabels?: boolean;
    scaleMargins?: {
      top?: number;
      bottom?: number;
    };
    borderVisible?: boolean;
    borderColor?: string;
    visible?: boolean;
    entireTextOnly?: boolean;
    ticksVisible?: boolean;
    format?: {
      type: 'price' | 'custom';
      precision: number;
      minMove: number;
      formatter?: (price: number) => string;
    };
  }

  export interface CrosshairOptions {
    mode?: number;
    vertLine?: LineOptions;
    horzLine?: LineOptions;
  }

  export interface HandleScaleOptions {
    axisPressedMouseMove?: {
      time?: boolean;
      price?: boolean;
    };
    mouseWheel?: boolean;
    pinch?: boolean;
  }

  export interface HandleScrollOptions {
    mouseWheel?: boolean;
    pressedMouseMove?: boolean;
    horzTouchDrag?: boolean;
    vertTouchDrag?: boolean;
  }

  export interface LineOptions {
    width?: number;
    color?: string;
    style?: number;
  }

  export interface CandlestickSeriesOptions {
    upColor?: string;
    downColor?: string;
    borderUpColor?: string;
    borderDownColor?: string;
    wickUpColor?: string;
    wickDownColor?: string;
    priceFormat?: {
      type: 'price';
      precision: number;
      minMove: number;
    };
    priceScaleId?: string;
  }

  export enum ColorType {
    Solid = 'solid',
  }

  export interface IChartApi {
    remove(): void;
    resize(width: number, height: number): void;
    timeScale(): ITimeScaleApi;
    addCandlestickSeries(options?: DeepPartial<CandlestickSeriesOptions>): ISeriesApi<'Candlestick'>;
    subscribeCrosshairMove(handler: (param: MouseEventParams) => void): void;
    unsubscribeCrosshairMove(handler: (param: MouseEventParams) => void): void;
  }

  export interface ITimeScaleApi {
    setVisibleRange(range: { from: Time; to: Time }): void;
  }

  export interface ISeriesApi<T extends string> {
    setData(data: CandlestickData[]): void;
    update(data: CandlestickData): void;
  }

  export interface MouseEventParams {
    time?: Time;
    point?: { x: number; y: number };
    seriesData: Map<ISeriesApi<string>, CandlestickData>;
  }

  export function createChart(container: HTMLElement, options?: DeepPartial<ChartOptions>): IChartApi;
} 