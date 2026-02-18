import {NavLink} from 'react-router';
import {useAside} from '~/components/Aside';

/**
 * Navbar - Neo-Brutalist Navigation
 * High-contrast, sticky top, thick bottom border
 * Hard hover states with lime/magenta accents
 */
export function Navbar({shop, menu, publicStoreDomain}) {
  const {open} = useAside();

  return (
    <header className="sticky top-0 z-[100] w-full bg-[var(--color-bg-primary)] border-b-4 border-[var(--color-fg-primary)]">
      <div className="max-w-[var(--grid-max-width)] mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Mobile Menu Toggle */}
        <button
          onClick={() => open('mobile')}
          className="md:hidden p-2 border-2 border-[var(--color-fg-primary)] bg-[var(--color-bg-secondary)] hover:bg-[var(--color-accent-lime)] hover:text-[var(--color-bg-primary)] transition-colors"
          aria-label="Open menu"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="square"
          >
            <line x1="3" x2="21" y1="6" y2="6"/>
            <line x1="3" x2="21" y1="12" y2="12"/>
            <line x1="3" x2="21" y1="18" y2="18"/>
          </svg>
        </button>

        {/* Logo - Space Grotesk, Bold */}
        <NavLink 
          prefetch="intent" 
          to="/" 
          end 
          className="font-[var(--font-display)] text-2xl md:text-3xl font-bold tracking-tight text-[var(--color-fg-primary)] uppercase"
        >
          {shop?.name || 'M-U-PLUG'}
        </NavLink>

        {/* Desktop Navigation - Monospaced */}
        <nav className="hidden md:flex items-center gap-1" role="navigation">
          {(menu || FALLBACK_MENU).items.map((item) => {
            if (!item.url) return null;
            
            const url =
              item.url.includes('myshopify.com') ||
              item.url.includes(publicStoreDomain)
                ? new URL(item.url).pathname
                : item.url;
                
            return (
              <NavLink
                key={item.id}
                to={url}
                prefetch="intent"
                className={({isActive}) => `
                  font-[var(--font-mono)] 
                  text-xs 
                  uppercase 
                  tracking-widest 
                  px-4 
                  py-2 
                  border-2 
                  border-transparent
                  ${isActive 
                    ? 'bg-[var(--color-fg-primary)] text-[var(--color-bg-primary)] border-[var(--color-fg-primary)]' 
                    : 'text-[var(--color-fg-primary)] hover:bg-[var(--color-accent-lime)] hover:text-[var(--color-bg-primary)] hover:border-[var(--color-fg-primary)]'
                  }
                  transition-all
                  duration-150
                `}
              >
                {item.title}
              </NavLink>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => open('search')}
            className="p-2 border-2 border-[var(--color-fg-primary)] text-[var(--color-fg-primary)] hover:bg-[var(--color-accent-magenta)] hover:text-[var(--color-bg-primary)] transition-colors"
            aria-label="Search"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="square"
            >
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
          </button>
          
          <button
            onClick={() => open('cart')}
            className="p-2 border-2 border-[var(--color-fg-primary)] bg-[var(--color-fg-primary)] text-[var(--color-bg-primary)] hover:bg-[var(--color-accent-cyan)] hover:border-[var(--color-accent-cyan)] transition-colors"
            aria-label="Cart"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="square"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
              <path d="M3 6h18"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

const FALLBACK_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Shop',
      type: 'HTTP',
      url: '/collections',
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'New',
      type: 'HTTP',
      url: '/collections/all',
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'About',
      type: 'HTTP',
      url: '/pages/about',
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: null,
      tags: [],
      title: 'Contact',
      type: 'HTTP',
      url: '/pages/contact',
    },
  ],
};
