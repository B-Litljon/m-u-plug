import {CartForm, Image} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from 'react-router';
import {ProductPrice} from './ProductPrice';
import {useAside} from '~/components/Aside';

/**
 * A single line item in the cart.
 * @param {{
 * layout: CartLayout;
 * line: CartLine;
 * }}
 */
export function CartLineItem({layout, line}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();

  // If the item is being removed/updated optimistically, fade it out
  const isOptimistic = line.isOptimistic;

  return (
    <li 
      key={id} 
      className={`flex gap-4 py-4 border-b border-[var(--color-subtle)] last:border-none ${isOptimistic ? 'opacity-50 grayscale' : 'opacity-100'} transition-all duration-200`}
    >
      {/* 1. PRODUCT IMAGE */}
      <div className="flex-shrink-0">
        {image && (
          <Link
            to={lineItemUrl}
            onClick={() => layout === 'aside' && close()}
          >
            <Image
              alt={title}
              aspectRatio="1/1"
              data={image}
              height={100}
              loading="lazy"
              width={100}
              className="h-24 w-24 rounded-[var(--radius-sm)] object-cover bg-[var(--color-subtle)] border border-[var(--color-border)]"
            />
          </Link>
        )}
      </div>

      {/* 2. DETAILS COLUMN */}
      <div className="flex flex-1 flex-col justify-between">
        <div className="grid gap-1">
          <div className="flex justify-between items-start">
            <Link
              to={lineItemUrl}
              onClick={() => layout === 'aside' && close()}
              className="font-bold text-[var(--color-primary)] hover:underline decoration-1 underline-offset-2 line-clamp-2"
            >
              {product.title}
            </Link>
            {/* Price aligned to top right */}
            <div className="text-sm font-medium">
               <ProductPrice price={line?.cost?.totalAmount} />
            </div>
          </div>

          {/* Variants (Size/Color) */}
          <ul className="text-xs text-gray-500 space-y-0.5">
            {selectedOptions.map((option) => (
              <li key={option.name}>
                {option.name}: {option.value}
              </li>
            ))}
          </ul>
        </div>

        {/* 3. FOOTER: QUANTITY & REMOVE */}
        <div className="flex items-center justify-between mt-2">
          <CartLineQuantity line={line} />
          
          <CartLineRemoveButton lineIds={[id]} disabled={!!isOptimistic} />
        </div>
      </div>
    </li>
  );
}

/**
 * Custom "Pill" styled quantity selector
 * @param {{line: CartLine}}
 */
function CartLineQuantity({line}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="flex items-center border border-[var(--color-border)] rounded-[var(--radius-sm)] bg-[var(--color-contrast)] h-8">
      <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
        <button
          aria-label="Decrease quantity"
          disabled={quantity <= 1 || !!isOptimistic}
          name="decrease-quantity"
          value={prevQuantity}
          className="w-8 h-full flex items-center justify-center hover:bg-[var(--color-subtle)] disabled:opacity-30 text-[var(--color-primary)] transition-colors"
        >
          <span>&#8722;</span>
        </button>
      </CartLineUpdateButton>
      
      <div className="px-2 text-sm font-medium text-[var(--color-primary)] min-w-[1.5rem] text-center">
        {quantity}
      </div>
      
      <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
        <button
          aria-label="Increase quantity"
          name="increase-quantity"
          value={nextQuantity}
          disabled={!!isOptimistic}
          className="w-8 h-full flex items-center justify-center hover:bg-[var(--color-subtle)] disabled:opacity-30 text-[var(--color-primary)] transition-colors"
        >
          <span>&#43;</span>
        </button>
      </CartLineUpdateButton>
    </div>
  );
}

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
        className="text-xs font-medium text-gray-500 hover:text-[var(--color-error)] underline underline-offset-2 transition-colors disabled:opacity-50"
      >
        Remove
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
/** @typedef {import('@shopify/hydrogen/storefront-api-types').CartLineUpdateInput} CartLineUpdateInput */
/** @typedef {import('~/components/CartMain').CartLayout} CartLayout */
/** @typedef {import('@shopify/hydrogen').OptimisticCartLine} OptimisticCartLine */
/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */