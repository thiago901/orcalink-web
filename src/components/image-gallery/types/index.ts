export interface ImageType {
  id: string;
  url: string;
  caption?: string;
  width?: number;
  height?: number;
}

export type GalleryLayout = 'grid' | 'masonry' | 'carousel';