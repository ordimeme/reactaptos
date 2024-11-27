// 生成基于种子的随机数，确保同一个代币每次生成的数据都一样
const seededRandom = (seed: string) => {
  const hash = seed.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0) | 0;
  }, 0);
  
  let value = Math.abs(hash);
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
};

// 生成K线数据
export const getPriceData = (symbol: string, currentPrice: number) => {
  const random = seededRandom(symbol);
  const candleData = [];
  let price = currentPrice;
  const now = Math.floor(Date.now() / 1000);
  const timeStep = 60 * 60; // 1小时的秒数
  const volatility = 0.02; // 2% 波动率

  // 生成过去200个小时的数据
  for (let i = 200; i >= 0; i--) {
    const time = now - i * timeStep;
    const change = (random() * 2 - 1) * volatility;
    const open = price;
    price = price * (1 + change);
    const close = price;
    const high = Math.max(open, close) * (1 + random() * 0.005);
    const low = Math.min(open, close) * (1 - random() * 0.005);
    const volume = random() * 1000 * Math.abs(change) * 50;

    candleData.push({
      time: time, // 注意这里改为秒级时间戳
      open: Number(open.toFixed(4)),
      high: Number(high.toFixed(4)),
      low: Number(low.toFixed(4)),
      close: Number(close.toFixed(4)),
      volume: Number(volume.toFixed(2))
    });
  }

  return candleData;
}; 