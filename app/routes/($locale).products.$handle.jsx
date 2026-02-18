import {useLoaderData} from 'react-router';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductForm} from '~/components/ProductForm';
import {ProductGallery} from '~/components/ProductGallery';
import {TechSpecs, TechSpecBadge} from '~/components/TechSpecs';
import {Link} from 'react-router';

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
 * SEO Meta Function - Product Page
 * Format: "Title // Price | M-U-PLUG"
 */
export const meta = ({data}) => {
  const product = data?.product;
  
  if (!product) {
    return [
      {title: 'Product Not Found | M-U-PLUG'},
      {name: 'description', content: 'The requested product could not be found.'},
    ];
  }

  const title = product.title;
  const price = product.priceRange?.minVariantPrice;
  const priceString = price ? `$${price.amount} ${price.currencyCode}` : '';
  const description = product.description?.substring(0, 160) || 
    `Buy ${title} from M-U-PLUG. Premium retro gaming hardware and accessories.`;
  const image = product.featuredImage?.url;
  
  const metaTitle = priceString 
    ? `${title} // ${priceString} | M-U-PLUG`
    : `${title} | M-U-PLUG`;

  return [
    {title: metaTitle},
    {name: 'description', content: description},
    {property: 'og:title', content: title},
    {property: 'og:description', content: description},
    {property: 'og:type', content: 'product'},
    {property: 'og:site_name', content: 'M-U-PLUG'},
    ...(image ? [{property: 'og:image', content: image}] : []),
    {property: 'product:price:amount', content: price?.amount || '0'},
    {property: 'product:price:currency', content: price?.currencyCode || 'USD'},
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:title', content: title},
    {name: 'twitter:description', content: description},
    ...(image ? [{name: 'twitter:image', content: image}] : []),
  ];
};

/**
 * Loader - Fetches product data with all necessary fields
 */
export async function loader({context, params, request}) {
  const {handle} = params;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const {storefront} = context;

  const {product} = await storefront.query(PRODUCT_QUERY, {
    variables: {
      handle,
      selectedOptions: getSelectedProductOptions(request),
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  return {product};
}

/**
 * Product Detail Page - Neo-Brutalist Layout
 * 2-column grid on desktop, stacked on mobile
 */
export default function Product() {
  const {product} = useLoaderData();

  // Optimistically selects a variant
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // Sets the search param to the selected variant
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  // Extract specs from tags
  const specs = getSpecsFromTags(product.tags);

  const {title, descriptionHtml, vendor, tags, images} = product;

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
            <Link to="/collections/all" className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg-primary)] transition-colors">
              Shop
            </Link>
            <span className="text-[var(--color-fg-muted)]">/</span>
            <span className="text-[var(--color-fg-primary)] truncate">{title}</span>
          </nav>
        </div>
      </div>

      {/* Main Product Grid */}
      <div className="max-w-[var(--grid-max-width)] mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          
          {/* Left Column - Gallery */}
          <div className="order-1">
            <ProductGallery 
              images={images?.nodes || []} 
              title={title}
            />
          </div>

          {/* Right Column - Product Info */}
          <div className="order-2 space-y-6">
            
            {/* Vendor Tag */}
            {vendor && (
              <div className="flex items-center gap-2">
                <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent-cyan)] border border-[var(--color-accent-cyan)] px-2 py-1">
                  {vendor}
                </span>
                {selectedVariant?.sku && (
                  <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-wider text-[var(--color-fg-muted)]">
                    SKU: {selectedVariant.sku}
                  </span>
                )}
              </div>
            )}

            {/* Title */}
            <h1 className="font-[var(--font-display)] text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tighter text-[var(--color-fg-primary)] leading-[0.9]">
              {title}
            </h1>

            {/* Quick Specs Row (if available) */}
            {specs && (
              <div className="flex flex-wrap gap-2">
                {Object.entries(specs).slice(0, 3).map(([key, value], index) => {
                  const colors = ['cyan', 'lime', 'magenta', 'amber'];
                  const color = colors[index % colors.length];
                  return (
                    <TechSpecBadge
                      key={key}
                      label={key}
                      value={value}
                      color={color}
                    />
                  );
                })}
              </div>
            )}

            {/* Product Form with Variant Selector */}
            <div className="border-t-2 border-[var(--color-border-primary)] pt-6">
              <ProductForm
                productOptions={productOptions}
                selectedVariant={selectedVariant}
              />
            </div>

            {/* Description Section */}
            {descriptionHtml && (
              <div className="border-t-2 border-[var(--color-border-primary)] pt-6">
                <h2 className="font-[var(--font-display)] text-lg font-bold uppercase tracking-tight text-[var(--color-fg-primary)] mb-4">
                  Description
                </h2>
                <div 
                  className="prose-brutalist font-[var(--font-sans)] text-[var(--color-fg-secondary)] leading-relaxed"
                  dangerouslySetInnerHTML={{__html: descriptionHtml}}
                />
              </div>
            )}

            {/* Full Tech Specs Table */}
            {specs && (
              <div className="border-t-2 border-[var(--color-border-primary)] pt-6">
                <h2 className="font-[var(--font-display)] text-lg font-bold uppercase tracking-tight text-[var(--color-fg-primary)] mb-4">
                  Technical Specifications
                </h2>
                <div className="border-2 border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)]">
                  {Object.entries(specs).map(([key, value], index, arr) => (
                    <div 
                      key={key}
                      className={`flex justify-between items-center px-4 py-3 ${
                        index !== arr.length - 1 ? 'border-b border-[var(--color-border-primary)]' : ''
                      }`}
                    >
                      <span className="font-[var(--font-mono)] text-xs uppercase tracking-wider text-[var(--color-fg-muted)]">
                        {key}
                      </span>
                      <span className="font-[var(--font-mono)] text-sm font-bold text-[var(--color-fg-primary)]">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags Display */}
            {tags && tags.length > 0 && (
              <div className="border-t-2 border-[var(--color-border-primary)] pt-6">
                <h2 className="font-[var(--font-mono)] text-xs uppercase tracking-widest text-[var(--color-fg-muted)] mb-3">
                  Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span 
                      key={tag}
                      className="font-[var(--font-mono)] text-[10px] uppercase tracking-wider text-[var(--color-fg-secondary)] border border-[var(--color-border-primary)] px-2 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Analytics - Product View Event */}
      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price?.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

/**
 * GraphQL Fragments and Query
 */
const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
`;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    tags
    encodedVariantExistence
    encodedVariantAvailability
    images(first: 10) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
`;

/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
