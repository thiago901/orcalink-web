import React, { useEffect, useRef, useState } from 'react';

import { useGallery } from './GalleryContext';
import { ImageType } from './types';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaX } from 'react-icons/fa6';

interface ImagePreviewProps {
  images: ImageType[];
  onClose: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ images, onClose }) => {
  const { selectedImage } = useGallery();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedImage) {
      const index = images.findIndex((img) => img.id === selectedImage.id);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }

    // Add keyboard event listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') navigateImage(-1);
      if (e.key === 'ArrowRight') navigateImage(1);
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when preview is open

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto'; // Restore scrolling when preview is closed
    };
  }, [selectedImage, images, onClose]);

  const navigateImage = (direction: number) => {
    setIsLoading(true);
    setIsError(false);
    const newIndex = (currentIndex + direction + images.length) % images.length;
    setCurrentIndex(newIndex);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setIsError(true);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === containerRef.current) {
      onClose();
    }
  };

  if (!images.length) {
    return null;
  }

  const currentImage = images[currentIndex];

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4 transition-opacity duration-300"
      onClick={handleBackdropClick}
    >
      <button 
        className="absolute top-4 right-4 z-[60] text-white hover:text-gray-300 focus:outline-none p-2 rounded-full bg-black bg-opacity-30 hover:bg-opacity-50 transition-colors"
        onClick={onClose}
        aria-label="Close preview"
      >
        <FaX className="w-6 h-6" />
      </button>

      <div className="relative w-full max-w-5xl mx-auto">
        {images.length > 1 && (
          <>
            <button 
              className="absolute left-2 top-1/2 -translate-y-1/2 z-[55] bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 text-white transition-all"
              onClick={() => navigateImage(-1)}
              aria-label="Previous image"
            >
              <FiChevronLeft className="w-6 h-6" />
            </button>
            <button 
              className="absolute right-2 top-1/2 -translate-y-1/2 z-[55] bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 text-white transition-all"
              onClick={() => navigateImage(1)}
              aria-label="Next image"
            >
              <FiChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        <div className="relative flex items-center justify-center min-h-[50vh] md:min-h-[60vh]">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-gray-300 border-t-white rounded-full animate-spin"></div>
            </div>
          )}
          
          {isError ? (
            <div className="bg-red-900 bg-opacity-30 text-white p-4 rounded-lg text-center">
              <p>Failed to load image</p>
            </div>
          ) : (
            <img
              src={currentImage.url}
              alt={currentImage.caption || `Image ${currentIndex + 1}`}
              className={`max-h-[80vh] max-w-full object-contain transition-opacity duration-300 ${
                isLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )}
        </div>

        {currentImage.caption && (
          <div className="mt-4 text-center bg-black bg-opacity-50 p-3 rounded text-white max-w-3xl mx-auto">
            <p>{currentImage.caption}</p>
          </div>
        )}

        {images.length > 1 && (
          <div className="mt-4 flex justify-center items-center space-x-1">
            <p className="text-white text-sm">
              {currentIndex + 1} / {images.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagePreview;