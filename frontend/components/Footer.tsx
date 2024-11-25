import { Link } from "react-router-dom";
import { FaDiscord,FaTelegram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

function Footer() {
  return (
    <footer className="w-full py-6 bg-[var(--background)] text-[var(--textColor)] border-t border-[var(--softBg)]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">© 2024 ReactAptos. All rights reserved.</span>
          </div>
          
          <div className="flex items-center gap-4">

            <Link 
              to="https://twitter.com/yourusername" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-[var(--softTextColor)] transition-colors"
              aria-label="Twitter"
            >
              <FaXTwitter className="h-5 w-5"/>
            </Link>    

            <Link 
              to="https://t.me" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-[var(--softTextColor)] transition-colors"
              aria-label="Telegram"
            >
              <FaTelegram className="h-5 w-5"/>
            </Link>
          

            <Link 
              to="https://discord.gg/yourinvite" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-[var(--softTextColor)] transition-colors"
              aria-label="Discord"
            >
              <FaDiscord className="h-5 w-5"/>
            </Link>
            
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 
