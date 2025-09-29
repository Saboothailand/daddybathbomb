import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Heart, Star } from 'lucide-react';
import { Button } from './ui/button';

type GalleryItem = {
  id: number | string;
  image_url: string;
  caption?: string;
};

type ImageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  images: GalleryItem[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
};

export default function ImageModal({ 
  isOpen, 
  onClose, 
  images, 
  currentIndex, 
  onIndexChange 
}: ImageModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const currentImage = images[currentIndex];

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setIsLoading(true);
      onIndexChange(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < images.length - 1) {
      setIsLoading(true);
      onIndexChange(currentIndex + 1);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen) return;
    
    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowLeft':
        goToPrevious();
        break;
      case 'ArrowRight':
        goToNext();
        break;
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => setIsLoading(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading, currentIndex]);

  if (!isOpen || !currentImage) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      {/* Close Button */}
      <Button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full border-2 border-white/20"
        size="sm"
      >
        <X className="w-6 h-6" />
      </Button>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <Button
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full border-2 border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            size="sm"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <Button
            onClick={goToNext}
            disabled={currentIndex === images.length - 1}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full border-2 border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            size="sm"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </>
      )}

      {/* Main Image Container */}
      <div className="relative max-w-4xl max-h-[90vh] w-full mx-4">
        <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl">
          {/* Image */}
          <div className="relative">
            <img
              src={currentImage.image_url}
              alt={currentImage.caption || 'Gallery image'}
              className={`w-full h-auto max-h-[70vh] object-contain transition-opacity duration-300 ${
                isLoading ? 'opacity-50' : 'opacity-100'
              }`}
              onLoad={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
            />
            
            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}

            {/* Decorative Elements */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-[#FFD700] rounded-full flex items-center justify-center border-2 border-white">
                <Star className="w-4 h-4 text-black" />
              </div>
              <div className="w-8 h-8 bg-[#FF2D55] rounded-full flex items-center justify-center border-2 border-white">
                <Heart className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* Caption */}
          {currentImage.caption && (
            <div className="p-6 bg-gradient-to-r from-[#FF2D55] to-[#007AFF] text-white">
              <p className="font-nunito text-lg font-semibold text-center">
                {currentImage.caption}
              </p>
            </div>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-4xl w-full px-4 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => onIndexChange(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? 'border-[#FFD700] scale-110'
                  : 'border-white/30 hover:border-white/60'
              }`}
            >
              <img
                src={image.image_url}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
