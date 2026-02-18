import {useLoaderData, Link} from 'react-router';

/**
 * Meta tags for page
 */
export const meta = ({data}) => {
  return [
    {title: `${data?.page?.title ?? 'Page'} | M-U-PLUG`},
  ];
};

/**
 * Loader - Fetches page by handle
 */
export async function loader({context, params}) {
  if (!params.handle) {
    throw new Error('Missing page handle');
  }

  const {page} = await context.storefront.query(PAGE_QUERY, {
    variables: {
      handle: params.handle,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  if (!page) {
    throw new Response('Not Found', {status: 404});
  }

  return {page};
}

/**
 * Generic Page Template - Neo-Brutalist Layout
 * Renders Shopify CMS pages (About, FAQ, Contact, etc.)
 */
export default function Page() {
  const {page} = useLoaderData();
  const {title, body} = page;

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

      {/* Page Header */}
      <header className="border-b-4 border-[var(--color-fg-primary)] bg-[var(--color-bg-secondary)]">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-16">
          <h1 className="font-[var(--font-display)] text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tighter text-[var(--color-fg-primary)] leading-[0.9]">
            {title}
          </h1>
          
          {/* Decorative Line */}
          <div className="mt-6 flex items-center gap-4">
            <div className="h-[2px] flex-1 bg-[var(--color-border-primary)]" />
            <span className="font-[var(--font-mono)] text-xs uppercase tracking-[0.3em] text-[var(--color-accent-cyan)]">
              // CONTENT
            </span>
            <div className="h-[2px] flex-1 bg-[var(--color-border-primary)]" />
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          {/* Content Container */}
          <div className="border-4 border-[var(--color-fg-primary)] bg-[var(--color-bg-secondary)] p-8 md:p-12">
            {/* Prose Content */}
            {body ? (
              <div 
                className="prose-brutalist"
                dangerouslySetInnerHTML={{__html: body}}
              />
            ) : (
              <div className="text-center py-12">
                <p className="font-[var(--font-mono)] text-sm uppercase tracking-wider text-[var(--color-fg-muted)]">
                  No content available.
                </p>
              </div>
            )}
          </div>

          {/* Page Metadata Footer */}
          <div className="mt-8 border-t-2 border-[var(--color-border-primary)] pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]">
                  PAGE ID
                </span>
                <span className="font-[var(--font-mono)] text-[10px] text-[var(--color-accent-cyan)]">
                  {page.id?.split('/').pop()?.toUpperCase()}
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                <Link
                  to="/"
                  className="font-[var(--font-mono)] text-xs uppercase tracking-wider text-[var(--color-fg-secondary)] hover:text-[var(--color-accent-lime)] transition-colors"
                >
                  &larr; Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/**
 * Error Boundary - Neo-Brutalist Error Display
 */
export function ErrorBoundary() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="border-4 border-[var(--color-error)] bg-[var(--color-bg-secondary)] p-12">
          <h1 className="font-[var(--font-display)] text-4xl font-bold uppercase tracking-tighter text-[var(--color-error)] mb-4">
            PAGE ERROR
          </h1>
          <p className="font-[var(--font-mono)] text-sm uppercase tracking-wider text-[var(--color-fg-muted)] mb-6">
            Unable to load page content
          </p>
          <Link
            to="/"
            className="inline-block bg-[var(--color-fg-primary)] text-[var(--color-bg-primary)] border-2 border-[var(--color-fg-primary)] px-6 py-3 font-[var(--font-mono)] text-xs font-bold uppercase tracking-widest hover:bg-[var(--color-accent-lime)] hover:border-[var(--color-accent-lime)] transition-colors"
          >
            RETURN HOME
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * GraphQL Query
 */
const PAGE_QUERY = `#graphql
  query Page(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    page(handle: $handle) {
      id
      handle
      title
      body
      seo {
        description
        title
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
