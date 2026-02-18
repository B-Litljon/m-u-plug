/**
 * BentoGrid Component
 * Rigid, architectural grid system for Neo-Brutalist layout
 * Tailwind CSS v4 compatible with @theme variables
 */

/**
 * BentoGrid - Primary Grid Container
 * Creates a rigid bento-box style layout with configurable columns
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Grid items
 * @param {number} [props.cols=4] - Number of columns (1-12)
 * @param {string} [props.gap='1px'] - Gap between cells
 * @param {string} [props.className] - Additional Tailwind classes
 */
export function BentoGrid({
  children,
  cols = 4,
  gap = '1px',
  className = '',
}) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    7: 'grid-cols-7',
    8: 'grid-cols-8',
    9: 'grid-cols-9',
    10: 'grid-cols-10',
    11: 'grid-cols-11',
    12: 'grid-cols-12',
  };

  const colClass = gridCols[cols] || 'grid-cols-4';

  return (
    <div
      className={`grid ${colClass} bg-[var(--color-border-primary)] ${className}`}
      style={{ gap }}
    >
      {children}
    </div>
  );
}

/**
 * BentoCell - Individual Grid Cell
 * A bordered, elevated container for content
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Cell content
 * @param {number} [props.colSpan=1] - Columns to span (1-12)
 * @param {number} [props.rowSpan=1] - Rows to span
 * @param {string} [props.bg='bg-secondary'] - Background style
 * @param {string} [props.padding='p-6'] - Padding class
 * @param {string} [props.className] - Additional Tailwind classes
 */
export function BentoCell({
  children,
  colSpan = 1,
  rowSpan = 1,
  bg = 'bg-[var(--color-bg-secondary)]',
  padding = 'p-6',
  className = '',
}) {
  const spanClasses = {
    col: {
      1: 'col-span-1',
      2: 'col-span-2',
      3: 'col-span-3',
      4: 'col-span-4',
      5: 'col-span-5',
      6: 'col-span-6',
      7: 'col-span-7',
      8: 'col-span-8',
      9: 'col-span-9',
      10: 'col-span-10',
      11: 'col-span-11',
      12: 'col-span-12',
    },
    row: {
      1: 'row-span-1',
      2: 'row-span-2',
      3: 'row-span-3',
      4: 'row-span-4',
      5: 'row-span-5',
      6: 'row-span-6',
    },
  };

  const colSpanClass = spanClasses.col[colSpan] || 'col-span-1';
  const rowSpanClass = spanClasses.row[rowSpan] || '';

  return (
    <div
      className={`${colSpanClass} ${rowSpanClass} ${bg} ${padding} ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * BentoSection - Full-width Section Wrapper
 * Creates page sections with consistent max-width and padding
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Section content
 * @param {string} [props.border='border-b'] - Border position
 * @param {boolean} [props.contained=true] - Apply max-width container
 * @param {string} [props.className] - Additional Tailwind classes
 */
export function BentoSection({
  children,
  border = 'border-b',
  contained = true,
  className = '',
}) {
  return (
    <section
      className={`${border} border-[var(--color-border-primary)] ${className}`}
    >
      <div
        className={
          contained
            ? 'max-w-[var(--grid-max-width)] mx-auto px-6'
            : 'w-full'
        }
      >
        {children}
      </div>
    </section>
  );
}

/**
 * BentoHero - Large Featured Grid Layout
 * Pre-configured bento layout for hero sections
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.feature - Main featured content (spans 2x2)
 * @param {React.ReactNode} props.side1 - Side content 1
 * @param {React.ReactNode} props.side2 - Side content 2
 * @param {React.ReactNode} props.bottom1 - Bottom content 1
 * @param {React.ReactNode} props.bottom2 - Bottom content 2
 * @param {React.ReactNode} props.bottom3 - Bottom content 3
 */
export function BentoHero({
  feature,
  side1,
  side2,
  bottom1,
  bottom2,
  bottom3,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-[1px] bg-[var(--color-border-primary)]">
      {/* Feature - Large left cell */}
      <div className="md:col-span-2 md:row-span-2 bg-[var(--color-bg-secondary)] p-6 md:p-10">
        {feature}
      </div>
      
      {/* Side cells */}
      <div className="bg-[var(--color-bg-secondary)] p-6">
        {side1}
      </div>
      <div className="bg-[var(--color-bg-secondary)] p-6">
        {side2}
      </div>
      
      {/* Bottom row */}
      <div className="bg-[var(--color-bg-secondary)] p-6">
        {bottom1}
      </div>
      <div className="bg-[var(--color-bg-secondary)] p-6">
        {bottom2}
      </div>
      <div className="bg-[var(--color-bg-secondary)] p-6">
        {bottom3}
      </div>
    </div>
  );
}

/**
 * GridDivider - Visual separator for grid sections
 * 
 * @param {Object} props
 * @param {string} [props.type='horizontal'] - Divider direction
 * @param {string} [props.className] - Additional classes
 */
export function GridDivider({
  type = 'horizontal',
  className = '',
}) {
  if (type === 'vertical') {
    return (
      <div
        className={`w-[1px] h-full bg-[var(--color-border-primary)] ${className}`}
      />
    );
  }

  return (
    <div
      className={`w-full h-[1px] bg-[var(--color-border-primary)] ${className}`}
    />
  );
}

/**
 * HardwareFrame - Specialized container for product images
 * Creates the "premium hardware showcase" look
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Image/content
 * @param {string} [props.aspect='aspect-square'] - Aspect ratio
 * @param {string} [props.className] - Additional classes
 */
export function HardwareFrame({
  children,
  aspect = 'aspect-square',
  className = '',
}) {
  return (
    <div
      className={`
        ${aspect} 
        bg-gradient-to-br from-[var(--color-bg-tertiary)] to-[var(--color-bg-secondary)]
        border border-[var(--color-border-accent)]
        flex items-center justify-center
        overflow-hidden
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export default BentoGrid;
