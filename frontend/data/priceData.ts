import { CandlestickData, Time } from 'lightweight-charts';
import { Pool, Trade } from '@/types/market';

// Bonding Curve 基础类
class BondingCurve {
  protected k: number;              // 曲线系数
  protected maxSupply: number;      // 最大供应量
  protected initialPrice: number;   // 初始价格
  protected slippageFactor: number; // 滑点系数
  
  constructor(
    initialPrice: number = 1.0,
    k: number = 1.1,
    maxSupply: number = 1000000,
    slippageFactor: number = 0.1
  ) {
    this.initialPrice = initialPrice;
    this.k = k;
    this.maxSupply = maxSupply;
    this.slippageFactor = slippageFactor;
  }

  // 计算价格 P = P0 * e^(k * (s/S))
  protected calculatePrice(currentSupply: number): number {
    return this.initialPrice * Math.exp(this.k * (currentSupply / this.maxSupply));
  }

  // 计算滑点
  protected calculateSlippage(tradeAmount: number, currentSupply: number): number {
    const ratio = tradeAmount / (this.maxSupply - currentSupply);
    return Math.min(this.slippageFactor * ratio, 0.5);
  }

  // 计算流动性影响
  protected calculateLiquidityImpact(volume24h: number, liquidity: number): number {
    return Math.min(volume24h / liquidity, 1);
  }
}

// 价格模拟器
export class PriceSimulator extends BondingCurve {
  private pool: Pool;
  private trades: Trade[] = [];
  private listeners: ((price: number) => void)[] = [];
  private intervalId?: NodeJS.Timeout;
  private candlesticks: CandlestickData[] = [];
  private currentCandle: CandlestickData;

  constructor(initialPrice: number) {
    super(initialPrice);
    
    // 初始化资金池
    this.pool = {
      tokenReserve: this.maxSupply * 0.8,  // 初始预留20%
      aptReserve: initialPrice * this.maxSupply * 0.2, // 初始流动性
      totalSupply: this.maxSupply,
      currentSupply: this.maxSupply * 0.2,  // 初始流通20%
      currentPrice: initialPrice,
      volume24h: 0,
      liquidity: initialPrice * this.maxSupply * 0.4  // 初始流动性
    };

    // 初始化K线
    const now = Math.floor(Date.now() / 1000);
    this.currentCandle = {
      time: now as Time,
      open: initialPrice,
      high: initialPrice,
      low: initialPrice,
      close: initialPrice
    };
  }

  // 计算买入价格
  public calculateBuyPrice(tokenAmount: number): { price: number; slippage: number } {
    const currentPrice = this.calculatePrice(this.pool.currentSupply);
    const slippage = this.calculateSlippage(tokenAmount, this.pool.currentSupply);
    const avgPrice = currentPrice * (1 + slippage);
    
    return { price: avgPrice, slippage };
  }

  // 计算卖出价格
  public calculateSellPrice(tokenAmount: number): { price: number; slippage: number } {
    const currentPrice = this.calculatePrice(this.pool.currentSupply);
    const slippage = this.calculateSlippage(tokenAmount, this.pool.currentSupply);
    const avgPrice = currentPrice * (1 - slippage);
    
    return { price: avgPrice, slippage };
  }

  // 执行买入交易
  public executeBuy(amount: number): { price: number } {
    const { price, slippage } = this.calculateBuyPrice(amount);
    const volume = price * amount;

    // 更新池子状态
    this.pool.tokenReserve -= amount;
    this.pool.aptReserve += volume;
    this.pool.currentSupply += amount;
    this.pool.currentPrice = this.calculatePrice(this.pool.currentSupply);
    this.pool.volume24h += volume;
    this.updateLiquidity(volume, true);

    this.recordTrade({
      timestamp: new Date().toISOString(),
      aptAmount: volume,
      tokenAmount: amount,
      type: 'buy',
      txHash: `0x${Math.random().toString(36).substr(2, 64)}`,
      trader: `0x${Math.random().toString(36).substr(2, 40)}`,
      price,
      slippage,
      volume
    });

    return { price };
  }

  // 执行卖出交易
  public executeSell(amount: number): { price: number } {
    const { price, slippage } = this.calculateSellPrice(amount);
    const volume = price * amount;

    // 更新池子状态
    this.pool.tokenReserve += amount;
    this.pool.aptReserve -= volume;
    this.pool.currentSupply -= amount;
    this.pool.currentPrice = this.calculatePrice(this.pool.currentSupply);
    this.pool.volume24h += volume;
    this.updateLiquidity(volume, false);

    this.recordTrade({
      timestamp: new Date().toISOString(),
      aptAmount: -volume,
      tokenAmount: amount,
      type: 'sell',
      txHash: `0x${Math.random().toString(36).substr(2, 64)}`,
      trader: `0x${Math.random().toString(36).substr(2, 40)}`,
      price,
      slippage,
      volume
    });

    return { price };
  }

  // 更新流动性
  private updateLiquidity(volume: number, isBuy: boolean) {
    // 流动性随交易变化
    const impact = this.calculateLiquidityImpact(this.pool.volume24h, this.pool.liquidity);
    this.pool.liquidity += isBuy ? volume * (1 - impact) : -volume * impact;
  }

  // 记录交易并更新K线
  private recordTrade(trade: Trade) {
    this.trades.push(trade);
    
    const now = Math.floor(Date.now() / 1000);
    
    // 如果是新的时间周期，创建新的K
    if (now - Number(this.currentCandle.time) >= 60) { // 每分钟一根K线
      this.candlesticks.push(this.currentCandle);
      this.currentCandle = {
        time: now as Time,
        open: trade.price,
        high: trade.price,
        low: trade.price,
        close: trade.price
      };
    } else {
      // 更新当前K线
      this.currentCandle.high = Math.max(this.currentCandle.high, trade.price);
      this.currentCandle.low = Math.min(this.currentCandle.low, trade.price);
      this.currentCandle.close = trade.price;
    }

    // 通知价格更新
    this.notifyListeners();
  }

  // 生成随机交易
  private generateRandomTrade(): { price: number } {
    const isBuy = Math.random() > 0.4; // 略微偏向买入
    const volatility = 0.002; // 基础波动率
    const momentum = Math.random() > 0.7 ? 2 : 1; // 30%概率产生更大波动
    const trend = Math.random() > 0.5 ? 1 : -1; // 随机趋势

    // 基于当前价格生成新价格
    const currentPrice = this.pool.currentPrice;
    const priceChange = currentPrice * volatility * momentum * trend;

    // 根据买卖方向执行交易
    if (isBuy) {
      return this.executeBuy(Math.abs(priceChange) * 100);
    } else {
      return this.executeSell(Math.abs(priceChange) * 100);
    }
  }

  // 获取历史K线数据
  public getHistoricalData(timeStep: number, count: number): CandlestickData[] {
    const endTime = Math.floor(Date.now() / 1000);
    const startTime = endTime - (count * timeStep);
    const data: CandlestickData[] = [];

    for (let time = startTime; time <= endTime; time += timeStep) {
      const result = this.generateRandomTrade();
      data.push({
        time: time as Time,
        open: result.price,
        high: result.price * 1.001,
        low: result.price * 0.999,
        close: result.price
      });
    }

    return data.sort((a, b) => Number(a.time) - Number(b.time));
  }

  // 开始实时更新
  public startRealTimeUpdates(interval: number = 5000) {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = setInterval(() => {
      this.generateRandomTrade();
    }, interval);
  }

  // 停止实时更新
  public stopRealTimeUpdates() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.pool.currentPrice));
  }

  // 添加价格监听器
  public addListener(listener: (price: number) => void) {
    this.listeners.push(listener);
  }

  // 移除价格监听器
  public removeListener(listener: (price: number) => void) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  // 获取当前价格
  public getCurrentPrice(): number {
    return this.pool.currentPrice;
  }

  // 获取池子状态
  public getPoolState(): Pool {
    return { ...this.pool };
  }

  // 获取最近的交易
  public getRecentTrades(count: number = 50): Trade[] {
    return this.trades.slice(-count);
  }

  // 获取24小时交易量
  public get24hVolume(): number {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    return this.trades
      .filter(trade => new Date(trade.timestamp).getTime() > oneDayAgo)
      .reduce((sum, trade) => sum + (trade.volume || 0), 0);
  }

  // 获取当前流动性
  public getLiquidity(): number {
    return this.pool.liquidity;
  }
}

// 导出工具函数
export const getPriceData = (
  currentPrice: number,
  timeStep: number,
  count: number
): CandlestickData[] => {
  const data: CandlestickData[] = [];
  const now = Math.floor(Date.now() / 1000);
  const volatility = 0.02; // 2% 波动率

  for (let i = 0; i < count; i++) {
    const time = now - (count - 1 - i) * timeStep;
    const basePrice = i === 0 ? currentPrice : Number(data[i - 1].close);
    
    // 生成随机价格变动
    const change = basePrice * volatility * (Math.random() - 0.5);
    const close = basePrice + change;
    const open = basePrice * (1 + (Math.random() - 0.5) * volatility);
    const high = Math.max(open, close) * (1 + Math.random() * volatility);
    const low = Math.min(open, close) * (1 - Math.random() * volatility);

    data.push({
      time: time as Time,
      open: Number(open.toFixed(4)),
      high: Number(high.toFixed(4)),
      low: Number(low.toFixed(4)),
      close: Number(close.toFixed(4))
    });
  }

  return data;
}; 