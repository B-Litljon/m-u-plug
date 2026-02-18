import {CartForm, Money} from '@shopify/hydrogen';

/**
 * CartSummary - Neo-Brutalist Cart Summary
 * Totals display with massive lime checkout button
 * 
 * @param {CartSummaryProps}
 */
export function CartSummary({cart, layout}) {
  const isAside = layout === 'aside';

  return (
    <div className="p-6 space-y-4" aria-labelledby="cart-summary">
      {/* Subtotal Row */}
      <div className="flex justify-between items-center">
        <span className="font-[var(--font-mono)] text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">
          SUBTOTAL
        </span>
        <span className="font-[var(--font-mono)] text-xl font-bold text-[var(--color-fg-primary)]">
          {cart?.cost?.subtotalAmount?.amount ? (
            <Money data={cart?.cost?.subtotalAmount} />
          ) : (
            '-'
          )}
        </span>
      </div>

      {/* Discount Codes */}
      <CartDiscounts discountCodes={cart?.discountCodes} />
      
      {/* Divider */}
      <div className="border-t-2 border-[var(--color-border-primary)]" />
      
      {/* Total Row */}
      <div className="flex justify-between items-center">
        <span className="font-[var(--font-display)] text-lg font-bold uppercase tracking-tight text-[var(--color-fg-primary)]">
          TOTAL
        </span>
        <span className="font-[var(--font-mono)] text-2xl font-bold text-[var(--color-accent-lime)]">
          {cart?.cost?.totalAmount?.amount ? (
            <Money data={cart?.cost?.totalAmount} />
          ) : (
            '-'
          )}
        </span>
      </div>
      
      {/* Checkout Button - Massive lime with hard shadow */}
      <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} />
      
      {/* Tax/Shipping Note */}
      <p className="font-[var(--font-mono)] text-[10px] uppercase tracking-wider text-[var(--color-fg-muted)] text-center">
        Shipping & taxes calculated at checkout
      </p>
    </div>
  );
}

/**
 * CartCheckoutActions - Massive brutalist checkout button
 * 
 * @param {{checkoutUrl?: string}}
 */
function CartCheckoutActions({checkoutUrl}) {
  if (!checkoutUrl) return null;

  return (
    <div className="pt-2">
      <a 
        href={checkoutUrl} 
        target="_self"
        className="block w-full bg-[var(--color-accent-lime)] text-[var(--color-bg-primary)] border-2 border-[var(--color-accent-lime)] py-4 px-6 font-[var(--font-display)] text-lg font-bold uppercase tracking-widest text-center shadow-[4px_4px_0px_0px_var(--color-fg-primary)] hover:shadow-[2px_2px_0px_0px_var(--color-fg-primary)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all"
      >
        CHECKOUT
      </a>
    </div>
  );
}

/**
 * CartDiscounts - Applied discount codes
 * 
 * @param {{discountCodes?: CartApiQueryFragment['discountCodes']}}
 */
function CartDiscounts({discountCodes}) {
  const codes =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  if (codes.length === 0) return null;

  return (
    <div className="flex justify-between items-center">
      <span className="font-[var(--font-mono)] text-xs uppercase tracking-widest text-[var(--color-accent-cyan)]">
        DISCOUNT
      </span>
      <UpdateDiscountForm>
        <div className="flex items-center gap-2">
          <code className="font-[var(--font-mono)] text-xs uppercase bg-[var(--color-bg-tertiary)] border border-[var(--color-border-accent)] px-2 py-1 text-[var(--color-fg-primary)]">
            {codes?.join(', ')}
          </code>
          <button 
            type="submit"
            className="font-[var(--font-mono)] text-[10px] uppercase tracking-wider text-[var(--color-fg-muted)] hover:text-[var(--color-error)] underline underline-offset-2 transition-colors"
          >
            Remove
          </button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

/**
 * UpdateDiscountForm - Remove discount codes
 * 
 * @param {{children: React.ReactNode}}
 */
function UpdateDiscountForm({children}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: [],
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
