import {useLoaderData, Link} from 'react-router';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductGallery} from '~/components/ProductGallery';
import {ProductForm} from '~/components/ProductForm';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  return [
    {title: `${data?.product.title ?? ''} | M-U-PLUG`},
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

/**
 * @param {Route.LoaderArgs}
 */
async function loadCriticalData({context, params, request}) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {
    product,
  };
}

/**
 * @param {Route.LoaderArgs}
 */
function loadDeferredData({context, params}) {
  return {};
}

export default function Product() {
  /** @type {LoaderReturnData} */
  const {product} = useLoaderData();

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  const selectedOptions = selectedVariant?.selectedOptions ?? [];
  useSelectedOptionInUrlParam(selectedOptions);

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml, vendor} = product;
  const isOnSale =
    selectedVariant?.compareAtPrice?.amount > selectedVariant?.price?.amount;
  const metafields = normalizeProductMetafields(product?.metafields || []);
  const shortDescription = metafields.short_description;
  const keyFeatures = asStringList(metafields.key_features);
  const includedInBox = asStringList(metafields.included_in_box);
  const specs = asKeyValueList(metafields.specs);
  const availabilityText = selectedVariant?.availableForSale
    ? 'In stock, ready to ship'
    : 'Out of stock';

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <ol className="flex items-center gap-2 text-[var(--color-primary)]/60">
          <li>
            <Link
              to="/"
              className="hover:text-[var(--color-primary)] transition-colors"
            >
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link
              to="/collections/all"
              className="hover:text-[var(--color-primary)] transition-colors"
            >
              Shop
            </Link>
          </li>
          <li>/</li>
          <li className="text-[var(--color-primary)] font-medium truncate max-w-[200px]">
            {title}
          </li>
        </ol>
      </nav>

      {/* Main Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Left: Product Gallery */}
        <ProductGallery
          images={product.images?.nodes || []}
          selectedImage={selectedVariant?.image}
          isOnSale={isOnSale}
        />

        {/* Right: Product Info */}
        <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
          {/* Vendor Badge */}
          {vendor && (
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">
              {vendor}
            </span>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] leading-tight">
            {title}
          </h1>

          {shortDescription && (
            <p className="text-base text-[var(--color-primary)]/70 leading-relaxed">
              {shortDescription}
            </p>
          )}

          {/* Price */}
          <ProductPrice
            price={selectedVariant?.price}
            compareAtPrice={selectedVariant?.compareAtPrice}
          />

          <div className="flex items-center gap-2 text-sm text-[var(--color-primary)]/60">
            <span className="inline-flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  selectedVariant?.availableForSale
                    ? 'bg-[var(--color-success)]'
                    : 'bg-[var(--color-error)]'
                }`}
              />
              {availabilityText}
            </span>
            <span>•</span>
            <span>Ships in 1-3 days</span>
          </div>

          {/* Divider */}
          <div className="border-t border-[var(--color-border)]" />

          {/* Product Form (Options + Add to Cart) */}
          <ProductForm
            productOptions={productOptions}
            selectedVariant={selectedVariant}
          />

          {/* Trust Signals */}
          <ProductTrustSignals />

          {keyFeatures.length > 0 && (
            <ProductFeatureList title="Key Features" items={keyFeatures} />
          )}

          {specs.length > 0 && <ProductSpecs specs={specs} />}

          {includedInBox.length > 0 && (
            <ProductFeatureList
              title="Included in the Box"
              items={includedInBox}
            />
          )}

          {/* Description */}
          <div className="pt-6 border-t border-[var(--color-border)]">
            <ProductDescription descriptionHtml={descriptionHtml} />
          </div>
        </div>
      </div>

      {/* Analytics */}
      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
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
 * Product Trust Signals - Builds confidence at point of purchase
 */
function ProductTrustSignals() {
  const signals = [
    {
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ),
      text: 'Pre-loaded & ready to play',
    },
    {
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      text: 'Ships within 1-3 business days',
    },
    {
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      text: '30-day hassle-free returns',
    },
  ];

  return (
    <div className="bg-[var(--color-subtle)] rounded-[var(--radius-md)] p-4 space-y-3">
      {signals.map((signal, index) => (
        <div
          key={index}
          className="flex items-center gap-3 text-sm text-[var(--color-primary)]"
        >
          <span className="text-[var(--color-accent)]">{signal.icon}</span>
          <span>{signal.text}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * Product Description with collapsible sections
 */
function ProductDescription({descriptionHtml}) {
  if (!descriptionHtml) return null;

  const textLength = stripHtml(descriptionHtml).length;
  const isLong = textLength > 700;

  return (
    <details className="group" open={!isLong}>
      <summary className="flex items-center justify-between cursor-pointer list-none py-2">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-primary)]">
          Description
        </h3>
        <span className="text-[var(--color-primary)]/60 group-open:rotate-180 transition-transform duration-200">
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
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </summary>
      <div
        className="prose prose-sm max-w-none pt-4 text-[var(--color-primary)]/80 leading-relaxed"
        dangerouslySetInnerHTML={{__html: descriptionHtml}}
      />
    </details>
  );
}

function ProductFeatureList({title, items}) {
  if (!items?.length) return null;

  return (
    <div className="border border-[var(--color-border)] rounded-[var(--radius-md)] p-4">
      <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)]/60 mb-3">
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li
            key={`${title}-${index}`}
            className="flex items-start gap-2 text-sm"
          >
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
            <span className="text-[var(--color-primary)]/80">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProductSpecs({specs}) {
  if (!specs?.length) return null;

  return (
    <div className="border border-[var(--color-border)] rounded-[var(--radius-md)] p-4">
      <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)]/60 mb-3">
        Specifications
      </h3>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
        {specs.map((spec, index) => (
          <div key={`${spec.label}-${index}`} className="space-y-1">
            <dt className="text-[var(--color-primary)]/50 text-xs uppercase tracking-wider">
              {spec.label}
            </dt>
            <dd className="text-[var(--color-primary)] text-sm">
              {spec.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function normalizeProductMetafields(metafields) {
  const map = {};

  for (const field of metafields) {
    if (!field?.key) continue;
    map[field.key] = field?.value || '';
  }

  return map;
}

function asStringList(value) {
  if (!value) return [];

  if (Array.isArray(value)) return value.filter(Boolean);

  const trimmed = String(value).trim();
  if (!trimmed) return [];

  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item)).filter(Boolean);
      }
    } catch (error) {
      return trimmed
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return trimmed
    .split(/\n|\r|, /)
    .map((item) => item.trim())
    .filter(Boolean);
}

function asKeyValueList(value) {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .map((item) => ({
        label: String(item?.label || item?.key || ''),
        value: String(item?.value || ''),
      }))
      .filter((item) => item.label && item.value);
  }

  const trimmed = String(value).trim();
  if (!trimmed) return [];

  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed
          .map((item) => ({
            label: String(item?.label || item?.key || ''),
            value: String(item?.value || ''),
          }))
          .filter((item) => item.label && item.value);
      }

      return Object.entries(parsed).map(([label, entryValue]) => ({
        label,
        value: String(entryValue),
      }));
    } catch (error) {
      return [];
    }
  }

  return trimmed
    .split('\n')
    .map((line) => line.split(':').map((part) => part.trim()))
    .filter(([label, entryValue]) => label && entryValue)
    .map(([label, entryValue]) => ({label, value: entryValue}));
}

function stripHtml(html) {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// ============================================
// GRAPHQL QUERIES
// ============================================

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
    encodedVariantExistence
    encodedVariantAvailability
    metafields(
      identifiers: [
        {namespace: "custom", key: "short_description"}
        {namespace: "custom", key: "key_features"}
        {namespace: "custom", key: "specs"}
        {namespace: "custom", key: "included_in_box"}
      ]
    ) {
      key
      value
      type
    }
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

/** @typedef {import('./+types/products.$handle').Route} Route */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
