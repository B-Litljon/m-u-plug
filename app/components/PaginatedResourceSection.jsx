import {Pagination} from '@shopify/hydrogen';

/**
 * PaginatedResourceSection - Neo-Brutalist Pagination Wrapper
 * Used by other routes that need pagination
 * 
 * @param {Object} props
 * @param {Object} props.connection - Connection object with nodes and pageInfo
 * @param {React.ReactNode} props.children - Render prop for items
 * @param {string} [props.resourcesClassName] - Classes for the grid container
 */
export function PaginatedResourceSection({
  connection,
  children,
  resourcesClassName,
}) {
  return (
    <Pagination connection={connection}>
      {({nodes, isLoading, PreviousLink, NextLink}) => {
        const resourcesMarkup = nodes.map((node, index) =>
          children({node, index}),
        );

        return (
          <div className="space-y-8">
            {/* Previous Button */}
            <div className="flex justify-center">
              <PreviousLink>
                <button
                  disabled={!connection.pageInfo?.hasPreviousPage || isLoading}
                  className={`
                    font-[var(--font-mono)] text-sm font-bold uppercase tracking-widest
                    px-6 py-3 border-2 transition-all duration-150
                    ${!connection.pageInfo?.hasPreviousPage || isLoading
                      ? 'bg-[var(--color-bg-tertiary)] text-[var(--color-fg-muted)] border-[var(--color-border-primary)] opacity-50 cursor-not-allowed' 
                      : 'bg-[var(--color-fg-primary)] text-[var(--color-bg-primary)] border-[var(--color-fg-primary)] hover:bg-[var(--color-bg-primary)] hover:text-[var(--color-fg-primary)]'
                    }
                  `}
                >
                  {isLoading ? 'LOADING...' : <span>&larr; PREVIOUS</span>}
                </button>
              </PreviousLink>
            </div>

            {/* Items Grid */}
            {resourcesClassName ? (
              <div className={resourcesClassName}>{resourcesMarkup}</div>
            ) : (
              resourcesMarkup
            )}

            {/* Next Button */}
            <div className="flex justify-center">
              <NextLink>
                <button
                  disabled={!connection.pageInfo?.hasNextPage || isLoading}
                  className={`
                    font-[var(--font-mono)] text-sm font-bold uppercase tracking-widest
                    px-6 py-3 border-2 transition-all duration-150
                    ${!connection.pageInfo?.hasNextPage || isLoading
                      ? 'bg-[var(--color-bg-tertiary)] text-[var(--color-fg-muted)] border-[var(--color-border-primary)] opacity-50 cursor-not-allowed' 
                      : 'bg-[var(--color-fg-primary)] text-[var(--color-bg-primary)] border-[var(--color-fg-primary)] hover:bg-[var(--color-bg-primary)] hover:text-[var(--color-fg-primary)]'
                    }
                  `}
                >
                  {isLoading ? 'LOADING...' : <span>NEXT &rarr;</span>}
                </button>
              </NextLink>
            </div>
          </div>
        );
      }}
    </Pagination>
  );
}
