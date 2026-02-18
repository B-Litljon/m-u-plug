import {useState} from 'react';
import {Link} from 'react-router';
import {CartForm, Image, Money} from '@shopify/hydrogen';
import {TechSpecs} from './TechSpecs';
import {useAside} from './Aside';

/**
 * ProductCard - Neo-Brutalist Product Display
 * Hard borders, mono fonts, high-contrast action states
 * 
 * @param {Object} props
 * @param {Object} props.product - Product data
 * @param {string} [props.variant='standard'] - 'standard' | 'featured' for 2x2 grid cell
 * @param {string} [props.badge] - 'NEW' | 'RESTOCK' | 'SALE' | null
 */
export function ProductCard({
  product,
  variant = 'standard',
  badge,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const {open} = useAside();

  const isFeatured = variant === 'featured';
  const variantNode = product.variants?.nodes?.[0];

  // Determine if product can be added to cart
  const isAvailable = product.availableForSale && variantNode?.availableForSale;
  const isOutOfStock = !isAvailable;

  // Handle add to cart success - open cart drawer
  const handleAddToCart = () => {
    // Small delay to allow optimistic update to show
    setTimeout(() => {
      open('cart');
    }, 100);
  };

  return (
    <Link
      to={`/products/${product.handle}`}
      className={`group block h-full bg-[var(--color-bg-secondary)] border-2 border-[var(--color-fg-primary)] overflow-hidden transition-all duration-150 ${
        isHovered ? 'translate-x-0 translate-y-0' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Area - 4:3 Aspect Ratio, CRT Style */}
      <div className={`relative border-b-4 border-[var(--color-fg-primary)] overflow-hidden ${
        isFeatured ? 'aspect-[4/3]' : 'aspect-[4/3]'
      }`}>
        {/* CRT Scanline Effect Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-10 bg-[length:100%_4px,6px_100%] pointer-events-none opacity-30" />
        
        {product.featuredImage ? (
          <Image
            data={product.featuredImage}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isHovered ? 'scale-105' : 'scale-100'
            }`}
            sizes={isFeatured ? '50vw' : '25vw'}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[var(--color-bg-tertiary)] to-[var(--color-bg-secondary)] flex items-center justify-center">
            <span className="font-[var(--font-mono)] text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">
              NO SIGNAL
            </span>
          </div>
        )}

        {/* Badge - Absolute Positioned */}
        {badge && !isOutOfStock && (
          <div className={`absolute top-4 left-4 z-20 px-3 py-1 font-[var(--font-mono)] text-xs font-bold uppercase tracking-wider border-2 border-[var(--color-bg-primary)] ${
            badge === 'NEW' 
              ? 'bg-[var(--color-accent-lime)] text-[var(--color-bg-primary)]' 
              : badge === 'RESTOCK'
              ? 'bg-[var(--color-accent-cyan)] text-[var(--color-bg-primary)]'
              : badge === 'SALE'
              ? 'bg-[var(--color-accent-magenta)] text-[var(--color-fg-primary)]'
              : 'bg-[var(--color-fg-primary)] text-[var(--color-bg-primary)]'
          }`}>
            {badge}
          </div>
        )}

        {/* Out of Stock Badge */}
        {isOutOfStock && (
          <div className="absolute top-4 left-4 z-20 px-3 py-1 font-[var(--font-mono)] text-xs font-bold uppercase tracking-wider border-2 border-[var(--color-bg-primary)] bg-[var(--color-fg-muted)] text-[var(--color-bg-primary)]">
            SOLD OUT
          </div>
        )}

        {/* Hover Overlay with Scan Effect */}
        <div className={`absolute inset-0 bg-[var(--color-accent-cyan)]/10 z-10 transition-opacity duration-150 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />
      </div>

      {/* Info Area */}
      <div className={`p-4 ${isFeatured ? 'md:p-6' : ''} bg-[var(--color-bg-secondary)]`}>
        {/* Product Title - Space Grotesk Bold */}
        <h3 className={`font-[var(--font-display)] font-bold uppercase tracking-tight text-[var(--color-fg-primary)] mb-2 line-clamp-2 ${
          isFeatured ? 'text-xl md:text-2xl' : 'text-base md:text-lg'
        }`}>
          {product.title}
        </h3>

        {/* Tech Specs - Mono Font Block */}
        {product.specs && (
          <div className="mb-3">
            <TechSpecs specs={product.specs} size={isFeatured ? 'md' : 'sm'} />
          </div>
        )}

        {/* Price Row */}
        <div className="flex items-baseline gap-3 mb-4">
          <span className={`font-[var(--font-mono)] font-bold text-[var(--color-fg-primary)] ${
            isFeatured ? 'text-2xl md:text-3xl' : 'text-xl'
          }`}>
            <Money data={product.priceRange.minVariantPrice} />
          </span>
          
          {product.compareAtPriceRange?.minVariantPrice?.amount > product.priceRange.minVariantPrice.amount && (
            <span className="font-[var(--font-mono)] text-sm text-[var(--color-fg-muted)] line-through">
              <Money data={product.compareAtPriceRange.minVariantPrice} />
            </span>
          )}
        </div>

        {/* ADD TO CART BUTTON - Using CartForm */}
        {isAvailable && variantNode ? (
          <CartForm
            route="/cart"
            action={CartForm.ACTIONS.LinesAdd}
            inputs={{
              lines: [
                {
                  merchandiseId: variantNode.id,
                  quantity: 1,
                },
              ],
            }}
            onSubmit={handleAddToCart}
          >
            <AddToCartButton 
              isHovered={isHovered} 
              isFeatured={isFeatured}
            />
          </CartForm>
        ) : (
          <button
            disabled
            className={`w-full font-[var(--font-mono)] font-bold uppercase tracking-widest border-2 bg-[var(--color-bg-tertiary)] text-[var(--color-fg-muted)] border-[var(--color-border-primary)] cursor-not-allowed ${
              isFeatured ? 'text-sm py-4' : 'text-xs py-3'
            }`}
          >
            Sold Out
          </button>
        )}
      </div>
    </Link>
  );
}

/**
 * AddToCartButton - Brutalist styled cart button
 */
function AddToCartButton({isHovered, isFeatured}) {
  return (
    <button
      type="submit"
      className={`w-full font-[var(--font-mono)] font-bold uppercase tracking-widest border-2 transition-all duration-150 ${
        isHovered
          ? 'bg-[var(--color-accent-magenta)] text-[var(--color-fg-primary)] border-[var(--color-fg-primary)] shadow-[4px_4px_0px_0px_var(--color-fg-primary)]'
          : 'bg-[var(--color-fg-primary)] text-[var(--color-bg-primary)] border-[var(--color-fg-primary)]'
      } ${
        isFeatured ? 'text-sm py-4' : 'text-xs py-3'
      }`}
    >
      Add to Cart
    </button>
  );
}

/**
 * ProductCardSkeleton - Loading State
 * Matches the card structure for seamless transitions
 */
export function ProductCardSkeleton({variant = 'standard'}) {
  const isFeatured = variant === 'featured';
  
  return (
    <div className={`h-full bg-[var(--color-bg-secondary)] border-2 border-[var(--color-border-primary)] overflow-hidden`}>
      {/* Image Skeleton */}
      <div className={`border-b-4 border-[var(--color-border-primary)] bg-[var(--color-bg-tertiary)] ${
        isFeatured ? 'aspect-[4/3]' : 'aspect-[4/3]'
      }`}>
        <div className="w-full h-full animate-pulse bg-[var(--color-bg-elevated)]" />
      </div>
      
      {/* Info Skeleton */}
      <div className={`p-4 ${isFeatured ? 'md:p-6' : ''}`}>
        <div className={`h-6 bg-[var(--color-bg-tertiary)] rounded-none mb-3 ${
          isFeatured ? 'w-3/4' : 'w-full'
        }`} />
        <div className="h-4 bg-[var(--color-bg-tertiary)] rounded-none w-1/2 mb-4" />
        <div className="h-10 bg-[var(--color-bg-tertiary)] rounded-none w-full" />
      </div>
    </div>
  );
}
