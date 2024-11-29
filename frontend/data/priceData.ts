import { CandlestickData, Time } from 'lightweight-charts';
import { Pool, Trade } from '@/types/market';
import { formatDisplayPrice } from '@/utils/format';

// 添加 APT 价格常量
const APT_PRICE_USD = 12;  // 1 APT = $12

// Bonding Curve 基础类
class BondingCurve {
  protected k: number;              // 曲线系数
  protected maxSupply: number;      // 最大供应量
  protected initialPrice: number;   // 初始价格（以 APT 计价）
  protected slippageFactor: number; // 滑点系数
  
  constructor(
    initialPrice: number = 1.0,     // 初始价格（APT）
    k: number = 1.1,               // 曲线斜率
    maxSupply: number = 1000000,    // 最大供应量
    slippageFactor: number = 0.1    // 基础滑点
  ) {
    this.initialPrice = initialPrice;
    this.k = k;
    this.maxSupply = maxSupply;
    this.slippageFactor = slippageFactor;
  }

  // 计算价格 P = P0 * e^(k * (s/S))
  // 其中：P0 是初始价格（APT），s 是当前流通量，S 是最大供应量
  protected calculatePrice(currentSupply: number): number {
    const ratio = currentSupply / this.maxSupply;
    return this.initialPrice * Math.exp(this.k * ratio);
  }

  // 计算滑点
  protected calculateSlippage(tradeAmount: number, currentSupply: number): number {
    // 滑点随交易量和当前流通量的比例增加
    const ratio = tradeAmount / (this.maxSupply - currentSupply);
    return Math.min(this.slippageFactor * ratio, 0.5); // 最大滑点 50%
  }

  // 计算流动性影响
  protected calculateLiquidityImpact(volume24h: number, liquidity: number): number {
    // 流动性影响随 24h 交易量与流动性的比例增加
    return Math.min(volume24h / liquidity, 1);
  }
}

// 价格模拟器
export class PriceSimulator extends BondingCurve {
  private pool: Pool;
  private trades: Trade[] = [];
  private listeners: ((price: number, trade: Trade) => void)[] = [];
  private intervalId?: NodeJS.Timeout;
  private candlesticks: CandlestickData[] = [];
  private currentCandle: CandlestickData;

  constructor(initialPrice: number) {
    super(initialPrice);
    
    // 初始化资金池
    this.pool = {
      tokenReserve: this.maxSupply * 0.8,  // 初始预留 80%
      aptReserve: initialPrice * this.maxSupply * 0.2, // 初始 APT 储备
      totalSupply: this.maxSupply,
      currentSupply: this.maxSupply * 0.2,  // 初始流通 20%
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

  // 添加 USD 价格计算方法
  private calculateUSDPrice(aptPrice: number): number {
    return aptPrice * APT_PRICE_USD;
  }

  // 修改生成随机交易的方法
  private generateRandomTrade(): { price: number; trade: Trade } {
    const isBuy = Math.random() > 0.4;
    
    // 生成合理的代币交易量
    const maxTradeAmount = this.pool.currentSupply * 0.01;
    const baseAmount = maxTradeAmount * (0.1 + Math.random() * 0.9);
    const tokenAmount = Math.floor(baseAmount);
    
    // 计算 APT 价格和滑点
    const { price: aptPrice, slippage } = isBuy 
      ? this.calculateBuyPrice(tokenAmount)
      : this.calculateSellPrice(tokenAmount);
    
    // 计算 USD 价格
    const usdPrice = this.calculateUSDPrice(aptPrice);
    
    // 计算交易量
    const aptAmount = aptPrice * tokenAmount;
    const usdAmount = usdPrice * tokenAmount;

    // 更新池子状态
    if (isBuy) {
      this.pool.tokenReserve -= tokenAmount;
      this.pool.aptReserve += aptAmount;
      this.pool.currentSupply += tokenAmount;
    } else {
      this.pool.tokenReserve += tokenAmount;
      this.pool.aptReserve -= aptAmount;
      this.pool.currentSupply -= tokenAmount;
    }

    this.pool.currentPrice = aptPrice;
    this.pool.volume24h += aptAmount;
    this.updateLiquidity(aptAmount, isBuy);

    // 生成交易记录
    const trade: Trade = {
      timestamp: new Date().toISOString(),
      aptAmount: isBuy ? aptAmount : -aptAmount,
      tokenAmount: tokenAmount,
      type: isBuy ? 'buy' : 'sell',
      txHash: `0x${Math.random().toString(36).substr(2, 64)}`,
      trader: `0x${Math.random().toString(36).substr(2, 40)}`,
      price: aptPrice,
      priceUSD: usdPrice,
      slippage: slippage,
      volume: aptAmount,
      volumeUSD: usdAmount
    };

    console.log('Generated trade:', {
      type: trade.type,
      tokenAmount: formatDisplayPrice(trade.tokenAmount),
      aptAmount: formatDisplayPrice(Math.abs(trade.aptAmount)),
      aptPrice: formatDisplayPrice(trade.price),
      usdPrice: formatDisplayPrice(trade.priceUSD),
      marketCapUSD: formatDisplayPrice(this.calculateMarketCapUSD())
    });

    return { price: aptPrice, trade };
  }

  // 优化买入价格计算
  public calculateBuyPrice(tokenAmount: number): { price: number; slippage: number } {
    const currentPrice = this.calculatePrice(this.pool.currentSupply);
    const slippage = this.calculateSlippage(tokenAmount, this.pool.currentSupply);
    const avgPrice = currentPrice * (1 + slippage);
    
    // 计算实际影响
    const liquidityImpact = this.calculateLiquidityImpact(
      tokenAmount * avgPrice,
      this.pool.liquidity
    );
    
    return { 
      price: avgPrice * (1 + liquidityImpact),
      slippage: slippage + liquidityImpact
    };
  }

  // 优化卖出价格计算
  public calculateSellPrice(tokenAmount: number): { price: number; slippage: number } {
    const currentPrice = this.calculatePrice(this.pool.currentSupply);
    const slippage = this.calculateSlippage(tokenAmount, this.pool.currentSupply);
    const avgPrice = currentPrice * (1 - slippage);
    
    // 计算实际影响
    const liquidityImpact = this.calculateLiquidityImpact(
      tokenAmount * avgPrice,
      this.pool.liquidity
    );
    
    return { 
      price: avgPrice * (1 - liquidityImpact),
      slippage: slippage + liquidityImpact
    };
  }

  // 执行买入交易
  public executeBuy(amount: number): { price: number } {
    const { price, slippage } = this.calculateBuyPrice(amount);
    const volume = price * amount;
    const usdPrice = this.calculateUSDPrice(price);
    const usdVolume = volume * APT_PRICE_USD;

    // 更新池子状态
    this.pool.tokenReserve -= amount;
    this.pool.aptReserve += volume;
    this.pool.currentSupply += amount;
    this.pool.currentPrice = price;
    this.pool.volume24h += volume;
    this.updateLiquidity(volume, true);

    // 记录交易
    this.recordTrade({
      timestamp: new Date().toISOString(),
      aptAmount: volume,
      tokenAmount: amount,
      type: 'buy',
      txHash: `0x${Math.random().toString(36).substr(2, 64)}`,
      trader: `0x${Math.random().toString(36).substr(2, 40)}`,
      price,
      priceUSD: usdPrice,
      slippage,
      volume,
      volumeUSD: usdVolume
    });

    return { price };
  }

  // 执行卖出交易
  public executeSell(amount: number): { price: number } {
    const { price, slippage } = this.calculateSellPrice(amount);
    const volume = price * amount;
    const usdPrice = this.calculateUSDPrice(price);
    const usdVolume = volume * APT_PRICE_USD;

    // 更新池子状态
    this.pool.tokenReserve += amount;
    this.pool.aptReserve -= volume;
    this.pool.currentSupply -= amount;
    this.pool.currentPrice = price;
    this.pool.volume24h += volume;
    this.updateLiquidity(volume, false);

    // 记录交易
    this.recordTrade({
      timestamp: new Date().toISOString(),
      aptAmount: -volume,
      tokenAmount: amount,
      type: 'sell',
      txHash: `0x${Math.random().toString(36).substr(2, 64)}`,
      trader: `0x${Math.random().toString(36).substr(2, 40)}`,
      price,
      priceUSD: usdPrice,
      slippage,
      volume,
      volumeUSD: usdVolume
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
    if (now - Number(this.currentCandle.time) >= 60) {
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
    this.notifyListeners(trade.price, trade);
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

  // 添加生成初始交易数据的方法
  public generateInitialTrades() {
    console.log('Generating initial trades');
    const now = Date.now();
    const count = 50; // 初始交易数量

    // 清空现有交易
    this.trades = [];

    for (let i = 0; i < count; i++) {
      const timestamp = new Date(now - (count - i) * 60000);
      const result = this.generateRandomTrade();
      
      // 修改交易时间戳
      const updatedTrade: Trade = {
        ...result.trade,
        timestamp: timestamp.toISOString()
      };

      // 添加到交易列表
      this.trades.push(updatedTrade);
    }

    // 按时间排序
    this.trades.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    console.log('Initial trades generated:', {
      count: this.trades.length,
      firstTrade: this.trades[0],
      lastTrade: this.trades[this.trades.length - 1]
    });
  }

  // 修改 startRealTimeUpdates 方法
  public startRealTimeUpdates(interval: number = 5000) {
    console.log('Starting real-time updates for simulator');
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    // 确保有初始交易数据
    if (this.trades.length === 0) {
      this.generateInitialTrades();
    }

    // 立即生成一次交易
    const initialTrade = this.generateRandomTrade();
    this.notifyListeners(initialTrade.price, initialTrade.trade);

    this.intervalId = setInterval(() => {
      const { price, trade } = this.generateRandomTrade();
      console.log('Generated new trade:', {
        type: trade.type,
        tokenAmount: formatDisplayPrice(trade.tokenAmount),
        aptAmount: formatDisplayPrice(Math.abs(trade.aptAmount)),
        price: formatDisplayPrice(trade.price),
        timestamp: trade.timestamp
      });
      this.notifyListeners(price, trade);
    }, interval);
  }

  // 停止实时更新
  public stopRealTimeUpdates() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  private notifyListeners(price: number, trade: Trade) {
    this.listeners.forEach(listener => listener(price, trade));
  }

  // 添加价格监听器
  public addListener(listener: (price: number, trade: Trade) => void) {
    this.listeners.push(listener);
  }

  // 移除价格监听器
  public removeListener(listener: (price: number, trade: Trade) => void) {
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

  // 修改 getRecentTrades 方法
  public getRecentTrades(count: number = 50): Trade[] {
    if (this.trades.length === 0) {
      console.log('No trades available, generating initial trades');
      this.generateInitialTrades();
    }

    const sortedTrades = [...this.trades].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    const result = sortedTrades.slice(0, count);
    console.log('Returning recent trades:', {
      totalTrades: this.trades.length,
      returnedTrades: result.length,
      firstTrade: result[0] ? {
        timestamp: result[0].timestamp,
        price: formatDisplayPrice(result[0].price),
        type: result[0].type
      } : null,
      lastTrade: result[result.length - 1] ? {
        timestamp: result[result.length - 1].timestamp,
        price: formatDisplayPrice(result[result.length - 1].price),
        type: result[result.length - 1].type
      } : null
    });
    
    return result;
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

  // 添加市值计算方法
  public calculateMarketCapUSD(): number {
    const aptMarketCap = this.pool.currentPrice * this.pool.currentSupply;
    return this.calculateUSDPrice(aptMarketCap);
  }

  // 获取当前 USD 价格
  public getCurrentPriceUSD(): number {
    return this.calculateUSDPrice(this.pool.currentPrice);
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