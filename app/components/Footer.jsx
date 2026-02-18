import {Suspense} from 'react';
import {Await, NavLink} from 'react-router';

/**
 * Footer - Neo-Brutalist Command Center Footer
 * Massive typography, grid layout, hard rectangular newsletter form
 */
export function Footer({footer: footerPromise, header, publicStoreDomain}) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="bg-[var(--color-bg-secondary)] border-t-4 border-[var(--color-fg-primary)]">
            <div className="max-w-[var(--grid-max-width)] mx-auto">
              
              {/* Main Footer Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-[var(--color-border-primary)]">
                
                {/* Brand Column */}
                <div className="bg-[var(--color-bg-secondary)] p-8 lg:p-12">
                  <h2 className="font-[var(--font-display)] text-4xl md:text-5xl font-bold uppercase tracking-tighter text-[var(--color-fg-primary)] mb-4">
                    {header?.shop?.name || 'M-U-PLUG'}
                  </h2>
                  <p className="font-[var(--font-mono)] text-xs uppercase tracking-widest text-[var(--color-fg-muted)] mb-6">
                    Retro Handhelds
                  </p>
                  <p className="text-sm text-[var(--color-fg-secondary)] leading-relaxed">
                    Premium gaming hardware for the modern collector. 
                    Authentic retro aesthetics, contemporary performance.
                  </p>
                </div>

                {/* Navigation Column */}
                <div className="bg-[var(--color-bg-secondary)] p-8 lg:p-12">
                  <h3 className="font-[var(--font-display)] text-xl font-bold uppercase tracking-tight text-[var(--color-fg-primary)] mb-6 border-b-2 border-[var(--color-border-accent)] pb-2">
                    Navigate
                  </h3>
                  <nav className="flex flex-col gap-3">
                    {['Shop', 'New Arrivals', 'Collections', 'About', 'Contact'].map((item) => (
                      <NavLink
                        key={item}
                        to={item === 'Shop' ? '/collections' : item === 'New Arrivals' ? '/collections/all' : `/${item.toLowerCase()}`}
                        className="font-[var(--font-mono)] text-sm uppercase tracking-wider text-[var(--color-fg-secondary)] hover:text-[var(--color-accent-lime)] transition-colors"
                      >
                        {item}
                      </NavLink>
                    ))}
                  </nav>
                </div>

                {/* Support Column */}
                <div className="bg-[var(--color-bg-secondary)] p-8 lg:p-12">
                  <h3 className="font-[var(--font-display)] text-xl font-bold uppercase tracking-tight text-[var(--color-fg-primary)] mb-6 border-b-2 border-[var(--color-border-accent)] pb-2">
                    Support
                  </h3>
                  <nav className="flex flex-col gap-3">
                    {FALLBACK_FOOTER_MENU.items.map((item) => {
                      const url = item.url.includes('myshopify.com') || item.url.includes(publicStoreDomain)
                        ? new URL(item.url).pathname
                        : item.url;
                      return (
                        <NavLink
                          key={item.id}
                          to={url}
                          className="font-[var(--font-mono)] text-sm uppercase tracking-wider text-[var(--color-fg-secondary)] hover:text-[var(--color-accent-cyan)] transition-colors"
                        >
                          {item.title}
                        </NavLink>
                      );
                    })}
                  </nav>
                </div>

                {/* Newsletter Column */}
                <div className="bg-[var(--color-bg-secondary)] p-8 lg:p-12">
                  <h3 className="font-[var(--font-display)] text-xl font-bold uppercase tracking-tight text-[var(--color-fg-primary)] mb-6 border-b-2 border-[var(--color-border-accent)] pb-2">
                    Newsletter
                  </h3>
                  <p className="text-sm text-[var(--color-fg-secondary)] mb-6">
                    Get updates on new drops and exclusive releases.
                  </p>
                  <NewsletterForm />
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="border-t-2 border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] px-8 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <p className="font-[var(--font-mono)] text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">
                    &copy; {new Date().getFullYear()} {header?.shop?.name || 'M-U-PLUG'}. All rights reserved.
                  </p>
                  <div className="flex items-center gap-4">
                    {['Instagram', 'Twitter', 'Discord'].map((social) => (
                      <a
                        key={social}
                        href="#"
                        className="font-[var(--font-mono)] text-xs uppercase tracking-widest text-[var(--color-fg-muted)] hover:text-[var(--color-accent-magenta)] transition-colors"
                      >
                        {social}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </footer>
        )}
      </Await>
    </Suspense>
  );
}

/**
 * Newsletter Form - Hard rectangular borders with offset shadow button
 */
function NewsletterForm() {
  return (
    <form 
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        // Handle newsletter signup
      }}
    >
      <div className="relative">
        <input
          type="email"
          placeholder="EMAIL@DOMAIN.COM"
          required
          className="w-full bg-[var(--color-bg-primary)] border-2 border-[var(--color-fg-primary)] px-4 py-3 font-[var(--font-mono)] text-sm uppercase tracking-wider text-[var(--color-fg-primary)] placeholder:text-[var(--color-fg-muted)] focus:outline-none focus:bg-[var(--color-bg-tertiary)] transition-colors"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-[var(--color-fg-primary)] text-[var(--color-bg-primary)] border-2 border-[var(--color-fg-primary)] px-4 py-3 font-[var(--font-display)] text-sm font-bold uppercase tracking-widest shadow-[4px_4px_0px_0px_var(--color-accent-lime)] hover:shadow-[2px_2px_0px_0px_var(--color-accent-lime)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all"
      >
        Submit
      </button>
    </form>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: null,
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: null,
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: null,
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: null,
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
    },
  ],
};
