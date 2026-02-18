/**
 * TechSpecs - Mono-font specifications block
 * Displays handheld technical specs in a compact format
 * 
 * @param {Object} props
 * @param {Object} props.specs - Specification object
 * @param {string} [props.size='sm'] - 'sm' | 'md' for text sizing
 * @param {string} [props.layout='inline'] - 'inline' | 'stacked'
 */
export function TechSpecs({
  specs,
  size = 'sm',
  layout = 'inline',
}) {
  if (!specs || Object.keys(specs).length === 0) return null;

  const sizeClasses = {
    sm: 'text-[10px]',
    md: 'text-xs',
  };

  const specEntries = Object.entries(specs).slice(0, 3); // Limit to 3 specs

  if (layout === 'stacked') {
    return (
      <div className="space-y-1">
        {specEntries.map(([key, value]) => (
          <div key={key} className="flex justify-between items-center">
            <span className={`font-[var(--font-mono)] ${sizeClasses[size]} uppercase tracking-wider text-[var(--color-fg-muted)]`}>
              {key}
            </span>
            <span className={`font-[var(--font-mono)] ${sizeClasses[size]} uppercase tracking-wider text-[var(--color-fg-primary)] font-bold`}>
              {value}
            </span>
          </div>
        ))}
      </div>
    );
  }

  // Inline layout (default) - specs separated by pipes
  return (
    <div className={`font-[var(--font-mono)] ${sizeClasses[size]} uppercase tracking-wider text-[var(--color-fg-muted)] truncate`}>
      {specEntries.map(([key, value], index) => (
        <span key={key}>
          <span className="text-[var(--color-accent-cyan)]">{key}:</span>
          <span className="text-[var(--color-fg-secondary)] ml-1">{value}</span>
          {index < specEntries.length - 1 && (
            <span className="mx-2 text-[var(--color-border-accent)]">|</span>
          )}
        </span>
      ))}
    </div>
  );
}

/**
 * TechSpecBadge - Individual spec badge for featured items
 * Displays a single spec with icon/label in a bordered box
 */
export function TechSpecBadge({
  label,
  value,
  color = 'cyan',
}) {
  const colorMap = {
    cyan: 'border-[var(--color-accent-cyan)] text-[var(--color-accent-cyan)]',
    lime: 'border-[var(--color-accent-lime)] text-[var(--color-accent-lime)]',
    magenta: 'border-[var(--color-accent-magenta)] text-[var(--color-accent-magenta)]',
    amber: 'border-[var(--color-accent-amber)] text-[var(--color-accent-amber)]',
  };

  return (
    <div className={`inline-flex flex-col px-3 py-2 border-2 bg-[var(--color-bg-primary)] ${colorMap[color] || colorMap.cyan}`}>
      <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-wider opacity-70">
        {label}
      </span>
      <span className="font-[var(--font-mono)] text-sm font-bold uppercase tracking-wider">
        {value}
      </span>
    </div>
  );
}
