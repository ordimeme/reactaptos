export function truncateAddress(address: string, startLength: number = 6, endLength: number = 4, isMobile: boolean = false) {
  if (!address) return '';
  
  // 确保地址以0x开头
  const fullAddress = address.startsWith('0x') ? address : `0x${address}`;
  
  // 移动端显示格式: 0x1234...5678
  if (isMobile) {
    if (fullAddress.length <= startLength + endLength) return fullAddress;
    return `0x${fullAddress.slice(2, 2 + 4)}...${fullAddress.slice(-4)}`;
  }
  
  // 桌面端显示完整地址
  return fullAddress;
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
