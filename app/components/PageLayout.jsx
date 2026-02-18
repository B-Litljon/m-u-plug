import {Await, Link} from 'react-router';
import {Suspense, useId} from 'react';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Navbar} from '~/components/Navbar';
import {CartMain} from '~/components/CartMain';
import {PromotionalMarquee} from '~/components/Marquee';
import {
  SEARCH_ENDPOINT,
  SearchFormPredictive,
} from '~/components/SearchFormPredictive';
import {SearchResultsPredictive} from '~/components/SearchResultsPredictive';

/**
 * PageLayout - Neo-Brutalist Layout Shell
 * Provides Aside drawers, Navbar, Marquee, Footer, and main content area
 * 
 * @param {PageLayoutProps}
 */
export function PageLayout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
  publicStoreDomain,
}) {
  return (
    <Aside.Provider>
      {/* Promotional Marquee - Top of page */}
      <div className="relative z-[50]">
        <PromotionalMarquee />
      </div>
      
      <CartAside cart={cart} />
      <SearchAside />
      <MobileMenuAside header={header} publicStoreDomain={publicStoreDomain} />
      
      {header && (
        <Navbar
          shop={header.shop}
          menu={header.menu}
          publicStoreDomain={publicStoreDomain}
        />
      )}
      
      <main className="min-h-screen bg-[var(--color-bg-primary)]">
        {children}
      </main>
      
      <Footer
        footer={footer}
        header={header}
        publicStoreDomain={publicStoreDomain}
      />
    </Aside.Provider>
  );
}

/**
 * CartAside - Neo-Brutalist Cart Drawer
 * Slides in from right with hard borders
 * 
 * @param {{cart: PageLayoutProps['cart']}}
 */
function CartAside({cart}) {
  return (
    <Aside type="cart" heading="CART">
      <div className="h-full bg-[var(--color-bg-primary)]">
        <Suspense fallback={<CartLoading />}>
          <Await resolve={cart}>
            {(cart) => {
              return <CartMain cart={cart} layout="aside" />;
            }}
          </Await>
        </Suspense>
      </div>
    </Aside>
  );
}

/**
 * CartLoading - Loading state for cart
 */
function CartLoading() {
  return (
    <div className="h-full flex flex-col bg-[var(--color-bg-primary)]">
      <div className="border-b-4 border-[var(--color-fg-primary)] px-6 py-4 bg-[var(--color-bg-secondary)]">
        <div className="h-8 bg-[var(--color-bg-tertiary)] w-32" />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="font-[var(--font-mono)] text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">
          LOADING CART...
        </div>
      </div>
    </div>
  );
}

/**
 * SearchAside - Search drawer
 */
function SearchAside() {
  const queriesDatalistId = useId();
  return (
    <Aside type="search" heading="SEARCH">
      <div className="h-full bg-[var(--color-bg-primary)]">
        <div className="p-6 border-b-2 border-[var(--color-border-primary)]">
          <SearchFormPredictive>
            {({fetchResults, goToSearch, inputRef}) => (
              <div className="flex gap-2">
                <input
                  name="q"
                  onChange={fetchResults}
                  onFocus={fetchResults}
                  placeholder="SEARCH PRODUCTS..."
                  ref={inputRef}
                  type="search"
                  list={queriesDatalistId}
                  className="flex-1 bg-[var(--color-bg-secondary)] border-2 border-[var(--color-fg-primary)] px-4 py-3 font-[var(--font-mono)] text-sm uppercase tracking-wider text-[var(--color-fg-primary)] placeholder:text-[var(--color-fg-muted)] focus:outline-none focus:bg-[var(--color-bg-tertiary)]"
                />
                <button 
                  onClick={goToSearch}
                  className="bg-[var(--color-fg-primary)] text-[var(--color-bg-primary)] border-2 border-[var(--color-fg-primary)] px-6 py-3 font-[var(--font-mono)] text-sm font-bold uppercase tracking-wider hover:bg-[var(--color-accent-cyan)] hover:border-[var(--color-accent-cyan)] transition-colors"
                >
                  SEARCH
                </button>
              </div>
            )}
          </SearchFormPredictive>
        </div>

        <div className="p-6 overflow-y-auto h-[calc(100%-88px)]">
          <SearchResultsPredictive>
            {({items, total, term, state, closeSearch}) => {
              const {articles, collections, pages, products, queries} = items;

              if (state === 'loading' && term.current) {
                return (
                  <div className="font-[var(--font-mono)] text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">
                    SEARCHING...
                  </div>
                );
              }

              if (!total) {
                return <SearchResultsPredictive.Empty term={term} />;
              }

              return (
                <div className="space-y-6">
                  <SearchResultsPredictive.Queries
                    queries={queries}
                    queriesDatalistId={queriesDatalistId}
                  />
                  <SearchResultsPredictive.Products
                    products={products}
                    closeSearch={closeSearch}
                    term={term}
                  />
                  <SearchResultsPredictive.Collections
                    collections={collections}
                    closeSearch={closeSearch}
                    term={term}
                  />
                  {term.current && total ? (
                    <Link
                      onClick={closeSearch}
                      to={`${SEARCH_ENDPOINT}?q=${term.current}`}
                      className="block font-[var(--font-mono)] text-xs uppercase tracking-widest text-[var(--color-accent-cyan)] hover:text-[var(--color-accent-lime)] transition-colors border-t-2 border-[var(--color-border-primary)] pt-4"
                    >
                      VIEW ALL RESULTS FOR "{term.current}" &rarr;
                    </Link>
                  ) : null}
                </div>
              );
            }}
          </SearchResultsPredictive>
        </div>
      </div>
    </Aside>
  );
}

/**
 * MobileMenuAside - Mobile navigation drawer
 */
function MobileMenuAside({header, publicStoreDomain}) {
  if (!header?.menu || !header?.shop?.primaryDomain?.url) return null;

  return (
    <Aside type="mobile" heading="MENU">
      <div className="h-full bg-[var(--color-bg-primary)] p-6">
        <nav className="space-y-[1px] bg-[var(--color-border-primary)] border-2 border-[var(--color-border-primary)]">
          {header.menu.items.map((item) => {
            if (!item.url) return null;
            
            const url =
              item.url.includes('myshopify.com') ||
              item.url.includes(publicStoreDomain)
                ? new URL(item.url).pathname
                : item.url;
                
            return (
              <a
                key={item.id}
                href={url}
                className="block bg-[var(--color-bg-secondary)] p-4 font-[var(--font-display)] text-lg font-bold uppercase tracking-tight text-[var(--color-fg-primary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-accent-lime)] transition-colors border-b-2 border-[var(--color-border-primary)] last:border-b-0"
              >
                {item.title}
              </a>
            );
          })}
        </nav>
      </div>
    </Aside>
  );
}

/**
 * @typedef {Object} PageLayoutProps
 * @property {Promise<CartApiQueryFragment|null>} cart
 * @property {Promise<FooterQuery|null>} footer
 * @property {HeaderQuery} header
 * @property {Promise<boolean>} isLoggedIn
 * @property {string} publicStoreDomain
 * @property {React.ReactNode} [children]
 */

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
/** @typedef {import('storefrontapi.generated').FooterQuery} FooterQuery */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
