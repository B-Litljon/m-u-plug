import {useOptimisticCart, Money} from '@shopify/hydrogen';
import {Link} from 'react-router';
import {useAside} from '~/components/Aside';
import {CartLineItem} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';

// * CONFIG: Set your free shipping threshold here
const FREE_SHIPPING_THRESHOLD = 100;

/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 * @param {CartMainProps}
 */
export function CartMain({layout, cart: originalCart}) {
  const cart = useOptimisticCart(originalCart);
  
  // Calculate Free Shipping Progress
  const totalAmount = parseFloat(cart?.cost?.subtotalAmount?.amount || '0');
  const amountLeft = FREE_SHIPPING_THRESHOLD - totalAmount;
  const progress = Math.min((totalAmount / FREE_SHIPPING_THRESHOLD) * 100, 100);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const className = `cart-main ${withDiscount ? 'with-discount' : ''} h-full flex flex-col`;

  return (
    <div className={className}>
      {/* FREE SHIPPING BAR */}
      <div className="px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-subtle)]">
        {amountLeft > 0 ? (
          <p className="text-sm text-[var(--color-primary)] mb-2">
            Add <strong>${amountLeft.toFixed(2)}</strong> for Free Shipping
          </p>
        ) : (
          <p className="text-sm font-bold text-[var(--color-success)] mb-2">
            You've unlocked Free Shipping!
          </p>
        )}
        <div className="w-full bg-[var(--color-border)] h-1.5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[var(--color-primary)] transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>

      <CartEmpty hidden={linesCount} layout={layout} />

      {/* CART ITEMS AREA */}
      <div className="cart-details flex-1 overflow-y-auto px-6 py-4">
        <div aria-labelledby="cart-lines">
          <ul className="grid gap-6">
            {(cart?.lines?.nodes ?? []).map((line) => (
              <CartLineItem key={line.id} line={line} layout={layout} />
            ))}
          </ul>
        </div>
      </div>
      
      {/* SUMMARY FOOTER */}
      {linesCount && (
        <div className="border-t border-[var(--color-border)] p-6 bg-[var(--color-contrast)]">
          <CartSummary cart={cart} layout={layout} />
        </div>
      )}
    </div>
  );
}

/**
 * @param {{
 * hidden: boolean;
 * layout?: CartMainProps['layout'];
 * }}
 */
function CartEmpty({hidden = false}) {
  const {close} = useAside();
  return (
    <div hidden={hidden} className="flex flex-col items-center justify-center h-full text-center p-8 space-y-6">
      <div className="w-16 h-16 rounded-full bg-[var(--color-subtle)] flex items-center justify-center text-2xl">
        🛒
      </div>
      <div>
        <h3 className="text-lg font-medium">Your bag is empty</h3>
        <p className="text-sm text-gray-500 mt-1">Looks like you haven't added anything yet.</p>
      </div>
      <Link 
        to="/collections" 
        onClick={close} 
        prefetch="viewport"
        className="w-full py-3 px-6 bg-[var(--color-primary)] text-[var(--color-contrast)] font-medium rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity"
      >
        Continue Shopping
      </Link>
    </div>
  );
}

/** @typedef {'page' | 'aside'} CartLayout */
/**
 * @typedef {{
 * cart: CartApiQueryFragment | null;
 * layout: CartLayout;
 * }} CartMainProps
 */

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */