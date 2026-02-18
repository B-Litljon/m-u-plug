import {Money} from '@shopify/hydrogen';

/**
 * ProductPrice - Neo-Brutalist Price Display
 * 
 * @param {Object} props
 * @param {MoneyV2} props.price - Current price
 * @param {MoneyV2} props.compareAtPrice - Compare at price (for sales)
 */
export function ProductPrice({price, compareAtPrice}) {
  return (
    <div className="flex items-baseline gap-3">
      {compareAtPrice ? (
        <>
          <span className="font-[var(--font-mono)] text-2xl md:text-3xl font-bold text-[var(--color-fg-primary)]">
            {price ? <Money data={price} /> : null}
          </span>
          <span className="font-[var(--font-mono)] text-lg text-[var(--color-fg-muted)] line-through">
            <Money data={compareAtPrice} />
          </span>
        </>
      ) : price ? (
        <span className="font-[var(--font-mono)] text-2xl md:text-3xl font-bold text-[var(--color-fg-primary)]">
          <Money data={price} />
        </span>
      ) : (
        <span className="font-[var(--font-mono)] text-2xl font-bold text-[var(--color-fg-muted)]">-</span>
      )}
    </div>
  );
}

/** @typedef {import('@shopify/hydrogen/storefront-api-types').MoneyV2} MoneyV2 */
