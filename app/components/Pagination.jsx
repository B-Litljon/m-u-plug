import {Pagination as HydrogenPagination} from '@shopify/hydrogen';

/**
 * Pagination - Neo-Brutalist Pagination Component
 * Uses Hydrogen's Pagination with brutalist button styling
 * 
 * @param {Object} props
 * @param {Object} props.connection - Connection object with nodes and pageInfo
 * @param {React.ReactNode} props.children - Render prop for items
 * @param {string} [props.className] - Additional classes for the grid container
 */
export function Pagination({connection, children, className = ''}) {
  return (
    <HydrogenPagination connection={connection}>
      {({nodes, isLoading, PreviousLink, NextLink, state}) => {
        const hasPrevious = state === 'initial' 
          ? connection.pageInfo?.hasPreviousPage 
          : true;
        const hasNext = state === 'initial' 
          ? connection.pageInfo?.hasNextPage 
          : true;

        return (
          <div className="space-y-8">
            {/* Previous Button */}
            <div className="flex justify-center">
              <PreviousLink>
                <PaginationButton 
                  direction="previous" 
                  isLoading={isLoading}
                  disabled={!hasPrevious}
                />
              </PreviousLink>
            </div>

            {/* Items Grid */}
            <div className={className}>
              {nodes.map((node, index) => children({node, index}))}
            </div>

            {/* Next Button */}
            <div className="flex justify-center">
              <NextLink>
                <PaginationButton 
                  direction="next" 
                  isLoading={isLoading}
                  disabled={!hasNext}
                />
              </NextLink>
            </div>
          </div>
        );
      }}
    </HydrogenPagination>
  );
}

/**
 * PaginationButton - Individual pagination button
 * 
 * @param {Object} props
 * @param {'previous' | 'next'} props.direction - Button direction
 * @param {boolean} props.isLoading - Loading state
 * @param {boolean} props.disabled - Disabled state
 */
function PaginationButton({direction, isLoading, disabled}) {
  const isPrevious = direction === 'previous';
  
  return (
    <button
      disabled={disabled || isLoading}
      className={`
        font-[var(--font-mono)] text-sm font-bold uppercase tracking-widest
        px-6 py-3 border-2 transition-all duration-150
        ${disabled 
          ? 'bg-[var(--color-bg-tertiary)] text-[var(--color-fg-muted)] border-[var(--color-border-primary)] opacity-50 cursor-not-allowed' 
          : 'bg-[var(--color-fg-primary)] text-[var(--color-bg-primary)] border-[var(--color-fg-primary)] hover:bg-[var(--color-bg-primary)] hover:text-[var(--color-fg-primary)]'
        }
      `}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <LoadingSpinner />
          LOADING...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          {isPrevious && <span>&larr;</span>}
          {isPrevious ? 'Previous' : 'Next'}
          {!isPrevious && <span>&rarr;</span>}
        </span>
      )}
    </button>
  );
}

/**
 * LoadingSpinner - Simple spinner for loading state
 */
function LoadingSpinner() {
  return (
    <svg 
      className="animate-spin h-4 w-4" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
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
  );
}

/**
 * PaginationInfo - Display current page info (e.g., "Showing 1-24 of 156")
 * 
 * @param {Object} props
 * @param {number} props.currentCount - Number of items currently displayed
 * @param {number} props.totalCount - Total number of items
 * @param {number} props.currentPage - Current page number
 * @param {number} props.perPage - Items per page
 */
export function PaginationInfo({currentCount, totalCount, currentPage, perPage = 24}) {
  const start = (currentPage - 1) * perPage + 1;
  const end = start + currentCount - 1;

  return (
    <div className="font-[var(--font-mono)] text-xs uppercase tracking-wider text-[var(--color-fg-muted)] text-center py-4">
      Showing {start}-{end} of {totalCount}
    </div>
  );
}
