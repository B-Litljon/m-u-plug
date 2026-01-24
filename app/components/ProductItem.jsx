import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
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
  // We check if the minimum price is lower than the compare-at price
  const isOnSale = product.compareAtPriceRange?.minVariantPrice?.amount > product.priceRange?.minVariantPrice?.amount;
  const isSoldOut = !product.availableForSale;

  return (
    <Link
      className="product-item group relative flex flex-col gap-3"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      {/* 1. IMAGE CONTAINER */}
      <div className="aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-subtle)] border border-[var(--color-border)] relative">
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
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isSoldOut && (
            <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest bg-[var(--color-primary)] text-[var(--color-contrast)] rounded-[var(--radius-sm)]">
              Sold Out
            </span>
          )}
          {isOnSale && !isSoldOut && (
            <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest bg-[var(--color-error)] text-white rounded-[var(--radius-sm)]">
              Sale
            </span>
          )}
        </div>
      </div>

      {/* 3. DETAILS */}
      <div className="flex flex-col gap-1">
        <h4 className="font-bold text-[var(--color-primary)] truncate group-hover:underline underline-offset-4 decoration-1">
          {product.title}
        </h4>
        
        <div className="flex items-center gap-2 text-sm">
          {/* Current Price */}
          <span className="font-medium text-gray-900">
            <Money data={product.priceRange.minVariantPrice} />
          </span>
          
          {/* Compare At Price (Strikethrough) */}
          {isOnSale && (
            <span className="text-gray-500 line-through text-xs">
              <Money data={product.compareAtPriceRange.minVariantPrice} />
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}