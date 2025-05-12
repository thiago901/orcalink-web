import React, { createContext, useContext, useState } from 'react';
import { ImageType } from './types';

interface GalleryContextType {
  selectedImage: ImageType | null;
  setSelectedImage: (image: ImageType | null) => void;
  isPreviewOpen: boolean;
  setIsPreviewOpen: (isOpen: boolean) => void;
}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export const GalleryProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <GalleryContext.Provider
      value={{
        selectedImage,
        setSelectedImage,
        isPreviewOpen,
        setIsPreviewOpen,
      }}
    >
      {children}
    </GalleryContext.Provider>
  );
};

export const useGallery = () => {
  const context = useContext(GalleryContext);
  if (context === undefined) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  return context;
};