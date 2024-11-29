// 添加数值单位格式化函数
function formatNumberWithUnit(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(2)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(2)}K`;
  }
  return value.toFixed(4);
}

// 基础价格格式化
export const formatDisplayPrice = (price: string | number): string => {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(num)) return '0.0000';
  
  // 始终保持4位小数
  const formatted = num.toFixed(4);
  
  // 如果是整数，添加 .0000
  if (!formatted.includes('.')) {
    return `${formatted}.0000`;
  }
  
  // 如果小数位不足4位，补零
  const [integer, decimal] = formatted.split('.');
  const paddedDecimal = decimal.padEnd(4, '0');
  
  return `${integer}.${paddedDecimal}`;
};

// 格式化各种类型的数据
export const format = {
  // APT 价格格式化
  apt: (price: string | number): string => {
    return formatDisplayPrice(price);
  },

  // USD 价格格式化
  usd: (price: string | number): string => {
    return `$${formatDisplayPrice(price)}`;
  },

  // 百分比格式化
  percentage: (value: number): string => {
    const formatted = value.toFixed(2);
    return value >= 0 ? `+${formatted}%` : `${formatted}%`;
  },

  // 交易量格式化
  volume: (volume: number, currency: 'APT' | 'USD' = 'APT'): string => {
    if (volume === 0) return currency === 'APT' ? '0 APT' : '$0';
    
    const formatted = formatNumberWithUnit(volume);
    return currency === 'APT' ? `${formatted} APT` : `$${formatted}`;
  },

  // 市值格式化
  marketCap: (marketCap: number): string => {
    if (marketCap === 0) return '$0';
    
    const formatted = formatNumberWithUnit(marketCap);
    return `$${formatted}`;
  },

  // 流动性格式化
  liquidity: (liquidity: number): string => {
    if (liquidity === 0) return '0 APT';
    
    const formatted = formatNumberWithUnit(liquidity);
    return `${formatted} APT`;
  },

  // 代币数量格式化
  tokenAmount: (amount: number): string => {
    if (amount === 0) return '0';
    return formatNumberWithUnit(amount);
  },

  aptMarketCap: (value: number) => {
    const aptPrice = 20; // 这里应该从价格上下文中获取实际的 APT 价格
    const aptValue = value / aptPrice;
    
    if (aptValue >= 1_000_000) {
      return `${(aptValue / 1_000_000).toFixed(2)}M`;
    } else if (aptValue >= 1_000) {
      return `${(aptValue / 1_000).toFixed(2)}K`;
    } else {
      return aptValue.toFixed(2);
    }
  },
}

// 为了向后兼容，导出一些常用的格式化函数
export const formatAPTPrice = format.apt;
export const formatUSDPrice = format.usd;
export const formatPercentage = format.percentage;
export const formatVolume = format.volume;
export const formatMarketCap = format.marketCap;
export const formatLiquidity = format.liquidity;
export const formatTokenAmount = format.tokenAmount; 