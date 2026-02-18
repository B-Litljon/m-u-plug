import {useState} from 'react';
import {Image} from '@shopify/hydrogen';

/**
 * ProductGallery - Neo-Brutalist Image Grid
 * First image: Full width
 * Subsequent images: 2-column grid below
 * 
 * @param {Object} props
 * @param {Array} props.images - Array of product images
 * @param {string} props.title - Product title for alt text
 */
export function ProductGallery({images, title}) {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="border-4 border-[var(--color-fg-primary)] bg-[var(--color-bg-secondary)] aspect-square flex items-center justify-center">
        <span className="font-[var(--font-mono)] text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">
          NO IMAGE
        </span>
      </div>
    );
  }

  const mainImage = images[selectedImage];
  const remainingImages = images.slice(1);

  return (
    <div className="space-y-[2px] bg-[var(--color-border-primary)] border-4 border-[var(--color-fg-primary)]">
      {/* Main Image - Full Width */}
      <div className="bg-[var(--color-bg-secondary)] relative">
        <div className="aspect-square">
          <Image
            data={mainImage}
            alt={`${title} - Image ${selectedImage + 1}`}
            className="w-full h-full object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>
        
        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-[var(--color-bg-primary)] border-2 border-[var(--color-fg-primary)] px-3 py-1">
          <span className="font-[var(--font-mono)] text-xs font-bold text-[var(--color-fg-primary)]">
            {selectedImage + 1} / {images.length}
          </span>
        </div>
      </div>

      {/* Thumbnail Grid - 2 Columns */}
      {remainingImages.length > 0 && (
        <div className="grid grid-cols-2 gap-[2px]">
          {remainingImages.map((image, index) => {
            const actualIndex = index + 1;
            const isSelected = selectedImage === actualIndex;

            return (
              <button
                key={image.id || index}
                onClick={() => setSelectedImage(actualIndex)}
                className={`relative bg-[var(--color-bg-secondary)] aspect-square overflow-hidden transition-all duration-150 ${
                  isSelected 
                    ? 'ring-4 ring-[var(--color-accent-cyan)] ring-inset' 
                    : 'hover:opacity-80'
                }`}
                aria-label={`View image ${actualIndex + 1} of ${images.length}`}
                aria-pressed={isSelected}
              >
                <Image
                  data={image}
                  alt={`${title} - Thumbnail ${actualIndex + 1}`}
                  className="w-full h-full object-cover"
                  sizes="(min-width: 1024px) 25vw, 50vw"
                />
                
                {/* Selected Indicator */}
                {isSelected && (
                  <div className="absolute inset-0 bg-[var(--color-accent-cyan)]/10 pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * ProductGallerySkeleton - Loading state
 */
export function ProductGallerySkeleton() {
  return (
    <div className="space-y-[2px] bg-[var(--color-border-primary)] border-4 border-[var(--color-fg-primary)]">
      {/* Main Image Skeleton */}
      <div className="bg-[var(--color-bg-secondary)] aspect-square">
        <div className="w-full h-full animate-pulse bg-[var(--color-bg-tertiary)]" />
      </div>
      
      {/* Thumbnail Grid Skeleton */}
      <div className="grid grid-cols-2 gap-[2px]">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-[var(--color-bg-secondary)] aspect-square">
            <div className="w-full h-full animate-pulse bg-[var(--color-bg-tertiary)]" />
          </div>
        ))}
      </div>
    </div>
  );
}
