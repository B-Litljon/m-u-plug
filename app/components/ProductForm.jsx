import {Link} from 'react-router';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';

/**
 * @param {{
 * productOptions: MappedProductOptions[];
 * selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
 * }}
 */
export function ProductForm({productOptions, selectedVariant}) {
  const {open} = useAside();

  return (
    <div className="product-form space-y-6">
      {productOptions.map((option) => {
        // If there is only one option value, don't display the selector (cleaner UI)
        if (option.optionValues.length === 1) return null;

        return (
          <div className="product-options" key={option.name}>
            <h5 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-3">
              {option.name}
            </h5>

            <div className="flex flex-wrap gap-3">
              {option.optionValues.map((value) => {
                const {name, variantUriQuery, selected, exists, swatch} = value;

                // STYLE LOGIC: Is this a Color Swatch or a Text Pill?
                const isColor =
                  option.name.toLowerCase().includes('color') || !!swatch;

                // BASE CLASSES
                const baseClasses = `
                  relative flex items-center justify-center cursor-pointer transition-all duration-200
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2
                  ${!exists ? 'opacity-30 cursor-not-allowed decoration-slice' : ''}
                `;

                // SWATCH STYLING (Circles)
                const swatchClasses = `
                  w-10 h-10 rounded-full border-2
                  ${
                    selected
                      ? 'border-[var(--color-primary)] ring-1 ring-[var(--color-primary)] ring-offset-2'
                      : 'border-transparent hover:border-[var(--color-border)]'
                  }
                `;

                // PILL STYLING (Rectangles)
                const pillClasses = `
                  px-4 py-2 min-w-[3rem] text-sm font-medium rounded-[var(--radius-sm)] border
                  ${
                    selected
                      ? 'bg-[var(--color-primary)] text-[var(--color-contrast)] border-[var(--color-primary)]'
                      : 'bg-[var(--color-contrast)] text-[var(--color-primary)] border-[var(--color-border)] hover:border-[var(--color-primary)]'
                  }
                `;

                const finalClass = `${baseClasses} ${
                  isColor ? swatchClasses : pillClasses
                }`;

                // RENDER LOGIC: Link (SEO) vs Button (UX)
                // We use Links for everything to ensure fast pre-fetching and SEO friendly URLs
                return (
                  <Link
                    key={option.name + name}
                    to={`?${variantUriQuery}`}
                    preventScrollReset
                    replace
                    prefetch="intent"
                    className={finalClass}
                    title={`${option.name}: ${name}`}
                    onClick={(e) => {
                      if (!exists) e.preventDefault();
                    }}
                  >
                    {isColor ? (
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    ) : (
                      name
                    )}

                    {/* Strike-through for unavailable items if you want it */}
                    {!exists && (
                      <div className="absolute inset-0 bg-white/50 w-[1px] h-full rotate-45 mx-auto top-0 left-0" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="pt-4">
        <AddToCartButton
          disabled={!selectedVariant || !selectedVariant.availableForSale}
          onClick={() => {
            open('cart');
          }}
          lines={
            selectedVariant
              ? [
                  {
                    merchandiseId: selectedVariant.id,
                    quantity: 1,
                    selectedVariant,
                  },
                ]
              : []
          }
        >
          {selectedVariant?.availableForSale ? 'Add to Cart' : 'Sold Out'}
        </AddToCartButton>
      </div>
    </div>
  );
}

/**
 * Renders the inside of a Swatch (Color or Image)
 */
function ProductOptionSwatch({swatch, name}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  // Fallback: If no swatch data, try to use the name as a color (e.g. "Red")
  // or just return the text if it's not a color name.
  const canUseCssColor =
    typeof CSS !== 'undefined' && typeof CSS.supports === 'function';
  const backgroundStyle =
    color || (canUseCssColor && CSS.supports('color', name) ? name : '#eee');

  return (
    <div
      aria-label={name}
      className="w-full h-full rounded-full overflow-hidden relative shadow-sm"
      style={{
        backgroundColor: image ? 'transparent' : backgroundStyle,
      }}
    >
      {!!image && (
        <img src={image} alt={name} className="w-full h-full object-cover" />
      )}
      {/* Tooltip on hover could go here */}
    </div>
  );
}
