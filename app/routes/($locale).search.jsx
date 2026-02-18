import {useLoaderData, Link, Form} from 'react-router';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {Pagination} from '~/components/Pagination';
import {ProductCard} from '~/components/ProductCard';
import {useRef, useEffect} from 'react';

/**
 * Helper: Extract tech specs from product tags
 */
function getSpecsFromTags(tags) {
  if (!tags || tags.length === 0) return null;
  
  const specs = {};
  const specKeywords = ['screen', 'cpu', 'ram', 'storage', 'battery', 'display'];
  
  tags.forEach(tag => {
    if (tag.includes(':')) {
      const [key, value] = tag.split(':').map(s => s.trim());
      if (key && value) {
        specs[key.toUpperCase()] = value;
      }
    } else {
      const lowerTag = tag.toLowerCase();
      specKeywords.forEach(keyword => {
        if (lowerTag.includes(keyword)) {
          const key = keyword.toUpperCase();
          const value = tag.replace(new RegExp(keyword, 'i'), '').trim();
          if (value) {
            specs[key] = value;
          }
        }
      });
    }
  });
  
  return Object.keys(specs).length > 0 ? specs : null;
}

/**
 * Helper: Extract badge from tags
 */
function getBadgeFromTags(tags) {
  if (!tags || tags.length === 0) return null;
  
  const badgeMap = {
    'new': 'NEW',
    'restock': 'RESTOCK',
    'sale': 'SALE',
    'sold out': 'SOLD OUT',
    'limited': 'LIMITED',
  };
  
  const tag = tags.find(t => badgeMap[t.toLowerCase()]);
  return tag ? badgeMap[tag.toLowerCase()] : null;
}

/**
 * Meta tags for search page
 */
export const meta = ({data}) => {
  const term = data?.term || '';
  return [
    {title: term ? `Search: ${term} | M-U-PLUG` : 'Search | M-U-PLUG'},
  ];
};

/**
 * Loader - Handles search queries
 */
export async function loader({request, context}) {
  const {storefront} = context;
  const url = new URL(request.url);
  const term = url.searchParams.get('q') || '';
  
  // Don't search if no term provided
  if (!term.trim()) {
    return {term: '', result: null, products: {nodes: [], pageInfo: {}}};
  }

  const variables = getPaginationVariables(request, {pageBy: 24});

  const {products} = await storefront.query(SEARCH_QUERY, {
    variables: {
      ...variables,
      term,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  return {
    term,
    products: products || {nodes: [], pageInfo: {}},
    total: products?.nodes?.length || 0,
  };
}

/**
 * Search Page - Neo-Brutalist Layout
 */
export default function SearchPage() {
  const {term, products, total} = useLoaderData();
  const inputRef = useRef(null);

  // Focus input on mount if no search term
  useEffect(() => {
    if (!term && inputRef.current) {
      inputRef.current.focus();
    }
  }, [term]);

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      {/* Breadcrumb */}
      <div className="border-b-2 border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)]">
        <div className="max-w-[var(--grid-max-width)] mx-auto px-4 md:px-6 py-4">
          <nav className="flex items-center gap-2 font-[var(--font-mono)] text-xs uppercase tracking-wider">
            <Link to="/" className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg-primary)] transition-colors">
              Home
            </Link>
            <span className="text-[var(--color-fg-muted)]">/</span>
            <span className="text-[var(--color-fg-primary)]">Search</span>
          </nav>
        </div>
      </div>

      {/* Search Header with Massive Input */}
      <header className="border-b-4 border-[var(--color-fg-primary)] bg-[var(--color-bg-secondary)]">
        <div className="max-w-[var(--grid-max-width)] mx-auto px-4 md:px-6 py-12 md:py-16">
          <h1 className="font-[var(--font-display)] text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tighter text-[var(--color-fg-primary)] mb-8">
            SEARCH
          </h1>
          
          {/* Massive Search Input */}
          <Form method="get" action="/search" className="relative">
            <input
              ref={inputRef}
              defaultValue={term}
              name="q"
              placeholder="ENTER QUERY..."
              type="search"
              autoComplete="off"
              className="
                w-full 
                bg-[var(--color-bg-primary)] 
                border-b-4 border-[var(--color-fg-primary)]
                text-2xl md:text-4xl 
                font-[var(--font-display)] font-bold uppercase
                text-[var(--color-fg-primary)]
                placeholder:text-[var(--color-fg-muted)]
                py-4 
                pr-32
                focus:outline-none 
                focus:bg-[var(--color-accent-lime)]/10
                transition-colors
              "
            />
            <button
              type="submit"
              className="
                absolute 
                right-0 
                top-1/2 
                -translate-y-1/2
                bg-[var(--color-fg-primary)] 
                text-[var(--color-bg-primary)] 
                border-2 border-[var(--color-fg-primary)]
                px-6 md:px-8 
                py-3
                font-[var(--font-mono)] text-sm font-bold uppercase tracking-widest
                hover:bg-[var(--color-accent-lime)] hover:border-[var(--color-accent-lime)] hover:text-[var(--color-bg-primary)]
                transition-colors
              "
            >
              SEARCH
            </button>
          </Form>

          {/* Search Tips */}
          <p className="font-[var(--font-mono)] text-xs text-[var(--color-fg-muted)] mt-4 uppercase tracking-wider">
            Try: "Miyoo", "Anbernic", "Retro Handheld", "OLED"
          </p>
        </div>
      </header>

      {/* Search Results */}
      <section className="py-12 md:py-16">
        <div className="max-w-[var(--grid-max-width)] mx-auto px-4 md:px-6">
          
          {/* Results Header */}
          {term && (
            <div className="mb-8 border-b-2 border-[var(--color-border-primary)] pb-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <span className="font-[var(--font-mono)] text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">
                    Results for
                  </span>
                  <h2 className="font-[var(--font-display)] text-2xl md:text-3xl font-bold uppercase tracking-tight text-[var(--color-fg-primary)] mt-1">
                    &ldquo;{term}&rdquo;
                  </h2>
                </div>
                {total > 0 && (
                  <span className="font-[var(--font-mono)] text-xs uppercase tracking-widest text-[var(--color-accent-cyan)] border border-[var(--color-accent-cyan)] px-3 py-1">
                    {total} ITEMS FOUND
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Products Grid */}
          {term ? (
            products?.nodes?.length > 0 ? (
              <Pagination 
                connection={products}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[2px] bg-[var(--color-fg-primary)] border-4 border-[var(--color-fg-primary)]"
              >
                {({node: product}) => (
                  <div className="bg-[var(--color-bg-secondary)]">
                    <ProductCard
                      product={{
                        ...product,
                        specs: getSpecsFromTags(product.tags),
                      }}
                      variant="standard"
                      badge={getBadgeFromTags(product.tags)}
                    />
                  </div>
                )}
              </Pagination>
            ) : (
              <SearchEmpty term={term} />
            )
          ) : (
            <SearchPrompt />
          )}
        </div>
      </section>

      <Analytics.SearchView 
        data={{
          searchTerm: term, 
          searchResults: products
        }} 
      />
    </div>
  );
}

/**
 * SearchEmpty - Neo-Brutalist No Results State
 */
function SearchEmpty({term}) {
  return (
    <div className="border-4 border-[var(--color-fg-primary)] bg-[var(--color-bg-secondary)] p-12 md:p-24 text-center">
      <div className="mb-6">
        <svg 
          className="w-16 h-16 mx-auto text-[var(--color-fg-muted)]" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="square" 
            strokeLinejoin="miter" 
            strokeWidth={1.5} 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
      </div>
      <h2 className="font-[var(--font-display)] text-3xl md:text-5xl font-bold uppercase tracking-tighter text-[var(--color-fg-primary)] mb-2">
        NO SIGNAL
      </h2>
      <p className="font-[var(--font-mono)] text-sm uppercase tracking-[0.3em] text-[var(--color-fg-muted)] mb-6">
        // TRY AGAIN
      </p>
      <p className="font-[var(--font-mono)] text-xs uppercase tracking-wider text-[var(--color-fg-muted)] max-w-md mx-auto">
        No products found matching &ldquo;{term}&rdquo;. Try a different search term or browse our collections.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/collections/all"
          className="inline-block bg-[var(--color-fg-primary)] text-[var(--color-bg-primary)] border-2 border-[var(--color-fg-primary)] px-8 py-3 font-[var(--font-mono)] text-xs font-bold uppercase tracking-widest hover:bg-[var(--color-accent-lime)] hover:border-[var(--color-accent-lime)] transition-colors"
        >
          BROWSE ALL
        </Link>
        <Link
          to="/"
          className="inline-block bg-transparent text-[var(--color-fg-primary)] border-2 border-[var(--color-fg-primary)] px-8 py-3 font-[var(--font-mono)] text-xs font-bold uppercase tracking-widest hover:bg-[var(--color-fg-primary)] hover:text-[var(--color-bg-primary)] transition-colors"
        >
          GO HOME
        </Link>
      </div>
    </div>
  );
}

/**
 * SearchPrompt - Initial state when no search term
 */
function SearchPrompt() {
  return (
    <div className="border-4 border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] p-12 md:p-24 text-center">
      <h2 className="font-[var(--font-display)] text-2xl md:text-4xl font-bold uppercase tracking-tighter text-[var(--color-fg-primary)] mb-4">
        READY TO SEARCH
      </h2>
      <p className="font-[var(--font-mono)] text-sm uppercase tracking-wider text-[var(--color-fg-muted)] max-w-md mx-auto">
        Enter a search term above to find products in our catalog.
      </p>
    </div>
  );
}

/**
 * GraphQL Search Query
 */
const SEARCH_QUERY = `#graphql
  query SearchProducts(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $term: String!
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    products: search(
      after: $endCursor,
      before: $startCursor,
      first: $first,
      last: $last,
      query: $term,
      sortKey: RELEVANCE,
      types: [PRODUCT],
      unavailableProducts: HIDE,
    ) {
      nodes {
        ...on Product {
          id
          title
          handle
          availableForSale
          tags
          featuredImage {
            id
            url
            altText
            width
            height
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          compareAtPriceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          variants(first: 1) {
            nodes {
              id
              availableForSale
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
