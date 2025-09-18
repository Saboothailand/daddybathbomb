import { ShoppingCart, Star, Zap } from "lucide-react";

import type { LanguageKey } from "../App";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  color: string;
  language?: LanguageKey;
  onAddToCart?: () => void;
}

export default function ProductCard({
  name,
  price,
  image,
  description,
  color,
  language = "en",
  onAddToCart,
}: ProductCardProps) {
  return (
    <div className="group bg-[#151B2E] rounded-3xl overflow-hidden comic-border border-4 border-black hover:border-[#FFD700] transition-all duration-300 transform hover:scale-105 comic-button relative">
      {/* Fun stickers */}
      <div className="absolute -top-3 -right-3 w-12 h-12 bg-[#FFD700] rounded-full comic-border border-3 border-black flex items-center justify-center z-20 rotate-12">
        <Star className="w-6 h-6 text-black" />
      </div>
      
      <div className="relative">
        {/* Circular image container with comic styling */}
        <div className="aspect-square p-8">
          <div className="w-full h-full rounded-full overflow-hidden comic-border border-4 border-black bg-gradient-to-br from-[#FF2D55]/30 to-[#007AFF]/30 p-2 relative">
            <div className="w-full h-full rounded-full overflow-hidden">
              <ImageWithFallback
                src={image}
                alt={name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            
            {/* Floating elements around the image */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#00FF88] rounded-full comic-border border-2 border-black animate-pulse"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-[#FFD700] rotate-45 comic-border border-2 border-black animate-pulse"></div>
          </div>
        </div>
        
        {/* Price tag */}
        <div className="absolute top-6 right-6">
          <div className="bg-[#FF2D55] text-white px-4 py-2 rounded-full font-fredoka font-bold text-lg comic-border border-3 border-black transform rotate-12">
            ฿{price.toLocaleString()} {/* $ → ฿ 변경 */}
          </div>
        </div>
        
        {/* Color indicator with comic style */}
        <div className="absolute bottom-6 left-6">
          <div 
            className="w-8 h-8 rounded-full comic-border border-3 border-black shadow-lg"
            style={{ backgroundColor: color }}
          ></div>
        </div>
      </div>
      
      <div className="p-6 pt-0">
        <div className="flex items-center mb-2">
          <Zap className="w-5 h-5 text-[#FFD700] mr-2" />
          <h3 className="font-fredoka text-xl font-bold text-white">{name}</h3>
        </div>
        <p className="font-nunito text-sm text-[#B8C4DB] mb-6 line-clamp-2">{description}</p>
        
        <Button
          className="w-full bg-[#007AFF] hover:bg-[#0051D5] text-white flex items-center justify-center gap-3 font-fredoka font-bold py-4 rounded-2xl comic-border border-3 border-black comic-button text-lg"
          onClick={() => onAddToCart?.()}
        >
          <ShoppingCart className="h-5 w-5" />
          {(language === "th" ? "ใส่ตะกร้า" : "Add to Cart").toUpperCase()}
        </Button>
      </div>
    </div>
  );
}
