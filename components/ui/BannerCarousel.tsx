
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselItem {
  id: number | string;
  image_url: string;
  title?: string;
}

interface BannerCarouselProps {
  items: CarouselItem[];
  autoPlayInterval?: number;
  aspectRatio?: string; // Tailwind class for aspect ratio (e.g., pb-[25%])
}

const BannerCarousel: React.FC<BannerCarouselProps> = ({ 
  items, 
  autoPlayInterval = 5000,
  aspectRatio = "pb-[25%] md:pb-[25%]" // Default to 4:1 banner
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter out items without valid URLs just in case
  const validItems = items.filter(item => item.image_url);

  useEffect(() => {
    if (validItems.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % validItems.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [validItems.length, autoPlayInterval]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % validItems.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + validItems.length) % validItems.length);
  };

  if (validItems.length === 0) return null;

  return (
    <div className="relative w-full max-w-7xl mx-auto mb-12 rounded-2xl overflow-hidden shadow-2xl bg-zinc-900 group">
      {/* Dynamic Aspect Ratio Container */}
      <div className={`relative ${aspectRatio} h-0`}> 
        {validItems.map((item, index) => (
          <div
            key={item.id}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img
              src={item.image_url}
              alt={item.title || 'Program Banner'}
              className="w-full h-full object-cover"
            />
            {/* Optional gradient overlay for text readability if needed */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows (Only if > 1 item) */}
      {validItems.length > 1 && (
        <>
          <button
            onClick={(e) => { e.preventDefault(); prevSlide(); }}
            className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-red-600 transition-colors z-20 opacity-0 group-hover:opacity-100 duration-300"
          >
            <ChevronLeft size={24} />
          </button>
          <button
             onClick={(e) => { e.preventDefault(); nextSlide(); }}
            className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-red-600 transition-colors z-20 opacity-0 group-hover:opacity-100 duration-300"
          >
            <ChevronRight size={24} />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
            {validItems.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-red-600 w-6' : 'bg-white/50 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BannerCarousel;