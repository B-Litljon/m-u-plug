import {Suspense} from 'react';
import {Await, NavLink, Link} from 'react-router';

/**
 * @param {FooterProps}
 */
export function Footer({footer: footerPromise, header, publicStoreDomain}) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="bg-[var(--color-primary)] text-[var(--color-contrast)]">
            {/* Main Footer Content */}
            <div className="container mx-auto px-6 md:px-8 py-16">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                {/* 1. BRAND COLUMN */}
                <div className="lg:col-span-1">
                  <Link to="/" className="inline-block mb-4">
                    <span
                      className="text-2xl font-bold tracking-tight"
                      style={{fontFamily: 'var(--font-display)'}}
                    >
                      M-U-PLUG
                    </span>
                  </Link>
                  <p className="text-[var(--color-contrast)]/60 text-sm leading-relaxed mb-6">
                    Your childhood memories, in the palm of your hand. Premium
                    retro gaming handhelds, pre-loaded and ready to play.
                  </p>
                  {/* Social Links */}
                  <div className="flex gap-4">
                    <SocialLink
                      href="#"
                      label="Discord"
                      icon={<DiscordIcon />}
                    />
                    <SocialLink
                      href="#"
                      label="YouTube"
                      icon={<YouTubeIcon />}
                    />
                    <SocialLink href="#" label="Reddit" icon={<RedditIcon />} />
                  </div>
                </div>

                {/* 2. SHOP COLUMN */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-5 text-[var(--color-contrast)]/40">
                    Shop
                  </h4>
                  <ul className="space-y-3">
                    <FooterLink to="/collections/all">All Devices</FooterLink>
                    <FooterLink to="/collections/handhelds">
                      Handhelds
                    </FooterLink>
                    <FooterLink to="/collections/accessories">
                      Accessories
                    </FooterLink>
                    <FooterLink to="/collections/sd-cards">SD Cards</FooterLink>
                  </ul>
                </div>

                {/* 3. SUPPORT COLUMN */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-5 text-[var(--color-contrast)]/40">
                    Support
                  </h4>
                  <ul className="space-y-3">
                    <FooterLink to="/pages/contact">Contact Us</FooterLink>
                    <FooterLink to="/pages/faq">FAQ</FooterLink>
                    <FooterLink to="/pages/setup-guides">
                      Setup Guides
                    </FooterLink>
                    <FooterLink to="/pages/track-order">Track Order</FooterLink>
                  </ul>
                </div>

                {/* 4. POLICIES COLUMN - Dynamic from Shopify */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-5 text-[var(--color-contrast)]/40">
                    Policies
                  </h4>
                  <ul className="space-y-3">
                    {footer?.menu && header.shop.primaryDomain?.url ? (
                      <PolicyLinks
                        menu={footer.menu}
                        primaryDomainUrl={header.shop.primaryDomain.url}
                        publicStoreDomain={publicStoreDomain}
                      />
                    ) : (
                      <FallbackPolicyLinks />
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-[var(--color-contrast)]/10">
              <div className="container mx-auto px-6 md:px-8 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[var(--color-contrast)]/40">
                  <p>
                    &copy; {new Date().getFullYear()} M-U-PLUG. All rights
                    reserved.
                  </p>
                  <div className="flex items-center gap-6">
                    <span className="flex items-center gap-2">
                      <LockIcon />
                      Secure Checkout
                    </span>
                    <span>Powered by Shopify</span>
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
 * Reusable Footer Link Component
 */
function FooterLink({to, children}) {
  return (
    <li>
      <Link
        to={to}
        prefetch="intent"
        className="text-sm text-[var(--color-contrast)]/70 hover:text-[var(--color-contrast)] transition-colors duration-200"
      >
        {children}
      </Link>
    </li>
  );
}

/**
 * Social Link with Icon
 */
function SocialLink({href, label, icon}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-10 h-10 rounded-full bg-[var(--color-contrast)]/10 flex items-center justify-center hover:bg-[var(--color-accent)] transition-colors duration-200"
    >
      {icon}
    </a>
  );
}

/**
 * Dynamic Policy Links from Shopify Menu
 */
function PolicyLinks({menu, primaryDomainUrl, publicStoreDomain}) {
  return (
    <>
      {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
        if (!item.url) return null;
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        const isExternal = !url.startsWith('/');

        return (
          <li key={item.id}>
            {isExternal ? (
              <a
                href={url}
                rel="noopener noreferrer"
                target="_blank"
                className="text-sm text-[var(--color-contrast)]/70 hover:text-[var(--color-contrast)] transition-colors duration-200"
              >
                {item.title}
              </a>
            ) : (
              <NavLink
                end
                prefetch="intent"
                to={url}
                className="text-sm text-[var(--color-contrast)]/70 hover:text-[var(--color-contrast)] transition-colors duration-200"
              >
                {item.title}
              </NavLink>
            )}
          </li>
        );
      })}
    </>
  );
}

/**
 * Fallback Policy Links
 */
function FallbackPolicyLinks() {
  return (
    <>
      {FALLBACK_FOOTER_MENU.items.map((item) => (
        <li key={item.id}>
          <Link
            to={item.url}
            prefetch="intent"
            className="text-sm text-[var(--color-contrast)]/70 hover:text-[var(--color-contrast)] transition-colors duration-200"
          >
            {item.title}
          </Link>
        </li>
      ))}
    </>
  );
}

// ============================================
// ICONS
// ============================================

function DiscordIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function RedditIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  );
}

// ============================================
// FALLBACK DATA
// ============================================

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      title: 'Privacy Policy',
      url: '/policies/privacy-policy',
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      title: 'Refund Policy',
      url: '/policies/refund-policy',
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      title: 'Shipping Policy',
      url: '/policies/shipping-policy',
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      title: 'Terms of Service',
      url: '/policies/terms-of-service',
    },
  ],
};

/**
 * @typedef {Object} FooterProps
 * @property {Promise<FooterQuery|null>} footer
 * @property {HeaderQuery} header
 * @property {string} publicStoreDomain
 */

/** @typedef {import('storefrontapi.generated').FooterQuery} FooterQuery */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
