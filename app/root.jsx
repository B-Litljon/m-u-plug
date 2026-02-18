import {Analytics, getShopAnalytics, useNonce} from '@shopify/hydrogen';
import {
  Outlet,
  useRouteError,
  isRouteErrorResponse,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
  Link,
} from 'react-router';
import favicon from '~/assets/favicon.svg';
import {FOOTER_QUERY, HEADER_QUERY} from '~/lib/fragments';
import resetStyles from '~/styles/reset.css?url';
import appStyles from '~/styles/app.css?url';
import tailwindCss from './styles/tailwind.css?url';
import {PageLayout} from './components/PageLayout';

/**
 * This is important to avoid re-fetching root queries on sub-navigations
 */
export const shouldRevalidate = ({formMethod, currentUrl, nextUrl}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') return true;

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) return true;

  // Defaulting to no revalidation for root loader data to improve performance
  return false;
};

/**
 * Links - Preconnect and favicon
 */
export function links() {
  return [
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossOrigin: 'anonymous',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Space+Grotesk:wght@400;500;600;700&display=swap',
    },
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
  ];
}

/**
 * Meta - SEO Metadata
 */
export function meta() {
  return [
    {title: 'M-U-PLUG // RETRO HARDWARE'},
    {
      name: 'description',
      content: 'Premium retro gaming handhelds and accessories. Authentic hardware for modern collectors.',
    },
    {
      property: 'og:title',
      content: 'M-U-PLUG // RETRO HARDWARE',
    },
    {
      property: 'og:description',
      content: 'Premium retro gaming handhelds and accessories. Authentic hardware for modern collectors.',
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      name: 'theme-color',
      content: '#0a0a0a',
    },
    {
      name: 'robots',
      content: 'index, follow',
    },
  ];
}

/**
 * Root Loader - Fetches shop analytics and essential data
 * 
 * Shopify Analytics Setup:
 * - getShopAnalytics: Provides shop ID and other analytics data
 * - Analytics.Provider: Wraps the app to enable event tracking
 * - Events automatically fired: page_view, collection_view, product_view, cart_view, add_to_cart
 */
export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  const {storefront, env} = args.context;

  // Get shop analytics data for Shopify Analytics
  // This enables automatic tracking of customer behavior
  const shopAnalytics = getShopAnalytics({
    storefront,
    publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
  });

  return {
    ...deferredData,
    ...criticalData,
    publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
    shop: shopAnalytics,
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: false,
      // localize the privacy banner
      country: args.context.storefront.i18n.country,
      language: args.context.storefront.i18n.language,
    },
  };
}

/**
 * Load critical data
 */
async function loadCriticalData({context}) {
  const {storefront} = context;

  const [header] = await Promise.all([
    storefront.query(HEADER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        headerMenuHandle: 'main-menu',
      },
    }),
  ]);

  return {header};
}

/**
 * Load deferred data
 */
function loadDeferredData({context}) {
  const {storefront, customerAccount, cart} = context;

  const footer = storefront
    .query(FOOTER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        footerMenuHandle: 'footer',
      },
    })
    .catch((error) => {
      console.error(error);
      return null;
    });

  return {
    cart: cart.get(),
    isLoggedIn: customerAccount.isLoggedIn(),
    footer,
  };
}

/**
 * Layout Component
 */
export function Layout({children}) {
  const nonce = useNonce();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href={tailwindCss}></link>
        <link rel="stylesheet" href={resetStyles}></link>
        <link rel="stylesheet" href={appStyles}></link>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

/**
 * App Component
 * 
 * Analytics Provider wraps the entire app to enable:
 * - Page view tracking
 * - Collection view tracking  
 * - Product view tracking
 * - Cart events (add_to_cart, cart_view)
 * - Checkout events
 * 
 * These events are sent to Shopify Analytics automatically
 */
export default function App() {
  const data = useRouteLoaderData('root');

  if (!data) {
    return <Outlet />;
  }

  return (
    <Analytics.Provider
      cart={data.cart}
      shop={data.shop}
      consent={data.consent}
    >
      <PageLayout {...data}>
        <Outlet />
      </PageLayout>
    </Analytics.Provider>
  );
}

/**
 * ErrorBoundary - Neo-Brutalist Error Display
 * Catches all unhandled errors in the app
 */
export function ErrorBoundary() {
  const error = useRouteError();
  let errorMessage = 'Unknown error';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] flex flex-col">
      {/* Error Header */}
      <header className="border-b-4 border-[var(--color-error)] bg-[var(--color-bg-secondary)]">
        <div className="max-w-[var(--grid-max-width)] mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[var(--color-error)] animate-pulse" />
            <span className="font-[var(--font-mono)] text-xs uppercase tracking-[0.3em] text-[var(--color-error)]">
              CRITICAL ERROR
            </span>
          </div>
        </div>
      </header>

      {/* Main Error Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full text-center">
          {/* Error Code */}
          <div className="mb-8">
            <span className="font-[var(--font-display)] text-7xl md:text-8xl font-bold text-[var(--color-error)] tracking-tighter">
              {errorStatus}
            </span>
          </div>

          {/* Error Title */}
          <h1 className="font-[var(--font-display)] text-2xl md:text-4xl font-bold uppercase tracking-tighter text-[var(--color-fg-primary)] mb-4">
            // SYSTEM FAILURE
          </h1>

          {/* Error Message */}
          <p className="font-[var(--font-mono)] text-sm uppercase tracking-widest text-[var(--color-fg-muted)] mb-8">
            {errorStatus === 404 ? 'SIGNAL LOST' : 'CRITICAL ERROR DETECTED'}
          </p>

          {/* Error Details */}
          <div className="border-2 border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] p-6 mb-8 max-w-lg mx-auto">
            <div className="font-[var(--font-mono)] text-xs uppercase tracking-wider text-[var(--color-fg-muted)] mb-4 border-b border-[var(--color-border-primary)] pb-2">
              ERROR LOG
            </div>
            <code className="font-[var(--font-mono)] text-xs text-[var(--color-error)] block text-left overflow-x-auto whitespace-pre-wrap">
              {typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage, null, 2)}
            </code>
          </div>

          {/* Action Button */}
          <Link
            to="/"
            className="inline-block bg-[var(--color-fg-primary)] text-[var(--color-bg-primary)] border-2 border-[var(--color-fg-primary)] px-8 py-4 font-[var(--font-display)] text-sm font-bold uppercase tracking-widest shadow-[4px_4px_0px_0px_var(--color-accent-lime)] hover:shadow-[2px_2px_0px_0px_var(--color-accent-lime)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all"
          >
            REBOOT SYSTEM
          </Link>
        </div>
      </main>

      {/* Footer Error Bar */}
      <footer className="border-t-2 border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)]">
        <div className="max-w-[var(--grid-max-width)] mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]">
              M-U-PLUG // ERROR HANDLER
            </span>
            <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--color-error)]">
              TERMINATED
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/** @typedef {LoaderReturnData} RootLoader */

/** @typedef {import('react-router').ShouldRevalidateFunction} ShouldRevalidateFunction */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
