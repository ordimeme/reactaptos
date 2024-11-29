const MAX_SAFE_NUMBER = Number.MAX_SAFE_INTEGER;
const MIN_SAFE_NUMBER = Number.MIN_SAFE_INTEGER;

// 检查数字是否在安全范围内
function isInSafeRange(num: number): boolean {
  return num <= MAX_SAFE_NUMBER && num >= MIN_SAFE_NUMBER;
}

// 安全的数学运算
export function safeAdd(a: number, b: number): number {
  const result = a + b;
  if (!isInSafeRange(result)) {
    throw new Error('Number overflow: Addition result is out of safe range');
  }
  return result;
}

export function safeSubtract(a: number, b: number): number {
  const result = a - b;
  if (!isInSafeRange(result)) {
    throw new Error('Number overflow: Subtraction result is out of safe range');
  }
  return result;
}

export function safeMultiply(a: number, b: number): number {
  const result = a * b;
  if (!isInSafeRange(result)) {
    throw new Error('Number overflow: Multiplication result is out of safe range');
  }
  return result;
}

export function safeDivide(a: number, b: number): number {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  const result = a / b;
  if (!isInSafeRange(result)) {
    throw new Error('Number overflow: Division result is out of safe range');
  }
  return result;
}

export function clampNumber(num: number, min: number = 0, max: number = 100_000_000): string {
  // 检查输入值是否在安全范围内
  if (!isInSafeRange(num)) {
    throw new Error('Input number is out of safe range');
  }

  if (num < min) {
    return `<${min.toString()}`;
  }

  if (num > max) {
    return `>${max.toString()}`;
  }

  return num.toString();
}

// 添加新的格式化函数，包含溢出检查
export function formatTokenAmount(amount: number): string {
  if (!isInSafeRange(amount)) {
    throw new Error('Token amount is out of safe range');
  }

  if (amount === 0) return '0';

  try {
    // 处理小于1的数字，最多保留4位小数
    if (amount < 1) {
      return amount.toFixed(4).replace(/\.?0+$/, '');
    }

    // 处理大数字
    if (amount >= 1_000_000) {
      return (amount / 1_000_000).toFixed(2).replace(/\.?0+$/, '') + 'M';
    }
    
    if (amount >= 1_000) {
      return (amount / 1_000).toFixed(2).replace(/\.?0+$/, '') + 'K';
    }

    // 其他情况保留2位小数
    return amount.toFixed(2).replace(/\.?0+$/, '');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Invalid token amount: ${error.message}`);
    }
    throw error;
  }
}

// 添加一个工具函数来安全地解析输入值
export function safeParseNumber(value: string): number {
  const num = Number(value);
  if (isNaN(num)) {
    throw new Error('Invalid number format');
  }
  if (!isInSafeRange(num)) {
    throw new Error('Number is out of safe range');
  }
  return num;
}
