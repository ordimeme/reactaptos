"use client";

import { createContext, useState, useEffect, useCallback } from 'react';

export const ThemeContext = createContext({
  theme: 'light',
  toggle: () => {},
});

export function ThemeContextProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  // 优化主题应用函数
  const applyTheme = useCallback((newTheme: string) => {
    // 立即应用关键样式变化
    document.documentElement.setAttribute('theme', newTheme);
    document.documentElement.className = newTheme;
    document.body.setAttribute('theme', newTheme);
    
    // 使用 RAF 批量处理样式更新
    requestAnimationFrame(() => {
      const root = document.documentElement;
      root.style.setProperty('--theme-transition', 'none');
      
      // 应用背景色
      const bgColor = getComputedStyle(root).getPropertyValue('--background').trim();
      document.body.style.backgroundColor = `hsl(${bgColor})`;
      
      // 触发重排以应用变化
      void document.documentElement.offsetHeight;
      
      // 恢复过渡效果
      root.style.removeProperty('--theme-transition');
    });
    
    // 保存到 localStorage
    localStorage.setItem('theme', newTheme);
  }, []);

  // 优化切换函数
  const toggle = useCallback(() => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      // 立即应用主题
      applyTheme(newTheme);
      return newTheme;
    });
  }, [applyTheme]);

  // 初始化主题
  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export { ThemeContextProvider as ThemeProvider };
