/**
 * Marquee - Neo-Brutalist Scrolling Banner
 * Full-width infinite scroll with alternating colors
 */

/**
 * Marquee Component
 * 
 * @param {Object} props
 * @param {string} [props.variant='lime'] - 'lime' | 'magenta' | 'cyan' | 'amber'
 * @param {string} [props.speed='normal'] - 'slow' | 'normal' | 'fast'
 * @param {string} [props.className] - Additional classes
 * @param {React.ReactNode} props.children - Content to scroll
 */
export function Marquee({
  variant = 'lime',
  speed = 'normal',
  className = '',
  children,
}) {
  const variantStyles = {
    lime: {
      bg: 'bg-[var(--color-accent-lime)]',
      text: 'text-[var(--color-bg-primary)]',
    },
    magenta: {
      bg: 'bg-[var(--color-accent-magenta)]',
      text: 'text-[var(--color-bg-primary)]',
    },
    cyan: {
      bg: 'bg-[var(--color-accent-cyan)]',
      text: 'text-[var(--color-bg-primary)]',
    },
    amber: {
      bg: 'bg-[var(--color-accent-amber)]',
      text: 'text-[var(--color-bg-primary)]',
    },
  };

  const speedStyles = {
    slow: 'animate-marquee-slow',
    normal: 'animate-marquee',
    fast: 'animate-marquee-fast',
  };

  const {bg, text} = variantStyles[variant] || variantStyles.lime;

  return (
    <div 
      className={`w-full overflow-hidden ${bg} border-b-4 border-[var(--color-fg-primary)] ${className}`}
      style={{ willChange: 'transform' }}
    >
      <div className={`flex whitespace-nowrap ${speedStyles[speed]}`}>
        {/* Duplicate content for seamless loop */}
        <div className={`flex items-center py-2 ${text}`}>
          {children}
        </div>
        <div className={`flex items-center py-2 ${text}`}>
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * MarqueeItem - Individual item within marquee
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.separator='//']
 */
export function MarqueeItem({ children, separator = '//' }) {
  return (
    <span className="flex items-center">
      <span className="font-[var(--font-mono)] text-xs md:text-sm font-bold uppercase tracking-[0.2em] px-4 md:px-8">
        {children}
      </span>
      <span className="font-[var(--font-mono)] text-xs font-bold opacity-50">
        {separator}
      </span>
    </span>
  );
}

/**
 * PromotionalMarquee - Pre-configured marquee for site-wide announcements
 */
export function PromotionalMarquee() {
  const messages = [
    'FREE SHIPPING ON ALL ORDERS',
    'NEW DROPS EVERY FRIDAY',
    'SYSTEM ONLINE',
    'AUTHENTIC HARDWARE ONLY',
    '2-YEAR WARRANTY',
    'GLOBAL SHIPPING',
  ];

  return (
    <Marquee variant="lime" speed="normal">
      {messages.map((msg, index) => (
        <MarqueeItem key={index}>
          {msg}
        </MarqueeItem>
      ))}
    </Marquee>
  );
}

export default Marquee;
