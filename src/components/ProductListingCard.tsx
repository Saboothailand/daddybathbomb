import { useState } from "react";
import { Star, ShoppingCart, Heart, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

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

      {/* Product image */}
      <div className="relative aspect-square overflow-hidden rounded-t-2xl">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-500 ${
            isHovered ? 'scale-110' : 'scale-100'
          } ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setImageLoading(false)}
        />
        
        {/* Loading shimmer */}
        {imageLoading && (
          <div className="absolute inset-0 bg-gradient-to-r from-[#1E293B] via-[#334155] to-[#1E293B] animate-pulse" />
        )}
        
        {/* Hover overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />
        
        {/* Quick add button on hover */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
          isHovered && product.inStock ? 'opacity-100' : 'opacity-0'
        }`}>
          <Button
            onClick={handleAddToCart}
            size="sm"
            className="bg-[#FF2D55] hover:bg-[#FF1744] text-white px-4 py-2 rounded-xl comic-button font-bold shadow-lg"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Quick Add
          </Button>
        </div>
      </div>

      {/* Product info */}
      <div className="p-4">
        {/* Category */}
        <div className="flex items-center mb-2">
          <Badge variant="secondary" className="bg-[#334155] text-[#94A3B8] text-xs">
            {product.category}
          </Badge>
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
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-[#64748B] line-through text-sm">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          {product.originalPrice && (
            <Badge className="bg-[#FF2D55] text-white text-xs font-bold">
              SAVE {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </Badge>
          )}
        </div>

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