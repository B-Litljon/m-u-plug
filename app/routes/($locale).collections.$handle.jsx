import {redirect, useLoaderData, Link} from 'react-router';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {Pagination} from '~/components/Pagination';
import {ProductCard, ProductCardSkeleton} from '~/components/ProductCard';

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
 * SEO Meta Function - Collection Page
 * Format: "Collection Name // ARCHIVE | M-U-PLUG"
 */
export const meta = ({data}) => {
  const collection = data?.collection;
  
  if (!collection) {
    return [
      {title: 'Collection Not Found | M-U-PLUG'},
      {name: 'description', content: 'The requested collection could not be found.'},
    ];
  }

  const title = collection.title;
  const description = collection.description?.substring(0, 160) || 
    `Browse ${title} at M-U-PLUG. Premium retro gaming hardware and accessories.`;
  const image = collection.image?.url;
  
  const metaTitle = `${title} // ARCHIVE | M-U-PLUG`;

  return [
    {title: metaTitle},
    {name: 'description', content: description},
    {property: 'og:title', content: title},
    {property: 'og:description', content: description},
    {property: 'og:type', content: 'product.group'},
    {property: 'og:site_name', content: 'M-U-PLUG'},
    ...(image ? [{property: 'og:image', content: image}] : []),
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:title', content: title},
    {name: 'twitter:description', content: description},
    ...(image ? [{name: 'twitter:image', content: image}] : []),
  ];
};

/**
 * Loader - Fetches collection data with pagination
 */
export async function loader({context, params, request}) {
  const {handle} = params;
  const {storefront} = context;
  
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 24,
  });

  if (!handle) {
    throw redirect('/collections/all');
  }

  const {collection} = await storefront.query(COLLECTION_QUERY, {
    variables: {
      handle,
      ...paginationVariables,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  return {
    collection,
  };
}

/**
 * Collection Page - Neo-Brutalist Layout
 */
export default function Collection() {
  const {collection} = useLoaderData();
  const {title, description, products} = collection;

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
            <span className="text-[var(--color-fg-primary)]">{title}</span>
          </nav>
        </div>
      </div>

      {/* Collection Header */}
      <header className="border-b-4 border-[var(--color-fg-primary)] bg-[var(--color-bg-secondary)]">
        <div className="max-w-[var(--grid-max-width)] mx-auto px-4 md:px-6 py-12 md:py-20">
          <h1 className="font-[var(--font-display)] text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tighter text-[var(--color-fg-primary)] leading-[0.9] mb-6">
            {title}
          </h1>
          
          {description && (
            <p className="font-[var(--font-mono)] text-sm md:text-base text-[var(--color-fg-secondary)] max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
          
          {/* Product Count */}
          <div className="mt-6 flex items-center gap-2">
            <span className="font-[var(--font-mono)] text-xs uppercase tracking-widest text-[var(--color-accent-cyan)] border border-[var(--color-accent-cyan)] px-2 py-1">
              {products.nodes.length} ITEMS
            </span>
            {products.pageInfo?.hasNextPage && (
              <span className="font-[var(--font-mono)] text-xs uppercase tracking-wider text-[var(--color-fg-muted)]">
                + MORE
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Products Grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-[var(--grid-max-width)] mx-auto px-4 md:px-6">
          {products.nodes.length > 0 ? (
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
            <CollectionEmpty />
          )}
        </div>
      </section>

      {/* Analytics - Collection View */}
      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </div>
  );
}

/**
 * CollectionEmpty - Neo-Brutalist Empty State
 */
function CollectionEmpty() {
  return (
    <div className="border-4 border-[var(--color-fg-primary)] bg-[var(--color-bg-secondary)] p-12 md:p-24 text-center">
      <h2 className="font-[var(--font-display)] text-4xl md:text-6xl font-bold uppercase tracking-tighter text-[var(--color-fg-primary)] mb-4">
        VOID
      </h2>
      <p className="font-[var(--font-mono)] text-sm uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">
        // NULL SET
      </p>
      <p className="font-[var(--font-mono)] text-xs uppercase tracking-wider text-[var(--color-fg-muted)] mt-6 max-w-md mx-auto">
        This collection contains no products. Check back later.
      </p>
    </div>
  );
}

/**
 * GraphQL Fragments and Query
 */
const PRODUCT_CARD_FRAGMENT = `#graphql
  fragment ProductCardItem on Product {
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
`;

const COLLECTION_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      image {
        url
        altText
      }
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductCardItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
