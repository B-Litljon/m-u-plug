import {Money} from '@shopify/hydrogen';

/**
 * Premium Product Price Display
 * Shows current price with optional compare-at price and savings badge
 * @param {{
 *   price?: MoneyV2;
 *   compareAtPrice?: MoneyV2 | null;
 *   layout?: 'default' | 'compact';
 * }}
 */
export function ProductPrice({price, compareAtPrice, layout = 'default'}) {
  const isOnSale =
    compareAtPrice &&
    parseFloat(compareAtPrice.amount) > parseFloat(price?.amount || '0');

  // Calculate savings percentage
  const savingsPercent = isOnSale
    ? Math.round(
        (1 - parseFloat(price.amount) / parseFloat(compareAtPrice.amount)) *
          100,
      )
    : 0;

  if (!price) {
    return (
      <span className="text-[var(--color-primary)]/60">Price unavailable</span>
    );
  }

  if (layout === 'compact') {
    return (
      <div className="flex items-baseline gap-2">
        <span className="font-bold text-lg text-[var(--color-primary)]">
          <Money data={price} />
        </span>
        {isOnSale && (
          <span className="text-[var(--color-primary)]/40 line-through text-sm">
            <Money data={compareAtPrice} />
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-baseline gap-3 flex-wrap">
        {/* Current Price - Large and prominent */}
        <span className="text-3xl md:text-4xl font-bold text-[var(--color-primary)]">
          <Money data={price} />
        </span>

        {/* Compare At Price */}
        {isOnSale && (
          <span className="text-lg text-[var(--color-primary)]/40 line-through">
            <Money data={compareAtPrice} />
          </span>
        )}
      </div>

      {/* Savings Badge */}
      {isOnSale && savingsPercent > 0 && (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[var(--color-accent)]/10 text-[var(--color-accent)] rounded-[var(--radius-sm)]">
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
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
          <span className="text-sm font-semibold">Save {savingsPercent}%</span>
        </div>
      )}
    </div>
  );
}

/** @typedef {import('@shopify/hydrogen/storefront-api-types').MoneyV2} MoneyV2 */
