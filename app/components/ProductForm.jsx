import {CartForm} from '@shopify/hydrogen';
import {Link} from 'react-router';
import {useAside} from './Aside';

/**
 * ProductForm - Neo-Brutalist Variant Selector
 * Hard toggle buttons instead of dropdowns
 * 
 * @param {Object} props
 * @param {Array} props.productOptions - Product options from Hydrogen
 * @param {Object} props.selectedVariant - Currently selected variant
 */
export function ProductForm({productOptions, selectedVariant}) {
  const {open} = useAside();

  const isAvailable = selectedVariant?.availableForSale;
  const variantId = selectedVariant?.id;

  const handleAddToCart = () => {
    setTimeout(() => {
      open('cart');
    }, 100);
  };

  return (
    <div className="space-y-6">
      {/* Variant Options - Brutalist Toggles */}
      {productOptions?.map((option) => {
        // If there is only one option value, don't display the selector
        if (option.optionValues.length === 1) return null;

        return (
          <VariantOption
            key={option.name}
            option={option}
          />
        );
      })}

      {/* Price Display */}
      <div className="border-t-2 border-[var(--color-border-primary)] pt-4">
        <div className="flex items-baseline gap-3">
          <span className="font-[var(--font-mono)] text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">
            PRICE
          </span>
          <span className="font-[var(--font-mono)] text-3xl md:text-4xl font-bold text-[var(--color-fg-primary)]">
            {selectedVariant?.price ? (
              <span>${selectedVariant.price.amount}</span>
            ) : (
              <span>-</span>
            )}
          </span>
          {selectedVariant?.compareAtPrice?.amount > selectedVariant?.price?.amount && (
            <span className="font-[var(--font-mono)] text-lg text-[var(--color-fg-muted)] line-through">
              ${selectedVariant.compareAtPrice.amount}
            </span>
          )}
        </div>
      </div>

      {/* Add to Cart Button */}
      {isAvailable && variantId ? (
        <CartForm
          route="/cart"
          action={CartForm.ACTIONS.LinesAdd}
          inputs={{
            lines: [
              {
                merchandiseId: variantId,
                quantity: 1,
              },
            ],
          }}
          onSubmit={handleAddToCart}
        >
          <button
            type="submit"
            className="w-full bg-[var(--color-fg-primary)] text-[var(--color-bg-primary)] border-2 border-[var(--color-fg-primary)] py-4 px-6 font-[var(--font-display)] text-lg font-bold uppercase tracking-widest shadow-[4px_4px_0px_0px_var(--color-accent-lime)] hover:shadow-[2px_2px_0px_0px_var(--color-accent-lime)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all"
          >
            ADD TO CART
          </button>
        </CartForm>
      ) : (
        <button
          disabled
          className="w-full bg-[var(--color-bg-tertiary)] text-[var(--color-fg-muted)] border-2 border-[var(--color-border-primary)] py-4 px-6 font-[var(--font-display)] text-lg font-bold uppercase tracking-widest cursor-not-allowed"
        >
          OUT OF STOCK
        </button>
      )}

      {/* Variant Availability Note */}
      {selectedVariant && (
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 ${isAvailable ? 'bg-[var(--color-accent-lime)]' : 'bg-[var(--color-error)]'}`} />
          <span className="font-[var(--font-mono)] text-xs uppercase tracking-wider text-[var(--color-fg-muted)]">
            {isAvailable ? 'IN STOCK' : 'OUT OF STOCK'} — SKU: {selectedVariant.sku || 'N/A'}
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * VariantOption - Brutalist Toggle Group
 * 
 * @param {Object} props
 * @param {Object} props.option - Product option (name, optionValues)
 */
function VariantOption({option}) {
  const {name, optionValues} = option;

  return (
    <div className="space-y-3">
      {/* Option Label */}
      <div className="flex items-center justify-between">
        <span className="font-[var(--font-mono)] text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">
          {name}
        </span>
        <span className="font-[var(--font-mono)] text-xs text-[var(--color-accent-cyan)]">
          {optionValues.find(v => v.selected)?.name}
        </span>
      </div>

      {/* Option Values - Toggle Buttons */}
      <div className="flex flex-wrap gap-2">
        {optionValues.map((value) => {
          const isSelected = value.selected;
          const isAvailable = !!value.firstSelectableVariant || value.exists;

          return (
            <VariantOptionButton
              key={value.name}
              optionName={name}
              value={value}
              isSelected={isSelected}
              isAvailable={isAvailable}
            />
          );
        })}
      </div>
    </div>
  );
}

/**
 * VariantOptionButton - Individual Toggle Button
 * Uses React Router Link for SEO-friendly URLs with search params
 * 
 * @param {Object} props
 * @param {string} props.optionName - Name of the option
 * @param {Object} props.value - Option value object
 * @param {boolean} props.isSelected - Whether this option is selected
 * @param {boolean} props.isAvailable - Whether this option combination is available
 */
function VariantOptionButton({optionName, value, isSelected, isAvailable}) {
  const {name, variantUriQuery, exists} = value;

  // Determine button styles based on state
  const baseClasses = `
    font-[var(--font-mono)] text-sm font-bold uppercase tracking-wider
    px-4 py-2 border-2 transition-all duration-150
    min-w-[60px] text-center
  `;

  const stateClasses = isSelected
    ? 'bg-[var(--color-fg-primary)] text-[var(--color-bg-primary)] border-[var(--color-fg-primary)]'
    : isAvailable && exists !== false
    ? 'bg-transparent text-[var(--color-fg-primary)] border-[var(--color-fg-primary)] hover:bg-[var(--color-bg-tertiary)]'
    : 'bg-transparent text-[var(--color-fg-muted)] border-[var(--color-border-primary)] opacity-50 line-through cursor-not-allowed';

  // If not available, render as disabled button
  if (!isAvailable || exists === false) {
    return (
      <button
        type="button"
        disabled
        className={`${baseClasses} ${stateClasses}`}
      >
        {name}
      </button>
    );
  }

  // Use Link for available options to update URL
  return (
    <Link
      to={`?${variantUriQuery}`}
      preventScrollReset
      replace
      prefetch="intent"
      className={`${baseClasses} ${stateClasses}`}
      title={`${optionName}: ${name}`}
      aria-pressed={isSelected}
    >
      {name}
    </Link>
  );
}
