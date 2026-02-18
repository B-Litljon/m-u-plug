import {ServerRouter} from 'react-router';
import {isbot} from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {createContentSecurityPolicy} from '@shopify/hydrogen';

/**
 * Cache Control Headers Helper
 * Sets appropriate cache headers for different response types
 * 
 * @param {Request} request
 * @param {Headers} headers
 * @param {number} statusCode
 */
function setCacheHeaders(request, headers, statusCode) {
  const pathname = new URL(request.url).pathname;
  
  // Don't cache error pages
  if (statusCode >= 400) {
    headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    return;
  }
  
  // Don't cache authenticated/admin routes
  if (pathname.includes('/account') || pathname.includes('/admin')) {
    headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    return;
  }
  
  // Don't cache cart/checkout
  if (pathname.includes('/cart') || pathname.includes('/checkout')) {
    headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    return;
  }
  
  // API routes - short cache
  if (pathname.startsWith('/api')) {
    headers.set('Cache-Control', 'public, max-age=5, stale-while-revalidate=60');
    return;
  }
  
  // Static assets - long cache
  if (pathname.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    return;
  }
  
  // Public pages - 60s SWR (Stale-While-Revalidate)
  // Pages can be served from cache for 1 minute, then revalidated in background
  headers.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=600');
}

/**
 * Server-side rendering entry point
 * 
 * @param {Request} request
 * @param {number} responseStatusCode
 * @param {Headers} responseHeaders
 * @param {EntryContext} reactRouterContext
 * @param {HydrogenRouterContextProvider} context
 */
export default async function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  reactRouterContext,
  context,
) {
  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <ServerRouter
        context={reactRouterContext}
        url={request.url}
        nonce={nonce}
      />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  // Set content type and CSP
  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);
  
  // Set cache headers
  setCacheHeaders(request, responseHeaders, responseStatusCode);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}

/** @typedef {import('@shopify/hydrogen').HydrogenRouterContextProvider} HydrogenRouterContextProvider */
/** @typedef {import('react-router').EntryContext} EntryContext */
