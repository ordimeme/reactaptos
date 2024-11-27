import { useContext } from 'react'
import { ThemeContext } from '@/context/ThemeContext'

// 自定义太阳图标
const SunIcon = () => (
  <svg 
    className="w-5 h-5" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

// 自定义月亮图标
const MoonIcon = () => (
  <svg 
    className="w-5 h-5" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const ThemeToggle = () => {
  const { theme, toggle } = useContext(ThemeContext)

  const handleClick = () => {
    // 添加点击反馈
    const button = document.activeElement as HTMLButtonElement;
    if (button) {
      button.style.transform = 'scale(0.95)';
      setTimeout(() => {
        button.style.transform = '';
      }, 100);
    }
    toggle();
  };

  return (
    <button 
      className="p-2 rounded-full hover:bg-[var(--primary)] transform"
      style={{ 
        color: 'var(--foreground)',
        backgroundColor: 'transparent',
        transition: 'transform 0.1s ease'
      }}
      onClick={handleClick}
    >
      {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
    </button>
  )
}

export default ThemeToggle
