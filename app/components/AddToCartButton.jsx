import {CartForm} from '@shopify/hydrogen';

/**
 * Premium Add to Cart Button
 * Full-width CTA with loading state and disabled styling
 * @param {{
 *   analytics?: unknown;
 *   children: React.ReactNode;
 *   disabled?: boolean;
 *   lines: Array<OptimisticCartLineInput>;
 *   onClick?: () => void;
 *   variant?: 'primary' | 'secondary';
 * }}
 */
export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
  variant = 'primary',
}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher) => {
        const isAdding = fetcher.state !== 'idle';
        const isDisabled = disabled ?? isAdding;

        // Base classes
        const baseClasses = `
          w-full py-4 px-6 
          font-bold text-sm uppercase tracking-wider
          rounded-[var(--radius-sm)]
          transition-all duration-200
          flex items-center justify-center gap-2
          disabled:cursor-not-allowed
        `;

        // Variant-specific classes
        const variantClasses = {
          primary: `
            bg-[var(--color-primary)] text-[var(--color-contrast)]
            hover:bg-[var(--color-accent)]
            disabled:bg-[var(--color-border)] disabled:text-[var(--color-primary)]/40
          `,
          secondary: `
            bg-transparent text-[var(--color-primary)]
            border-2 border-[var(--color-primary)]
            hover:bg-[var(--color-primary)] hover:text-[var(--color-contrast)]
            disabled:border-[var(--color-border)] disabled:text-[var(--color-primary)]/40
          `,
        };

        return (
          <>
            <input
              name="analytics"
              type="hidden"
              value={JSON.stringify(analytics)}
            />
            <button
              type="submit"
              onClick={onClick}
              disabled={isDisabled}
              className={`${baseClasses} ${variantClasses[variant]}`}
            >
              {isAdding ? (
                <>
                  <LoadingSpinner />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  {!disabled && <CartIcon />}
                  <span>{children}</span>
                </>
              )}
            </button>
          </>
        );
      }}
    </CartForm>
  );
}

/**
 * Loading Spinner
 */
function LoadingSpinner() {
  return (
    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
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
  );
}

/**
 * Cart Icon
 */
function CartIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  );
}

/** @typedef {import('react-router').FetcherWithComponents} FetcherWithComponents */
/** @typedef {import('@shopify/hydrogen').OptimisticCartLineInput} OptimisticCartLineInput */
