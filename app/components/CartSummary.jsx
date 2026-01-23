import {CartForm, Money} from '@shopify/hydrogen';
import {useEffect, useRef} from 'react';
import {useFetcher} from 'react-router';

/**
 * @param {CartSummaryProps}
 */
export function CartSummary({cart, layout}) {
  const className =
    layout === 'page' ? 'cart-summary-page' : 'cart-summary-aside';

  return (
    <div aria-labelledby="cart-summary" className={`${className} space-y-4`}>
      <dl className="cart-subtotal flex justify-between items-center text-lg font-medium">
        <dt>Subtotal</dt>
        <dd>
          {cart?.cost?.subtotalAmount?.amount ? (
            <Money data={cart?.cost?.subtotalAmount} />
          ) : (
            '-'
          )}
        </dd>
      </dl>
      
      <CartDiscounts discountCodes={cart?.discountCodes} />
      <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} />
      
      <p className="text-xs text-center text-gray-500 mt-4">
        Shipping & taxes calculated at checkout
      </p>
    </div>
  );
}

/**
 * @param {{checkoutUrl?: string}}
 */
function CartCheckoutActions({checkoutUrl}) {
  if (!checkoutUrl) return null;

  return (
    <div className="mt-4">
      <a 
        href={checkoutUrl} 
        target="_self"
        className="block w-full py-4 bg-[var(--color-primary)] text-[var(--color-contrast)] text-center font-bold text-lg uppercase tracking-wide rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity"
      >
        Checkout &rarr;
      </a>
    </div>
  );
}

// ... (Keep the rest of CartDiscounts and GiftCard logic exactly as is, they are fine)
/**
 * @param {{
 * discountCodes?: CartApiQueryFragment['discountCodes'];
 * }}
 */
function CartDiscounts({discountCodes}) {
  const codes =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div className="text-sm">
      {/* Have existing discount, display it with a remove option */}
      <dl hidden={!codes.length}>
        <div className="flex items-center justify-between py-2">
          <dt className="text-gray-500">Discount</dt>
          <UpdateDiscountForm>
            <div className="cart-discount flex items-center space-x-2">
              <code className="bg-[var(--color-subtle)] px-2 py-1 rounded">{codes?.join(', ')}</code>
              <button className="text-[var(--color-error)] text-xs underline">Remove</button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>
    </div>
  );
}

/**
 * @param {{
 * discountCodes?: string[];
 * children: React.ReactNode;
 * }}
 */
function UpdateDiscountForm({discountCodes, children}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

/**
 * @typedef {{
 * cart: OptimisticCart<CartApiQueryFragment | null>;
 * layout: CartLayout;
 * }} CartSummaryProps
 */

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
/** @typedef {import('~/components/CartMain').CartLayout} CartLayout */
/** @typedef {import('@shopify/hydrogen').OptimisticCart} OptimisticCart */
/** @typedef {import('react-router').FetcherWithComponents} FetcherWithComponents */