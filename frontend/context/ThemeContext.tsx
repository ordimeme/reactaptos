"use client";

import { createContext, useEffect, useState, ReactNode } from "react";

// 定义主题类型
type Theme = 'light' | 'dark' | null;

// 定义上下文类型
interface ThemeContextType {
  theme: Theme;
  toggle: () => void;
}

// 创建上下文时提供初始值
export const ThemeContext = createContext<ThemeContextType>({
  theme: null,
  toggle: () => {},
});

// 定义 Provider 的 props 类型
interface ThemeContextProviderProps {
  children: ReactNode;
}

export const ThemeContextProvider = ({ children }: ThemeContextProviderProps) => {
  const [theme, setTheme] = useState<Theme>(null);

  useEffect(() => {
    const initTheme = () => {
      // 先尝试从 localStorage 获取
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme) {
        setTheme(savedTheme);
        document.documentElement.setAttribute('theme', savedTheme);
        return;
      }

      // 如果没有保存的主题，则使用系统偏好
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = prefersDark ? 'dark' : 'light';
      setTheme(initialTheme);
      document.documentElement.setAttribute('theme', initialTheme);
      localStorage.setItem('theme', initialTheme);
    };

    initTheme();
  }, []);

  const toggle = () => {
    setTheme((prev) => {
      const newTheme = prev === "light" ? "dark" : "light";
      document.documentElement.setAttribute('theme', newTheme);
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };

  // 等待主题初始化完成
  if (theme === null) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
};
