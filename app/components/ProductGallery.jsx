import {useState, useEffect} from 'react';
import {Image} from '@shopify/hydrogen';

/**
 * Product Gallery with main image and thumbnail navigation
 * @param {{
 *   images: Array<{id: string, url: string, altText?: string, width: number, height: number}>;
 *   selectedImage?: {id: string, url: string, altText?: string, width: number, height: number};
 *   isOnSale?: boolean;
 * }}
 */
export function ProductGallery({images, selectedImage, isOnSale}) {
  // Use selectedImage (from variant) if available, otherwise first image
  const initialImage = selectedImage || images[0];
  const [activeImage, setActiveImage] = useState(initialImage);

  // Update active image when variant changes
  useEffect(() => {
    if (selectedImage) {
      setActiveImage(selectedImage);
    }
  }, [selectedImage?.id]);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-[var(--color-subtle)] rounded-[var(--radius-md)] flex items-center justify-center">
        <span className="text-[var(--color-primary)]/40">
          No image available
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-subtle)] border border-[var(--color-border)] shadow-[0_12px_40px_-30px_rgba(0,0,0,0.45)]">
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/10" />
        {activeImage && (
          <Image
            alt={activeImage.altText || 'Product image'}
            data={activeImage}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="relative h-full w-full object-contain"
          />
        )}

        {/* Sale Badge */}
        {isOnSale && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1.5 text-xs font-bold uppercase tracking-widest bg-[var(--color-accent)] text-white rounded-[var(--radius-sm)]">
              Sale
            </span>
          </div>
        )}

        {/* Zoom hint */}
        <button
          className="absolute bottom-4 right-4 p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors"
          aria-label="Zoom image"
          onClick={() => {
            // Could open a modal/lightbox here
          }}
        >
          <svg
            className="w-5 h-5 text-[var(--color-primary)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
            />
          </svg>
        </button>
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((image, index) => {
            const isActive = activeImage?.id === image.id;
            return (
              <button
                key={image.id || index}
                onClick={() => setActiveImage(image)}
                className={`
                  relative flex-shrink-0 w-20 h-20 rounded-[var(--radius-sm)] overflow-hidden border-2 transition-all duration-200
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2
                  ${
                    isActive
                      ? 'border-[var(--color-primary)] ring-1 ring-[var(--color-primary)] ring-offset-2'
                      : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50'
                  }
                `}
                aria-label={`View image ${index + 1}`}
                aria-current={isActive ? 'true' : 'false'}
              >
                <Image
                  alt={image.altText || `Product thumbnail ${index + 1}`}
                  data={image}
                  sizes="80px"
                  className="h-full w-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Image Counter (Mobile) */}
      {images.length > 1 && (
        <div className="text-center text-sm text-[var(--color-primary)]/60 lg:hidden">
          {images.findIndex((img) => img.id === activeImage?.id) + 1} /{' '}
          {images.length}
        </div>
      )}
    </div>
  );
}
