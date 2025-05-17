import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageType } from './types';
import { useGallery } from './GalleryContext';

interface CarouselGalleryProps {
  images: ImageType[];
  onImageClick?: (image: ImageType) => void;
  className?: string;
}

const CarouselGallery: React.FC<CarouselGalleryProps> = ({
  images,
  onImageClick,
  className = '',
}) => {
  const { setSelectedImage, setIsPreviewOpen } = useGallery();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [errorImages, setErrorImages] = useState<Set<string>>(new Set());
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll the thumbnail into view when current index changes
    if (thumbnailsRef.current) {
      const thumbnailItems = thumbnailsRef.current.querySelectorAll('[data-thumbnail]');
      const currentThumbnail = thumbnailItems[currentIndex] as HTMLElement;
      
      if (currentThumbnail) {
        thumbnailsRef.current.scrollLeft = 
          currentThumbnail.offsetLeft - 
          thumbnailsRef.current.clientWidth / 2 + 
          currentThumbnail.clientWidth / 2;
      }
    }
  }, [currentIndex]);

  const navigateToImage = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    
    setIsAnimating(true);
    setCurrentIndex(index);
    
    // End animation state after transition completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  const handlePrevious = () => {
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    navigateToImage(newIndex);
  };

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % images.length;
    navigateToImage(newIndex);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    // Swipe threshold
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left - next
        handleNext();
      } else {
        // Swipe right - previous
        handlePrevious();
      }
    }
    
    setTouchStart(null);
  };

  const handleImageLoad = (id: string) => {
    setLoadedImages((prev) => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  };

  const handleImageError = (id: string) => {
    setErrorImages((prev) => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  };

  const handleMainImageClick = (image: ImageType) => {
    if (onImageClick) {
      onImageClick(image);
    }
    setSelectedImage(image);
    setIsPreviewOpen(true);
  };

  if (images.length === 0) {
    return (
      <div className={`bg-gray-100 rounded-lg p-6 text-center ${className}`}>
        <p className="text-gray-500">No images to display</p>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main image display */}
      <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-[16/9] md:aspect-[21/9]">
        <div
          className="absolute inset-0 flex items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {!loadedImages.has(currentImage.id) && !errorImages.has(currentImage.id) && (
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
            </div>
          )}

          {errorImages.has(currentImage.id) ? (
            <div className="flex flex-col items-center justify-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <p>Failed to load image</p>
            </div>
          ) : (
            <img
              src={currentImage.url}
              alt={currentImage.caption || `Image ${currentIndex + 1}`}
              className={`w-full h-full object-contain cursor-pointer transition-opacity duration-300 ${
                loadedImages.has(currentImage.id) ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => handleImageLoad(currentImage.id)}
              onError={() => handleImageError(currentImage.id)}
              onClick={() => handleMainImageClick(currentImage)}
            />
          )}
        </div>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 rounded-full p-2 text-gray-800 shadow-md transition-all z-10"
              onClick={handlePrevious}
              disabled={isAnimating}
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 rounded-full p-2 text-gray-800 shadow-md transition-all z-10"
              onClick={handleNext}
              disabled={isAnimating}
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Caption overlay */}
        {currentImage.caption && (
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <p className="text-white text-sm md:text-base">{currentImage.caption}</p>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div 
          ref={thumbnailsRef}
          className="flex space-x-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 "
        >
          {images.map((image, index) => (
            <div
              key={image.id}
              data-thumbnail
              className={`relative flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-md overflow-hidden 
                cursor-pointer transition-all duration-200 
                ${index === currentIndex ? 'ring-2 ring-blue-500 opacity-100' : 'opacity-70 hover:opacity-100'}`}
              onClick={() => navigateToImage(index)}
            >
              <img
                src={image.url}
                alt={image.caption || `Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                onLoad={() => handleImageLoad(`thumb-${image.id}`)}
                onError={() => handleImageError(`thumb-${image.id}`)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CarouselGallery;