import { useMemo, useState } from "react";
import { Star, ShoppingCart, Heart, Zap, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
  colors: string[];
  inStock: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  description?: string;
  gallery?: string[];
}

interface ProductListingCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
  onToggleFavorite?: (productId: string) => void;
  isFavorited?: boolean;
}

export default function ProductListingCard({ 
  product, 
  onAddToCart, 
  onToggleFavorite, 
  isFavorited = false 
}: ProductListingCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const images = useMemo(() => {
    if (product.gallery && product.gallery.length > 0) {
      return product.gallery;
    }
    return [product.image];
  }, [product.gallery, product.image]);

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) 
            ? 'text-[#FFD700] fill-current' 
            : i < rating 
            ? 'text-[#FFD700] fill-current opacity-50'
            : 'text-[#475569]'
        }`}
      />
    ));
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product.id);
    
    // Create sparkle effect
    const sparkle = document.createElement('div');
    sparkle.innerHTML = '✨';
    sparkle.style.position = 'fixed';
    sparkle.style.left = e.clientX + 'px';
    sparkle.style.top = e.clientY + 'px';
    sparkle.style.fontSize = '20px';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '9999';
    sparkle.style.animation = 'sparkleOut 1s ease-out forwards';
    document.body.appendChild(sparkle);
    
    setTimeout(() => sparkle.remove(), 1000);
  };

  return (
    <div 
      className="group relative bg-[#151B2E] rounded-2xl comic-border border-3 border-[#334155] hover:border-[#007AFF] transition-all duration-300 overflow-hidden comic-button"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
        {product.isNew && (
          <Badge className="bg-[#00FF88] text-black font-bold text-xs px-2 py-1 comic-border border-2 border-black">
            NEW!
          </Badge>
        )}
        {product.isBestseller && (
          <Badge className="bg-[#FFD700] text-black font-bold text-xs px-2 py-1 comic-border border-2 border-black">
            ⭐ BESTSELLER
          </Badge>
        )}
        {!product.inStock && (
          <Badge className="bg-[#64748B] text-white font-bold text-xs px-2 py-1 comic-border border-2 border-black">
            OUT OF STOCK
          </Badge>
        )}
      </div>

      {/* Favorite button */}
      {onToggleFavorite && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite(product.id);
          }}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-[#1E293B] border-2 border-[#334155] flex items-center justify-center hover:bg-[#FF2D55] hover:border-[#FF2D55] transition-all duration-200 comic-button"
        >
          <Heart 
            className={`w-4 h-4 transition-colors ${
              isFavorited ? 'text-[#FF2D55] fill-current' : 'text-[#64748B]'
            }`} 
          />
        </button>
      )}

      {/* Product image carousel */}
      <div className="relative overflow-hidden rounded-t-2xl">
        <Carousel
          className="h-full"
          opts={{ loop: images.length > 1, align: "start" }}
        >
          <CarouselContent className="aspect-square">
            {images.map((imageSrc, index) => (
              <CarouselItem key={`${product.id}-image-${index}`} className="h-full">
                <ImageWithFallback
                  src={imageSrc}
                  alt={`${product.name} 이미지 ${index + 1}`}
                  className={`h-full w-full rounded-t-2xl object-cover transition-transform duration-500 ${
                    isHovered ? "scale-105" : "scale-100"
                  } ${imageLoading ? "opacity-0" : "opacity-100"}`}
                  onLoad={() => setImageLoading(false)}
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          {images.length > 1 && (
            <>
              <CarouselPrevious className="left-3 top-1/2 -translate-y-1/2 size-8 bg-black/50 text-white hover:bg-black/70" />
              <CarouselNext className="right-3 top-1/2 -translate-y-1/2 size-8 bg-black/50 text-white hover:bg-black/70" />
            </>
          )}
        </Carousel>

        {imageLoading && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-[#1E293B] via-[#334155] to-[#1E293B]" />
        )}

        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
            isHovered && product.inStock ? "opacity-100" : "opacity-0"
          }`}
        >
          <Button
            onClick={handleAddToCart}
            size="sm"
            className="pointer-events-auto rounded-xl bg-[#FF2D55] px-4 py-2 font-bold text-white shadow-lg hover:bg-[#FF1744]"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Quick Add
          </Button>
        </div>
      </div>

      {/* Product info */}
      <div className="p-4">
        {/* Category */}
        <div className="mb-3">
          <button
            type="button"
            onClick={() => setDetailsOpen((prev) => !prev)}
            className="flex w-full items-center justify-between rounded-xl border border-[#334155] bg-[#10172B] px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-[#94A3B8] transition hover:border-[#007AFF] hover:text-white"
          >
            <span>{product.category}</span>
            {detailsOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Product name */}
        <h3 className="font-nunito font-bold text-white text-lg leading-tight mb-2 line-clamp-2 group-hover:text-[#007AFF] transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {renderStars(product.rating)}
          </div>
          <span className="text-[#64748B] text-sm">
            ({product.reviewCount})
          </span>
        </div>

        {/* Colors */}
        <div className="flex items-center gap-1 mb-3">
          <span className="text-[#64748B] text-sm mr-2">Colors:</span>
          {product.colors.slice(0, 4).map((color, index) => (
            <div
              key={index}
              className="w-4 h-4 rounded-full border border-[#334155]"
              style={{ backgroundColor: color }}
            />
          ))}
          {product.colors.length > 4 && (
            <span className="text-[#64748B] text-xs">+{product.colors.length - 4}</span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl text-[#00FF88]">
              ฿{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-[#64748B] line-through text-sm">
                ฿{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          {product.originalPrice && (
            <Badge className="bg-[#FF2D55] text-white text-xs font-bold">
              SAVE {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </Badge>
          )}
        </div>

        {detailsOpen && (
          <div className="mb-4 rounded-xl border border-[#1E293B] bg-[#10172B] p-4 text-sm text-[#94A3C4]">
            <p className="leading-relaxed">
              {product.description ?? "이 제품은 천연 성분으로 만들어져 아이들과 가족 모두가 즐길 수 있는 슈퍼 히어로 테마 배쓰밤입니다."}
            </p>
          </div>
        )}

        {/* Add to cart button */}
        <Button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`w-full py-3 font-bold rounded-xl comic-button transition-all duration-200 ${
            product.inStock
              ? 'bg-[#007AFF] hover:bg-[#0051D5] text-white'
              : 'bg-[#334155] text-[#64748B] cursor-not-allowed'
          }`}
        >
          {product.inStock ? (
            <>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </>
          ) : (
            'Out of Stock'
          )}
        </Button>
      </div>

      {/* Glow effect on hover */}
      <div className={`absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none ${
        isHovered ? 'shadow-[0_0_30px_rgba(0,122,255,0.3)]' : ''
      }`} />

      {/* Floating action indicators */}
      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 pointer-events-none ${
        isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
      }`}>
        <Zap className="w-8 h-8 text-[#FFD700] animate-pulse" />
      </div>
    </div>
  );
}
