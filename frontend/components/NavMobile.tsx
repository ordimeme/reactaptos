import { Link } from 'react-router-dom'
import { X, AlignJustify } from 'lucide-react';
import ThemeToggle from './ThemeToggle'

interface NavMobileProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

const NavMobile = ({ isOpen, toggleMenu}: NavMobileProps) => {

const links = [
        { to: '/markets', label: 'Markets' },
        { to: '/mint', label: 'Mint' },
        { to: '/create-asset', label: 'Create' },
        { to: '/stake', label: 'Stake' },
        { to: '/my-assets', label: 'MyAssets' },
      ];

  return (
    <div className="lg:hidden">
      <button
        onClick={toggleMenu}
        className="p-2 rounded-lg hover:bg-[var(--softBg)] transition-colors"
      >
        {isOpen ? '':<AlignJustify size={30} />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-[var(--softBg)]">
          <div className="flex flex-col items-center pt-20 space-y-8">
            <button
            onClick={toggleMenu}
            className="absolute top-8 right-4 p-2 rounded-lg hover:bg-[var(--softBg)] transition-colors"
          >
            <X size={30} />
            </button>
            
            {links.map((link, index) => (
            <Link
            key={index}
            to={link.to}
            className="p-2 rounded-md transition-colors duration-300 ease-in-out hover:bg-[var(--softBg)]"
            onClick={toggleMenu}
            >
            <p className='text-[var(--textColor)] text-xl'>{link.label}</p>
            </Link>
      ))}
          <ThemeToggle />
          </div>
        </div>
      )}
    </div>
  )
}

export default NavMobile