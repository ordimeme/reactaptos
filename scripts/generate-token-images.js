import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import marketData from './marketData.js';

const { tokenList } = marketData;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 改进的 SVG 生成函数
function generateSVG(name, symbol) {
  // 为每个代币生成唯一但固定的颜色
  const getTokenColor = (symbol) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
      '#D4A5A5', '#9B59B6', '#3498DB', '#E67E22', '#1ABC9C',
      '#FF9F43', '#58B19F', '#2C3A47', '#B33771', '#3B3B98',
      '#FD7272', '#9AECDB', '#D6A2E8', '#6D214F', '#182C61',
      '#FC427B', '#BDC581', '#82589F', '#3d3d3d', '#55E6C1'
    ];
    
    // 使用symbol的字符来确定颜色索引，这样同一个代币总是获得相同的颜色
    const colorIndex = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[colorIndex];
  };

  const bgColor = getTokenColor(symbol);
  const secondaryColor = bgColor + '80'; // 添加50%透明度

  return `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad-${symbol}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:1" />
      </linearGradient>
      <filter id="shadow-${symbol}">
        <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.3"/>
      </filter>
    </defs>
    <rect width="200" height="200" fill="url(#grad-${symbol})" rx="30"/>
    <circle cx="100" cy="80" r="45" fill="white" opacity="0.15"/>
    <text x="100" y="95" 
      font-family="Arial, sans-serif" 
      font-size="36" 
      font-weight="bold" 
      text-anchor="middle" 
      fill="white"
      filter="url(#shadow-${symbol})">${symbol}</text>
    <text x="100" y="140" 
      font-family="Arial, sans-serif" 
      font-size="18" 
      text-anchor="middle" 
      fill="white"
      opacity="0.9">${name}</text>
  </svg>`;
}

// 修改文件名处理函数
function getSafeFileName(symbol) {
  // 将特殊字符替换为安全的文件名，保持小写
  return symbol.toLowerCase().replace(/[^a-z0-9]/g, '') + '.svg';
}

// 更新生成和保存图像的函数
function generateAndSaveImage(token) {
  const outputDir = join(process.cwd(), 'public', 'tokens');
  const fileName = getSafeFileName(token.symbol);
  const filePath = join(outputDir, fileName);

  // 确保目录存在
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 如果文件不存在，则生成并保存
  if (!fs.existsSync(filePath)) {
    console.log(`Generating image for ${token.symbol}...`);
    const svg = generateSVG(token.name, token.symbol);
    fs.writeFileSync(filePath, svg);
    console.log(`Generated ${fileName}`);
  } else {
    console.log(`Image already exists for ${token.symbol}`);
  }
}

// 主函数
function main() {
  console.log('Starting to generate missing token images...');
  console.log(`Found ${tokenList.length} tokens`);
  
  let generated = 0;
  let existing = 0;
  
  tokenList.forEach(token => {
    const outputDir = join(process.cwd(), 'public', 'tokens');
    const fileName = getSafeFileName(token.symbol);
    const filePath = join(outputDir, fileName);
    
    if (!fs.existsSync(filePath)) {
      generateAndSaveImage(token);
      generated++;
    } else {
      existing++;
    }
  });
  
  console.log(`Finished generating token images!`);
  console.log(`Generated ${generated} new images`);
  console.log(`${existing} images already existed`);
}

main();