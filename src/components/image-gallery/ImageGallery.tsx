import React from 'react';
import { GalleryLayout, ImageType } from './types';
import {GridGallery} from './GridGallery';
import MasonryGallery from './MasonryGallery';
import CarouselGallery from './CarouselGallery';
import ImagePreview from './ImagePreview';
import LoadingState from './LoadingState';
import ErrorBoundary from './ErrorBoundary';
import { GalleryProvider, useGallery } from './GalleryContext';

interface ImageGalleryProps {
  images: ImageType[];
  onImageClick?: (image: ImageType) => void;
  layout?: GalleryLayout;
  className?: string;
  isLoading?: boolean;
}

const ImageGalleryContent: React.FC<ImageGalleryProps> = ({
  images,
  onImageClick,
  layout = 'grid',
  className = '',
  isLoading = false,
}) => {
  const { isPreviewOpen, setIsPreviewOpen, setSelectedImage } = useGallery();

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setSelectedImage(null);
  };

  if (isLoading) {
    return <LoadingState layout={layout} />;
  }

  if (images.length === 0) {
    return (
      <div className={`bg-gray-100 rounded-lg p-6 text-center ${className}`}>
        <p className="text-gray-500">No images to display</p>
      </div>
    );
  }

  return (
    <>
      <ErrorBoundary>
        {layout === 'masonry' && (
          <MasonryGallery
            images={images}
            onImageClick={onImageClick}
            className={className}
          />
        )}
        
        {layout === 'carousel' && (
          <CarouselGallery
            images={images}
            onImageClick={onImageClick}
            className={className}
          />
        )}
        
        {layout === 'grid' && (
          <GridGallery
            images={images}
            onImageClick={onImageClick}
            className={className}
          />
        )}
      </ErrorBoundary>

      {isPreviewOpen && (
        <ImagePreview
          images={images}
          onClose={handleClosePreview}
        />
      )}
    </>
  );
};

export const ImageGallery: React.FC<ImageGalleryProps> = (props) => {
  return (
    <GalleryProvider>
      <ImageGalleryContent {...props} />
    </GalleryProvider>
  );
};

