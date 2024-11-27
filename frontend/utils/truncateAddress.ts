export function truncateAddress(address: string, startLength: number = 6, endLength: number = 4) {
  if (!address) return '';
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
