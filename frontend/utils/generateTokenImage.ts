import * as fs from 'fs';
import * as path from 'path';
import { marketData } from '@/data/marketData';

// 生成随机颜色
function getRandomColor() {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
    '#D4A5A5', '#9B59B6', '#3498DB', '#E67E22', '#2ECC71'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// 生成图标的渐变背景
function generateGradient() {
  const color1 = getRandomColor();
  const color2 = getRandomColor();
  return `
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
      </linearGradient>
    </defs>
  `;
}

// 生成装饰图案
function generatePattern() {
  const patterns = [
    `<circle cx="100" cy="100" r="40" fill="rgba(255,255,255,0.2)" />`,
    `<path d="M60 60 L140 140 M60 140 L140 60" stroke="rgba(255,255,255,0.2)" stroke-width="10" />`,
    `<rect x="70" y="70" width="60" height="60" fill="rgba(255,255,255,0.2)" transform="rotate(45 100 100)" />`,
  ];
  return patterns[Math.floor(Math.random() * patterns.length)];
}

// 生成 SVG 字符串
function generateSVG(name: string, symbol: string): string {
  const shortSymbol = symbol.length > 4 ? `${symbol.slice(0, 4)}` : symbol;
  
  return `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    ${generateGradient()}
    <rect width="200" height="200" rx="20" fill="url(#grad)"/>
    ${generatePattern()}
    <text x="100" y="90" font-family="Arial" font-size="24" fill="white" text-anchor="middle" font-weight="bold">
      ${shortSymbol}
    </text>
    <text x="100" y="120" font-family="Arial" font-size="16" fill="white" text-anchor="middle" opacity="0.8">
      ${name.slice(0, 12)}
    </text>
  </svg>`;
}

// 生成并保存 SVG 文件
function generateAndSaveSVG(name: string, symbol: string, outputDir: string): string {
  const svg = generateSVG(name, symbol);
  const fileName = `${symbol.toLowerCase()}.svg`;
  const filePath = path.join(outputDir, fileName);
  
  // 确保目录存在
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // 写入文件
  fs.writeFileSync(filePath, svg);
  return fileName;
}

// 为所有缺少图像的代币生成图像
export function generateMissingTokenImages() {
  const outputDir = path.join(process.cwd(), 'public', 'tokens');
  
  marketData.forEach(token => {
    const imageName = token.imageUrl.split('/').pop();
    const imagePath = path.join(outputDir, imageName || '');
    
    // 检查图像是否存在
    if (!fs.existsSync(imagePath)) {
      console.log(`Generating image for ${token.symbol}...`);
      generateAndSaveSVG(token.name, token.symbol, outputDir);
    }
  });
}

// 如果直接运行此文件
if (require.main === module) {
  generateMissingTokenImages();
} 