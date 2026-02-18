import {CartForm, Image, Money} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from 'react-router';
import {useAside} from '~/components/Aside';

/**
 * CartLineItem - Neo-Brutalist Cart Line Item
 * Flex row layout with square hard-bordered quantity controls
 * 
 * @param {{layout: CartLayout; line: CartLine}}
 */
export function CartLineItem({layout, line}) {
  const {id, merchandise, quantity, cost} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();

  const isOptimistic = line.isOptimistic;

  return (
    <div 
      className={`flex gap-4 p-4 ${isOptimistic ? 'opacity-50' : 'opacity-100'} transition-opacity duration-150`}
    >
      {/* PRODUCT IMAGE - Square with hard border */}
      <div className="flex-shrink-0">
        {image && (
          <Link
            to={lineItemUrl}
            onClick={() => layout === 'aside' && close()}
            className="block border-2 border-[var(--color-fg-primary)]"
          >
            <Image
              alt={title}
              aspectRatio="1/1"
              data={image}
              height={80}
              loading="lazy"
              width={80}
              className="h-20 w-20 object-cover bg-[var(--color-bg-tertiary)]"
            />
          </Link>
        )}
      </div>

      {/* DETAILS COLUMN */}
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div className="flex justify-between items-start gap-2">
          <Link
            to={lineItemUrl}
            onClick={() => layout === 'aside' && close()}
            className="font-[var(--font-display)] text-sm font-bold uppercase tracking-tight text-[var(--color-fg-primary)] hover:text-[var(--color-accent-cyan)] transition-colors line-clamp-2"
          >
            {product.title}
          </Link>
          
          {/* Price - Mono font */}
          <span className="font-[var(--font-mono)] text-sm font-bold text-[var(--color-fg-primary)] whitespace-nowrap">
            <Money data={cost?.totalAmount} />
          </span>
        </div>

        {/* Variant Options - Mono font */}
        {selectedOptions.length > 0 && (
          <div className="mt-1">
            <p className="font-[var(--font-mono)] text-[10px] uppercase tracking-wider text-[var(--color-fg-muted)]">
              {selectedOptions.map(opt => `${opt.value}`).join(' / ')}
            </p>
          </div>
        )}

        {/* FOOTER: QUANTITY & REMOVE */}
        <div className="flex items-center justify-between mt-3">
          <CartLineQuantity line={line} />
          <CartLineRemoveButton lineIds={[id]} disabled={!!isOptimistic} />
        </div>
      </div>
    </div>
  );
}

/**
 * CartLineQuantity - Hard-bordered square quantity controls
 * @param {{line: CartLine}}
 */
function CartLineQuantity({line}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="flex items-center border-2 border-[var(--color-fg-primary)] bg-[var(--color-bg-primary)]">
      <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
        <button
          aria-label="Decrease quantity"
          disabled={quantity <= 1 || !!isOptimistic}
          name="decrease-quantity"
          value={prevQuantity}
          className="w-8 h-8 flex items-center justify-center font-[var(--font-mono)] text-sm font-bold text-[var(--color-fg-primary)] bg-[var(--color-bg-secondary)] hover:bg-[var(--color-accent-magenta)] hover:text-[var(--color-fg-primary)] disabled:opacity-30 disabled:hover:bg-[var(--color-bg-secondary)] transition-colors border-r-2 border-[var(--color-fg-primary)]"
        >
          &#8722;
        </button>
      </CartLineUpdateButton>
      
      <div className="w-10 h-8 flex items-center justify-center font-[var(--font-mono)] text-sm font-bold text-[var(--color-fg-primary)] bg-[var(--color-bg-primary)]">
        {quantity}
      </div>
      
      <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
        <button
          aria-label="Increase quantity"
          name="increase-quantity"
          value={nextQuantity}
          disabled={!!isOptimistic}
          className="w-8 h-8 flex items-center justify-center font-[var(--font-mono)] text-sm font-bold text-[var(--color-fg-primary)] bg-[var(--color-bg-secondary)] hover:bg-[var(--color-accent-lime)] hover:text-[var(--color-bg-primary)] disabled:opacity-30 disabled:hover:bg-[var(--color-bg-secondary)] transition-colors border-l-2 border-[var(--color-fg-primary)]"
        >
          &#43;
        </button>
      </CartLineUpdateButton>
    </div>
  );
}

/**
 * CartLineRemoveButton - Remove item from cart
 */
function CartLineRemoveButton({lineIds, disabled}) {
  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button 
        disabled={disabled} 
        type="submit"
        className="font-[var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)] hover:text-[var(--color-error)] underline underline-offset-2 transition-colors disabled:opacity-50"
      >
        REMOVE
      </button>
    </CartForm>
  );
}

function CartLineUpdateButton({children, lines}) {
  const lineIds = lines.map((line) => line.id);
  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}

function getUpdateKey(lineIds) {
  return [CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-');
}

/** @typedef {OptimisticCartLine<CartApiQueryFragment>} CartLine */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').CartLineUpdateInput} CartLineUpdateInput} */
/** @typedef {import('~/components/CartMain').CartLayout} CartLayout */
/** @typedef {import('@shopify/hydrogen').OptimisticCartLine} OptimisticCartLine} */
/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment} */
