export function truncateAddress(address: string, startLength: number = 6, endLength: number = 4, isMobile: boolean = false) {
  if (!address) return '';
  
  // 移动端显示格式: ...1234
  if (isMobile) {
    return `...${address.slice(-4)}`;
  }
  
  // 桌面端显示格式: 0x1234...5678
  if (address.length <= startLength + endLength) return address;
  const start = address.slice(0, startLength);
  const end = address.slice(-endLength);
  return `${start}...${end}`;
}

// 获取完整地址（确保以0x开头）
export function getFullAddress(address: string) {
  if (!address) return '';
  return address.startsWith('0x') ? address : `0x${address}`;
}

// 格式化交易哈希
export function formatTxHash(hash: string, isMobile: boolean = false) {
  if (!hash) return '';
  
  // 移动端显示格式: ...1234
  if (isMobile) {
    return `...${hash.slice(-4)}`;
  }
  
  // 桌面端显示格式: 0x1234...5678
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
}
