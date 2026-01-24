import {Suspense} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {useAnalytics, useOptimisticCart} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';

/**
 * @param {HeaderProps}
 */
export function Header({header, isLoggedIn, cart, publicStoreDomain}) {
  const {shop, menu} = header;
  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300 border-b border-[var(--color-border)] bg-white/90 backdrop-blur-md">
      <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        
        {/* 1. MOBILE MENU TOGGLE (Visible on Mobile Only) */}
        <div className="md:hidden flex-1">
          <HeaderMenuMobileToggle />
        </div>

        {/* 2. LOGO (Centered on Mobile, Left on Desktop) */}
        <NavLink 
          prefetch="intent" 
          to="/" 
          end 
          className="text-2xl font-serif font-bold tracking-tighter text-[var(--color-primary)] flex-1 text-center md:text-left md:flex-none"
        >
          {shop.name}
        </NavLink>

        {/* 3. DESKTOP NAVIGATION (Hidden on Mobile) */}
        <div className="hidden md:flex flex-1 justify-center">
          <HeaderMenu
            menu={menu}
            viewport="desktop"
            primaryDomainUrl={header.shop.primaryDomain.url}
            publicStoreDomain={publicStoreDomain}
          />
        </div>

        {/* 4. UTILITIES (Search, Account, Cart) */}
        <div className="flex-1 flex justify-end gap-2 md:gap-4">
          <SearchToggle />
          <AccountToggle isLoggedIn={isLoggedIn} />
          <CartToggle cart={cart} />
        </div>
      </div>
    </header>
  );
}

/**
 * @param {{
 * menu: HeaderProps['header']['menu'];
 * primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
 * viewport: Viewport;
 * publicStoreDomain: HeaderProps['publicStoreDomain'];
 * }}
 */
export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}) {
  const {close} = useAside();

  return (
    <nav className="flex gap-8" role="navigation">
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
            
        return (
          <NavLink
            className={({isActive}) => 
              `text-sm font-medium uppercase tracking-wider transition-colors hover:text-[var(--color-accent)] ${isActive ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]' : 'text-gray-500'}`
            }
            end
            key={item.id}
            onClick={close}
            prefetch="intent"
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="p-2 hover:bg-[var(--color-subtle)] rounded-full transition-colors"
      onClick={() => open('mobile')}
      aria-label="Open menu"
    >
      <IconMenu />
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button 
      className="p-2 hover:bg-[var(--color-subtle)] rounded-full transition-colors" 
      onClick={() => open('search')}
      aria-label="Search"
    >
      <IconSearch />
    </button>
  );
}

function AccountToggle({isLoggedIn}) {
  return (
    <NavLink 
      prefetch="intent" 
      to="/account" 
      className="p-2 hover:bg-[var(--color-subtle)] rounded-full transition-colors hidden md:block"
      aria-label="Account"
    >
      <Suspense fallback={<IconUser />}>
        <Await resolve={isLoggedIn} errorElement={<IconUser />}>
          {(isLoggedIn) => (
             <div className="relative">
               <IconUser />
               {isLoggedIn && <span className="absolute top-0 right-0 w-2 h-2 bg-[var(--color-success)] rounded-full border border-white"></span>}
             </div>
          )}
        </Await>
      </Suspense>
    </NavLink>
  );
}

/**
 * @param {Pick<HeaderProps, 'cart'>}
 */
function CartToggle({cart}) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue();
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

function CartBadge({count}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      href="/cart"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        });
      }}
      className="relative p-2 hover:bg-[var(--color-subtle)] rounded-full transition-colors"
    >
      <IconBag />
      {count > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-[var(--color-primary)] rounded-full ring-2 ring-white">
          {count}
        </span>
      )}
    </a>
  );
}

// --- ICONS (Simple SVGs for Trust) ---

function IconMenu() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
  );
}

function IconSearch() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  );
}

function IconUser() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  );
}

function IconBag() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
  );
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

/** @typedef {'desktop' | 'mobile'} Viewport */
/**
 * @typedef {Object} HeaderProps
 * @property {HeaderQuery} header
 * @property {Promise<CartApiQueryFragment|null>} cart
 * @property {Promise<boolean>} isLoggedIn
 * @property {string} publicStoreDomain
 */

/** @typedef {import('@shopify/hydrogen').CartViewPayload} CartViewPayload */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */