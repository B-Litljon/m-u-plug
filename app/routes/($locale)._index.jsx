import {Await, useLoaderData, Link} from 'react-router';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import {BentoGrid, BentoCell} from '~/components/BentoGrid';
import {ProductCard, ProductCardSkeleton} from '~/components/ProductCard';
import {TechSpecs, TechSpecBadge} from '~/components/TechSpecs';

export const meta = () => {
  return [{title: 'M-U-PLUG | Retro Handhelds'}];
};

/**
 * GraphQL Query for Homepage Content
 * Fetches products with all necessary fields for ProductCard display
 */
const HOMEPAGE_CONTENT_QUERY = `#graphql
  query HomepageContent(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(first: 8, sortKey: UPDATED_AT, reverse: true) {
      nodes {
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
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        id
        title
        handle
        image {
          id
          url
          altText
          width
          height
        }
      }
    }
  }
`;

/**
 * Loader - Fetches real data from Shopify Storefront API
 */
export async function loader({context}) {
  const {products, collections} = await context.storefront.query(
    HOMEPAGE_CONTENT_QUERY,
    {
      variables: {
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      },
    }
  );

  return {
    products: products?.nodes || [],
    featuredCollection: collections?.nodes?.[0] || null,
  };
}

/**
 * Helper: Extract badge from product tags
 * Looks for specific badge keywords in tags
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
 * Helper: Extract tech specs from product tags
 * Looks for tags that look like specs (contain colons or specific keywords)
 */
function getSpecsFromTags(tags) {
  if (!tags || tags.length === 0) return null;
  
  const specs = {};
  const specKeywords = ['screen', 'cpu', 'ram', 'storage', 'battery', 'display'];
  
  tags.forEach(tag => {
    // Check if tag contains colon (KEY: VALUE format)
    if (tag.includes(':')) {
      const [key, value] = tag.split(':').map(s => s.trim());
      if (key && value) {
        specs[key.toUpperCase()] = value;
      }
    }
    // Check if tag starts with spec keyword
    else {
      const lowerTag = tag.toLowerCase();
      specKeywords.forEach(keyword => {
        if (lowerTag.includes(keyword)) {
          const key = keyword.toUpperCase();
          // Extract value after keyword (e.g., "Screen 3.5 inch" -> "3.5 inch")
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

export default function Homepage() {
  const {products, featuredCollection} = useLoaderData();
  
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <HeroSection collection={featuredCollection} />
      <CommandBar />
      <FeaturedProducts products={products} />
      <CategoryBlocks />
    </div>
  );
}

/**
 * HERO SECTION - Neo-Brutalist Command Center
 */
function HeroSection({collection}) {
  const image = collection?.image;
  
  return (
    <section className="border-b-4 border-[var(--color-fg-primary)]">
      <div className="max-w-[var(--grid-max-width)] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-[1px] bg-[var(--color-border-primary)]">
          
          {/* Feature Block - 2x2 */}
          <div className="md:col-span-2 md:row-span-2 bg-[var(--color-bg-secondary)] p-6 md:p-10 flex flex-col justify-between min-h-[500px] md:min-h-[700px]">
            <div>
              <p className="font-[var(--font-mono)] text-xs uppercase tracking-[0.3em] text-[var(--color-accent-cyan)] mb-4">
                Hardware Premium // 2025
              </p>
              <h1 className="font-[var(--font-display)] text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tighter text-[var(--color-fg-primary)] leading-[0.85]">
                Retro
                <br />
                <span className="text-[var(--color-accent-cyan)]">Handhelds</span>
              </h1>
            </div>
            
            <div className="mt-8">
              <p className="font-[var(--font-mono)] text-sm uppercase tracking-wider text-[var(--color-fg-secondary)] mb-6 max-w-md">
                Authentic gaming hardware. Contemporary performance. 
                Built for collectors who demand excellence.
              </p>
              <Link
                to={collection ? `/collections/${collection.handle}` : '/collections/all'}
                className="inline-block bg-[var(--color-fg-primary)] text-[var(--color-bg-primary)] border-2 border-[var(--color-fg-primary)] px-8 py-4 font-[var(--font-display)] text-sm font-bold uppercase tracking-widest shadow-[4px_4px_0px_0px_var(--color-accent-lime)] hover:shadow-[2px_2px_0px_0px_var(--color-accent-lime)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all"
              >
                Shop Collection
              </Link>
            </div>
          </div>

          {/* Stats Block 1 */}
          <div className="bg-[var(--color-bg-secondary)] p-6 md:p-8 flex flex-col justify-center items-center text-center border-b-2 md:border-b-0 border-[var(--color-border-primary)]">
            <span className="font-[var(--font-display)] text-5xl md:text-6xl font-bold text-[var(--color-accent-lime)]">50+</span>
            <span className="font-[var(--font-mono)] text-xs uppercase tracking-[0.2em] text-[var(--color-fg-muted)] mt-2">Models</span>
          </div>

          {/* Stats Block 2 */}
          <div className="bg-[var(--color-bg-secondary)] p-6 md:p-8 flex flex-col justify-center items-center text-center border-b-2 md:border-b-0 border-[var(--color-border-primary)]">
            <span className="font-[var(--font-display)] text-5xl md:text-6xl font-bold text-[var(--color-accent-magenta)]">24h</span>
            <span className="font-[var(--font-mono)] text-xs uppercase tracking-[0.2em] text-[var(--color-fg-muted)] mt-2">Shipping</span>
          </div>

          {/* Spec Badge 1 */}
          <div className="bg-[var(--color-bg-secondary)] p-6 flex items-center justify-center">
            <TechSpecBadge label="Display" value="OLED" color="cyan" />
          </div>

          {/* Spec Badge 2 */}
          <div className="bg-[var(--color-bg-secondary)] p-6 flex items-center justify-center">
            <TechSpecBadge label="Battery" value="4500mAh" color="lime" />
          </div>

          {/* Label Row */}
          <div className="bg-[var(--color-bg-secondary)] px-6 py-4 flex items-center justify-center border-t-2 border-[var(--color-border-primary)]">
            <span className="font-[var(--font-mono)] text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">
              Authentic // Verified // Premium
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * COMMAND BAR - Trust indicators
 */
function CommandBar() {
  const items = [
    { label: 'Global Shipping', code: 'GLB-01' },
    { label: 'Secure Checkout', code: 'SEC-99' },
    { label: '2-Year Warranty', code: 'WAR-24' },
    { label: 'Expert Support', code: 'SUP-88' },
  ];

  return (
    <section className="border-b-2 border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)]">
      <div className="max-w-[var(--grid-max-width)] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[1px] bg-[var(--color-border-primary)]">
          {items.map((item) => (
            <div 
              key={item.code}
              className="bg-[var(--color-bg-secondary)] px-4 md:px-6 py-4 flex items-center justify-between"
            >
              <span className="font-[var(--font-mono)] text-[10px] md:text-xs uppercase tracking-wider text-[var(--color-fg-primary)]">
                {item.label}
              </span>
              <span className="font-[var(--font-mono)] text-[10px] text-[var(--color-fg-muted)]">
                {item.code}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * FEATURED PRODUCTS - Grid using real ProductCard components
 */
function FeaturedProducts({products}) {
  const handleAddToCart = (product) => {
    console.log('Adding to cart:', product.title);
    // Integration with cart logic here
    // Example: 
    // const {addLineItems} = useCart();
    // addLineItems([{ merchandiseId: product.variants.nodes[0].id, quantity: 1 }]);
  };

  // Handle empty state
  if (!products || products.length === 0) {
    return (
      <section className="py-16 md:py-24 bg-[var(--color-bg-primary)]">
        <div className="max-w-[var(--grid-max-width)] mx-auto px-4 md:px-6">
          <div className="border-4 border-[var(--color-fg-primary)] bg-[var(--color-bg-secondary)] p-12 md:p-24 text-center">
            <h2 className="font-[var(--font-display)] text-4xl md:text-6xl font-bold uppercase tracking-tighter text-[var(--color-fg-primary)] mb-6">
              Coming Soon
            </h2>
            <p className="font-[var(--font-mono)] text-sm uppercase tracking-wider text-[var(--color-fg-secondary)] max-w-md mx-auto">
              Our collection is being curated. Check back soon for premium retro handhelds.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-[var(--color-bg-primary)]">
      <div className="max-w-[var(--grid-max-width)] mx-auto px-4 md:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 border-b-4 border-[var(--color-fg-primary)] pb-6">
          <div>
            <p className="font-[var(--font-mono)] text-xs uppercase tracking-[0.3em] text-[var(--color-accent-cyan)] mb-2">
              Featured
            </p>
            <h2 className="font-[var(--font-display)] text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tighter text-[var(--color-fg-primary)]">
              New Arrivals
            </h2>
          </div>
          <Link 
            to="/collections/all"
            className="mt-4 md:mt-0 font-[var(--font-mono)] text-xs uppercase tracking-widest text-[var(--color-fg-secondary)] hover:text-[var(--color-accent-lime)] transition-colors border-b-2 border-current pb-1"
          >
            View All Products &rarr;
          </Link>
        </div>

        {/* Product Grid - Bento Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[2px] bg-[var(--color-fg-primary)] border-4 border-[var(--color-fg-primary)]">
          
          {/* Featured Product - 2x2 Cell (First Product) */}
          {products[0] && (
            <div className="md:col-span-2 md:row-span-2 bg-[var(--color-bg-secondary)]">
              <ProductCard 
                product={{
                  ...products[0],
                  specs: getSpecsFromTags(products[0].tags),
                }}
                variant="featured"
                badge={getBadgeFromTags(products[0].tags)}
                onAddToCart={handleAddToCart}
              />
            </div>
          )}

          {/* Standard Products (Next 4) */}
          {products.slice(1, 5).map((product) => (
            <div key={product.id} className="bg-[var(--color-bg-secondary)]">
              <ProductCard 
                product={{
                  ...product,
                  specs: getSpecsFromTags(product.tags),
                }}
                variant="standard"
                badge={getBadgeFromTags(product.tags)}
                onAddToCart={handleAddToCart}
              />
            </div>
          ))}

          {/* Bottom Row Products (Next 4 or remaining) */}
          {products.slice(5, 9).map((product) => (
            <div key={product.id} className="bg-[var(--color-bg-secondary)]">
              <ProductCard 
                product={{
                  ...product,
                  specs: getSpecsFromTags(product.tags),
                }}
                variant="standard"
                badge={getBadgeFromTags(product.tags)}
                onAddToCart={handleAddToCart}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * CATEGORY BLOCKS - Visual category navigation
 */
function CategoryBlocks() {
  const categories = [
    { name: 'Handhelds', code: 'CAT-001', color: 'var(--color-accent-cyan)', count: '50+' },
    { name: 'Accessories', code: 'CAT-002', color: 'var(--color-accent-magenta)', count: '24' },
    { name: 'Parts', code: 'CAT-003', color: 'var(--color-accent-lime)', count: '18' },
    { name: 'Limited', code: 'CAT-004', color: 'var(--color-accent-amber)', count: '6' },
  ];

  return (
    <section className="border-t-4 border-[var(--color-fg-primary)] bg-[var(--color-bg-secondary)]">
      <div className="max-w-[var(--grid-max-width)] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-[var(--color-border-primary)]">
          {categories.map((cat) => (
            <Link
              key={cat.code}
              to="/collections/all"
              className="group bg-[var(--color-bg-secondary)] p-8 md:p-12 hover:bg-[var(--color-bg-tertiary)] transition-colors"
            >
              <div className="flex flex-col h-full justify-between min-h-[200px]">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span 
                      className="font-[var(--font-mono)] text-xs uppercase tracking-widest px-2 py-1 border-2"
                      style={{ 
                        color: cat.color,
                        borderColor: cat.color,
                      }}
                    >
                      {cat.code}
                    </span>
                    <span 
                      className="font-[var(--font-mono)] text-xs font-bold"
                      style={{ color: cat.color }}
                    >
                      {cat.count}
                    </span>
                  </div>
                  <h3 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold uppercase tracking-tight text-[var(--color-fg-primary)] group-hover:translate-x-2 transition-transform">
                    {cat.name}
                  </h3>
                </div>
                <div className="mt-6 flex items-center gap-2">
                  <span className="font-[var(--font-mono)] text-xs uppercase tracking-wider text-[var(--color-fg-muted)] group-hover:text-[var(--color-fg-primary)] transition-colors">
                    Explore
                  </span>
                  <span className="text-[var(--color-fg-primary)] group-hover:translate-x-1 transition-transform">
                    &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// Keep compatibility with existing queries if referenced elsewhere
const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
`;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
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
  query RecommendedProducts($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 8, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
`;
