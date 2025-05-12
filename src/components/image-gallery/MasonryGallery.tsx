import React, { useState } from 'react';
import { ImageType } from './types';
import { useGallery } from './GalleryContext';

interface MasonryGalleryProps {
  images: ImageType[];
  onImageClick?: (image: ImageType) => void;
  className?: string;
}

const MasonryGallery: React.FC<MasonryGalleryProps> = ({
  images,
  onImageClick,
  className = '',
}) => {
  const { setSelectedImage, setIsPreviewOpen } = useGallery();
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [errorImages, setErrorImages] = useState<Set<string>>(new Set());

  // Create columns for masonry layout
  const createColumns = (): ImageType[][] => {
    const columns: ImageType[][] = [[], [], []];
    
    images.forEach((image, index) => {
      const columnIndex = index % 3;
      columns[columnIndex].push(image);
    });
    
    return columns;
  };

  const columns = createColumns();

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
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ${className}`}>
      {columns.map((column, columnIndex) => (
        <div key={columnIndex} className="flex flex-col gap-4">
          {column.map((image) => {
            // Calculate random height for visual variety
            const aspectRatio = image.height && image.width 
              ? image.height / image.width 
              : 1 + Math.random() * 0.5;
            
            return (
              <div
                key={image.id}
                className="relative overflow-hidden bg-gray-100 rounded-lg group"
                style={{ paddingBottom: `${aspectRatio * 100}%` }}
              >
                <div 
                  className="absolute inset-0 transform transition-transform duration-500 ease-out"
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
                      className={`w-full h-full object-cover transition-all duration-500 
                        absolute inset-0 cursor-pointer
                        group-hover:scale-105
                        ${loadedImages.has(image.id) ? 'opacity-100' : 'opacity-0'}`}
                      onLoad={() => handleImageLoad(image.id)}
                      onError={() => handleImageError(image.id)}
                    />
                  )}

                  {/* Hover overlay with caption */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
                    {image.caption && (
                      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 via-black/40 to-transparent translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                        <p className="text-white text-sm md:text-base font-medium">{image.caption}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default MasonryGallery;