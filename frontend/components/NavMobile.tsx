import { Link } from 'react-router-dom'
import { X, AlignJustify } from 'lucide-react';
import ThemeToggle from './ThemeToggle'
import { cn } from "@/lib/utils"
import { useContext } from 'react';
import { ThemeContext } from '@/context/ThemeContext';

interface NavMobileProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

const NavMobile = ({ isOpen, toggleMenu}: NavMobileProps) => {
  const { theme } = useContext(ThemeContext);
  const mainLinks = [
    { to: '/markets', label: 'Market' },
    { to: '/create', label: 'Create' },
  ];

  // 获取当前主题名称
  const getThemeName = () => {
    return theme === 'dark' ? 'Dark' : 'Light';
  };

  return (
    <div className="lg:hidden">
      <button
        onClick={toggleMenu}
        className="p-2 rounded-lg hover:bg-[var(--softBg)] transition-colors"
      >
        {isOpen ? '' : <AlignJustify size={24} />}
      </button>

      {/* 侧边菜单 */}
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <div 
            className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40"
            onClick={toggleMenu}
          />
          
          {/* 侧边栏 - 添加滑入动画 */}
          <div className={cn(
            "fixed top-0 left-0 bottom-0 w-[80%] bg-background z-50 shadow-xl",
            "transform transition-transform duration-300 ease-out",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}>
            {/* 顶部区域 */}
            <div className="flex items-center justify-between p-4 border-b border-border/40">
              <div className="flex items-center gap-3">
                <img 
                  src={theme === 'dark' ? '/aptos-dark.svg' : '/aptos.png'} 
                  alt='Aptostar'
                  className="h-8 w-auto"
                />
                <h2 className="text-lg font-semibold">Aptostar</h2>
              </div>
              <button
                onClick={toggleMenu}
                className="p-2 rounded-lg hover:bg-[var(--softBg)] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* 导航链接 - 增加字体大小 */}
            <div className="p-4 space-y-3">
              {/* 主菜单链接 */}
              {mainLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.to}
                  className="flex items-center px-4 py-3 rounded-md text-base font-medium transition-colors duration-200 hover:bg-[var(--softBg)]"
                  onClick={toggleMenu}
                >
                  {link.label}
                </Link>
              ))}

              {/* NavLink 组件 - 自定义样式 */}
              <div className="space-y-3">
                <Link
                  to="/mint"
                  className="flex items-center px-4 py-3 rounded-md text-base font-medium transition-colors duration-200 hover:bg-[var(--softBg)]"
                  onClick={toggleMenu}
                >
                  Mint
                </Link>
                <Link
                  to="/stake"
                  className="flex items-center px-4 py-3 rounded-md text-base font-medium transition-colors duration-200 hover:bg-[var(--softBg)]"
                  onClick={toggleMenu}
                >
                  Stake
                </Link>
                <Link
                  to="/my-assets"
                  className="flex items-center px-4 py-3 rounded-md text-base font-medium transition-colors duration-200 hover:bg-[var(--softBg)]"
                  onClick={toggleMenu}
                >
                  My Assets
                </Link>
              </div>
            </div>

            {/* 主题切换 */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/40">
              <div className="flex items-center justify-between">
                <span className="text-base text-muted-foreground">{getThemeName()}</span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default NavMobile