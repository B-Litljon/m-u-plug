import {useOptimisticCart, Money} from '@shopify/hydrogen';
import {Link} from 'react-router';
import {useAside} from '~/components/Aside';
import {CartLineItem} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';

/**
 * CartMain - Neo-Brutalist Cart Container
 * Main cart component for drawer and page views
 * 
 * @param {CartMainProps}
 */
export function CartMain({layout, cart: originalCart}) {
  const cart = useOptimisticCart(originalCart);
  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);

  const className = `cart-main h-full flex flex-col bg-[var(--color-bg-primary)]`;

  return (
    <div className={className}>
      {/* Cart Header */}
      <div className="border-b-4 border-[var(--color-fg-primary)] px-6 py-4 bg-[var(--color-bg-secondary)]">
        <h2 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold uppercase tracking-tighter text-[var(--color-fg-primary)]">
          YOUR HAUL
        </h2>
        <p className="font-[var(--font-mono)] text-xs uppercase tracking-widest text-[var(--color-fg-muted)] mt-1">
          {cart?.lines?.nodes?.length || 0} ITEMS
        </p>
      </div>

      <CartEmpty hidden={linesCount} layout={layout} />

      {/* CART ITEMS AREA */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4" aria-labelledby="cart-lines">
          <ul className="space-y-[1px] bg-[var(--color-border-primary)] border-2 border-[var(--color-border-primary)]">
            {(cart?.lines?.nodes ?? []).map((line) => (
              <li key={line.id} className="bg-[var(--color-bg-secondary)]">
                <CartLineItem line={line} layout={layout} />
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* SUMMARY FOOTER */}
      {linesCount && (
        <div className="border-t-4 border-[var(--color-fg-primary)] bg-[var(--color-bg-secondary)]">
          <CartSummary cart={cart} layout={layout} />
        </div>
      )}
    </div>
  );
}

/**
 * CartEmpty - Neo-Brutalist Empty State
 * 
 * @param {{hidden: boolean; layout?: CartMainProps['layout']}}
 */
function CartEmpty({hidden = false}) {
  const {close} = useAside();
  
  return (
    <div 
      hidden={hidden} 
      className="flex flex-col items-center justify-center h-full text-center p-8"
    >
      <div className="border-4 border-[var(--color-fg-primary)] bg-[var(--color-bg-secondary)] p-8 mb-6">
        <div className="w-16 h-16 border-2 border-[var(--color-fg-primary)] flex items-center justify-center text-2xl bg-[var(--color-bg-tertiary)]">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="square"
            className="text-[var(--color-fg-primary)]"
          >
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
            <path d="M3 6h18"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
        </div>
      </div>
      
      <h3 className="font-[var(--font-display)] text-2xl font-bold uppercase tracking-tight text-[var(--color-fg-primary)] mb-2">
        CART EMPTY
      </h3>
      <p className="font-[var(--font-mono)] text-sm uppercase tracking-widest text-[var(--color-fg-muted)] mb-6">
        // GO LOOT
      </p>
      
      <Link 
        to="/collections/all" 
        onClick={close} 
        prefetch="viewport"
        className="inline-block bg-[var(--color-fg-primary)] text-[var(--color-bg-primary)] border-2 border-[var(--color-fg-primary)] px-8 py-3 font-[var(--font-mono)] text-xs font-bold uppercase tracking-widest hover:bg-[var(--color-accent-lime)] hover:border-[var(--color-accent-lime)] hover:text-[var(--color-bg-primary)] transition-colors"
      >
        START SHOPPING
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
