import {Await, useLoaderData, Link} from 'react-router';
import {Suspense} from 'react';
import {Image} from '@shopify/hydrogen';
import {ProductItem} from '~/components/ProductItem';
import heroImage from '~/assets/hero-memory.jpg';

export const meta = () => {
  return [{title: 'Hydrogen | Home'}];
};

export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context}) {
  const [{collections}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
  ]);

  return {
    featuredCollection: collections.nodes[0],
  };
}

function loadDeferredData({context}) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();
  return (
    <div className="home">
      <HeroSection collection={data.featuredCollection} />
      <TrustBar />
      <RecommendedProducts products={data.recommendedProducts} />
    </div>
  );
}

/**
 * 1. THE HERO: Immersive & Authoritative
 */
function HeroSection({collection}) {
  if (!collection) return null;

  return (
    <div className="relative h-[85vh] w-full overflow-hidden bg-black">
      {/* The Asset 
        Using standard <img> because this is a static local asset, not a Storefront API object.
      */}
      <img
        src={heroImage}
        alt="A glowing scene of childhood gaming memories held in the palm of a hand"
        className="absolute inset-0 h-full w-full object-cover object-center opacity-90"
      />
      
      {/* The Overlay 
        A subtle gradient from the top-left to ensure text readability 
        without obscuring the hand/child in the center/right.
      */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-transparent to-transparent" />

      {/* The Content 
        Positioned Top-Left to balance against the Hand (Bottom/Right).
      */}
      <div className="absolute inset-0 flex flex-col items-start justify-center px-8 md:px-16 lg:px-24 pb-20">
        <div className="max-w-xl space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1] drop-shadow-2xl">
            Your childhood memories, <br />
            <span className="text-[var(--color-subtle)] bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              in the palm of your hand.
            </span>
          </h1>
          
          <div className="flex gap-4">
            <Link
              to={`/collections/${collection.handle}`}
              className="px-10 py-4 bg-white text-black font-bold text-lg rounded-[var(--radius-sm)] hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              Shop Handhelds
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 2. THE TRUST BAR: The "Firm Handshake" of the Homepage
 */
function TrustBar() {
  const items = [
    { title: 'Secure Checkout', text: 'Encrypted payments' },
    { title: 'Fast Shipping', text: 'Tracked delivery' },
    { title: 'Quality Guarantee', text: 'Verified authenticity' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 py-12 border-b border-[var(--color-border)] bg-[var(--color-subtle)] text-center">
      {items.map((item) => (
        <div key={item.title} className="space-y-1">
          <h3 className="text-lg font-bold text-[var(--color-primary)] uppercase tracking-wide">
            {item.title}
          </h3>
          <p className="text-gray-500 text-sm">{item.text}</p>
        </div>
      ))}
    </div>
  );
}

/**
 * 3. THE GRID: Clean & Professional
 */
function RecommendedProducts({products}) {
  return (
    <div className="recommended-products py-16 px-4 md:px-8 container mx-auto">
      <div className="flex justify-between items-end mb-8 border-b border-[var(--color-border)] pb-4">
        <h2 className="text-2xl font-bold text-[var(--color-primary)]">New Arrivals</h2>
        <Link to="/collections/all" className="text-sm font-medium underline underline-offset-4 hover:text-[var(--color-accent)]">
          View All &rarr;
        </Link>
      </div>

      <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
              {response
                ? response.products.nodes.map((product) => (
                    <ProductItem key={product.id} product={product} />
                  ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
    </div>
  );
}

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
      featuredImage {
        id
        url
        altText
        width
        height
      }
      variants(first: 1) {
        nodes {
          selectedOptions {
            name
            value
          }
        }
      }
    }
    query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
      @inContext(country: $country, language: $language) {
      products(first: 8, sortKey: UPDATED_AT, reverse: true) {
        nodes {
          ...RecommendedProduct
        }
      }
    }
  `;