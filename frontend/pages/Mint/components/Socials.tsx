import { FC } from "react";
import { buttonVariants } from "@/components/ui/button";

// 使用内联 SVG 组件替代导入的图片
const TwitterIcon = () => (
  <svg 
    className="w-5 h-5" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

const DiscordIcon = () => (
  <svg 
    className="w-5 h-5" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M18 8.5a4 4 0 0 0-5.7-5.6A4 4 0 0 0 8 4.5M18 8.5A11 11 0 0 1 6 21.5a11 11 0 0 1-4-4"/>
    <path d="M18 8.5a11 11 0 0 1 4 13 11 11 0 0 1-4 4"/>
    <path d="M6 21.5a4 4 0 0 0 5.7-5.6A4 4 0 0 0 16 14.5"/>
  </svg>
);

const TelegramIcon = () => (
  <svg 
    className="w-5 h-5" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M21.5 2L2 9.5l7.5 3L18 4l-8.5 9.5L16 22l5.5-19.5z"/>
  </svg>
);

export const Socials: FC = () => {
  const socialLinks = [
    {
      name: "Twitter",
      icon: <TwitterIcon />,
      href: "https://twitter.com/your-twitter",
    },
    {
      name: "Discord",
      icon: <DiscordIcon />,
      href: "https://discord.gg/your-discord",
    },
    {
      name: "Telegram",
      icon: <TelegramIcon />,
      href: "https://t.me/your-telegram",
    },
  ];

  return (
    <div className="flex gap-2">
      {socialLinks.map((social) => (
        <a
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({
            variant: "ghost",
            size: "icon",
            className: "w-10 h-10 rounded-full hover:bg-muted/20 transition-colors duration-200",
          })}
        >
          <span className="social-icon dark:text-white">
            {social.icon}
          </span>
        </a>
      ))}
    </div>
  );
};
