import {Link, useLocation} from 'react-router';

/**
 * Catch-all route for 404 errors
 * Displays a Neo-Brutalist "System Failure" error page
 */
export async function loader({request}) {
  throw new Response(`${new URL(request.url).pathname} not found`, {
    status: 404,
  });
}

export default function CatchAllPage() {
  return null;
}

/**
 * ErrorBoundary - Neo-Brutalist 404 Page
 * Displays when no route matches
 */
export function ErrorBoundary() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] flex flex-col">
      {/* Error Header */}
      <header className="border-b-4 border-[var(--color-error)] bg-[var(--color-bg-secondary)]">
        <div className="max-w-[var(--grid-max-width)] mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[var(--color-error)] animate-pulse" />
            <span className="font-[var(--font-mono)] text-xs uppercase tracking-[0.3em] text-[var(--color-error)]">
              SYSTEM ERROR
            </span>
          </div>
        </div>
      </header>

      {/* Main Error Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full text-center">
          {/* Error Code */}
          <div className="mb-8">
            <span className="font-[var(--font-display)] text-8xl md:text-9xl font-bold text-[var(--color-error)] tracking-tighter">
              404
            </span>
          </div>

          {/* Error Title */}
          <h1 className="font-[var(--font-display)] text-3xl md:text-5xl font-bold uppercase tracking-tighter text-[var(--color-fg-primary)] mb-4">
            // SYSTEM FAILURE
          </h1>

          {/* Error Message */}
          <p className="font-[var(--font-mono)] text-sm md:text-base uppercase tracking-widest text-[var(--color-fg-muted)] mb-2">
            SIGNAL LOST
          </p>
          <p className="font-[var(--font-mono)] text-xs uppercase tracking-wider text-[var(--color-fg-muted)] mb-8">
            HARDWARE NOT FOUND: {path}
          </p>

          {/* Error Details Box */}
          <div className="border-2 border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] p-6 mb-8 max-w-lg mx-auto">
            <div className="font-[var(--font-mono)] text-xs uppercase tracking-wider text-[var(--color-fg-muted)] mb-4 border-b border-[var(--color-border-primary)] pb-2">
              ERROR LOG
            </div>
            <code className="font-[var(--font-mono)] text-xs text-[var(--color-error)] block text-left overflow-x-auto">
              ERROR_CODE: 404_NOT_FOUND<br />
              ROUTE: {path}<br />
              TIMESTAMP: {new Date().toISOString()}<br />
              STATUS: TERMINATED
            </code>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-block bg-[var(--color-fg-primary)] text-[var(--color-bg-primary)] border-2 border-[var(--color-fg-primary)] px-8 py-4 font-[var(--font-display)] text-sm font-bold uppercase tracking-widest shadow-[4px_4px_0px_0px_var(--color-accent-lime)] hover:shadow-[2px_2px_0px_0px_var(--color-accent-lime)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all"
            >
              REBOOT SYSTEM
            </Link>
            <Link
              to="/collections/all"
              className="inline-block bg-transparent text-[var(--color-fg-primary)] border-2 border-[var(--color-fg-primary)] px-8 py-4 font-[var(--font-mono)] text-xs font-bold uppercase tracking-widest hover:bg-[var(--color-fg-primary)] hover:text-[var(--color-bg-primary)] transition-colors"
            >
              BROWSE HARDWARE
            </Link>
          </div>

          {/* ASCII Art Decoration */}
          <div className="mt-12 font-[var(--font-mono)] text-[10px] text-[var(--color-border-accent)] leading-none select-none">
            <pre className="overflow-x-auto">
{`    ___   ___  ________  ___   ___     
   |\  \ |\  \|\   __  \|\  \ |\  \    
   \ \  \\_\  \ \  \|\  \ \  \\_\  \   
    \ \______  \ \  \\\  \ \______  \  
     \|_____|\  \ \  \\\  \|_____|\  \ 
            \ \__\ \_______\    \ \__\
             \|__|\|_______|     \|__|`}
            </pre>
          </div>
        </div>
      </main>

      {/* Footer Error Bar */}
      <footer className="border-t-2 border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)]">
        <div className="max-w-[var(--grid-max-width)] mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]">
              ERROR_ID: {Math.random().toString(36).substring(7).toUpperCase()}
            </span>
            <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--color-error)]">
              TERMINATED
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
