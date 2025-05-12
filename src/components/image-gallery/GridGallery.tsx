import React, { useState } from 'react';
import { ImageType } from './types';
import { useGallery } from './GalleryContext';

interface GridGalleryProps {
  images: ImageType[];
  onImageClick?: (image: ImageType) => void;
  className?: string;
}

export const GridGallery: React.FC<GridGalleryProps> = ({
  images=[],
  onImageClick,
  className = '',
}) => {
  const { setSelectedImage, setIsPreviewOpen } = useGallery();
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [errorImages, setErrorImages] = useState<Set<string>>(new Set());

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

  const handleClick = (image: ImageType) => {
    if (onImageClick) {
      onImageClick(image);
    }
    setSelectedImage(image);
    setIsPreviewOpen(true);
  };

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${className}`}>
      {images.map((image) => (
        <div
          key={image.id}
          className="relative overflow-hidden bg-gray-100 rounded-lg group aspect-square"
          onClick={() => handleClick(image)}
        >
          {!loadedImages.has(image.id) && !errorImages.has(image.id) && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
            </div>
          )}

          {errorImages.has(image.id) ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <p className="text-sm">Failed to load</p>
            </div>
          ) : (
            <img
              src={image.url}
              alt={image.caption || `Image ${image.id}`}
              className={`w-full h-full object-cover transition-all duration-500 ease-out
                group-hover:scale-105 cursor-pointer
                ${loadedImages.has(image.id) ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => handleImageLoad(image.id)}
              onError={() => handleImageError(image.id)}
            />
          )}

          {/* Caption overlay on hover */}
          {image.caption && loadedImages.has(image.id) && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              <p className="text-white text-sm truncate">{image.caption}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

