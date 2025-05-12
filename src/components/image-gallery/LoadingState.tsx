import React from 'react';

interface LoadingStateProps {
  layout: 'grid' | 'masonry' | 'carousel';
  count?: number;
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  layout,
  count = 6
}) => {
  if (layout === 'carousel') {
    return (
      <div className="w-full overflow-hidden">
        <div className="animate-pulse bg-gray-200 h-64 sm:h-80 md:h-96 w-full rounded-lg"></div>
        <div className="mt-4 flex space-x-2 overflow-x-auto py-1">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-16 w-16 flex-shrink-0 rounded-md"></div>
          ))}
        </div>
      </div>
    );
  }

  if (layout === 'masonry') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <div 
            key={i} 
            className="animate-pulse bg-gray-200 rounded-lg overflow-hidden"
            style={{ 
              height: `${Math.floor(150 + Math.random() * 200)}px`,
              marginTop: i % 2 === 0 ? '0' : '24px'
            }}
          ></div>
        ))}
      </div>
    );
  }

  // Default grid loading
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse bg-gray-200 aspect-square rounded-lg"></div>
      ))}
    </div>
  );
};

export default LoadingState;