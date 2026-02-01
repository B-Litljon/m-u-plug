import {Link} from 'react-router';
import {Image, Money, CartForm} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';

/**
 * @param {{
 * product: ProductItemFragment;
 * loading?: 'eager' | 'lazy';
 * }}
 */
export function ProductItem({product, loading}) {
  const variant = product.variants?.nodes[0];
  const variantUrl = useVariantUrl(product.handle, variant?.selectedOptions);

  // Logic for "Sale" Badge
  const isOnSale =
    product.compareAtPriceRange?.minVariantPrice?.amount >
    product.priceRange?.minVariantPrice?.amount;
  const isSoldOut = !product.availableForSale;
  const variantAvailable = variant?.availableForSale !== false;

  return (
    <div className="product-item group relative flex flex-col">
      {/* Card Container with hover elevation */}
      <div className="relative rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-contrast)] overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-black/10 hover:border-[var(--color-primary)]/20">
        {/* 1. IMAGE CONTAINER */}
        <Link
          prefetch="intent"
          to={variantUrl}
          className="block aspect-[4/5] w-full overflow-hidden bg-[var(--color-subtle)] relative"
        >
          {product.featuredImage && (
            <Image
              alt={product.featuredImage.altText || product.title}
              aspectRatio="4/5"
              data={product.featuredImage}
              loading={loading}
              sizes="(min-width: 45em) 400px, 100vw"
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          )}

          {/* 2. BADGES (Absolute Positioned) */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {isSoldOut && (
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest bg-[var(--color-primary)] text-[var(--color-contrast)] rounded-[var(--radius-sm)]">
                Sold Out
              </span>
            )}
            {isOnSale && !isSoldOut && (
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest bg-[var(--color-accent)] text-white rounded-[var(--radius-sm)]">
                Sale
              </span>
            )}
          </div>
        </Link>

        {/* 3. QUICK ADD - Hover Reveal */}
        {variant?.id && variantAvailable && !isSoldOut && (
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
            <QuickAddButton
              variantId={variant.id}
              productTitle={product.title}
            />
          </div>
        )}
      </div>

      {/* 4. DETAILS - Outside the card for cleaner look */}
      <Link
        prefetch="intent"
        to={variantUrl}
        className="block mt-4 space-y-1.5"
      >
        <h4 className="font-semibold text-[var(--color-primary)] text-sm leading-tight line-clamp-2 group-hover:text-[var(--color-accent)] transition-colors duration-200">
          {product.title}
        </h4>

        <div className="flex items-baseline gap-2">
          {/* Current Price - Prominent */}
          <span className="font-bold text-lg text-[var(--color-primary)]">
            <Money data={product.priceRange.minVariantPrice} />
          </span>

          {/* Compare At Price (Strikethrough) */}
          {isOnSale && (
            <span className="text-[var(--color-primary)]/40 line-through text-sm">
              <Money data={product.compareAtPriceRange.minVariantPrice} />
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}

/**
 * Quick Add to Cart Button
 * Minimal, slides up on hover
 */
function QuickAddButton({variantId, productTitle}) {
  const lines = [
    {
      merchandiseId: variantId,
      quantity: 1,
    },
  ];

  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher) => {
        const isAdding = fetcher.state !== 'idle';

        return (
          <button
            type="submit"
            disabled={isAdding}
            className="w-full py-3 bg-[var(--color-primary)] text-[var(--color-contrast)] text-xs font-bold uppercase tracking-wider hover:bg-[var(--color-accent)] transition-colors duration-200 disabled:opacity-70 disabled:cursor-wait"
            aria-label={`Add ${productTitle} to cart`}
          >
            {isAdding ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Adding...
              </span>
            ) : (
              'Quick Add'
            )}
          </button>
        );
      }}
    </CartForm>
  );
}
